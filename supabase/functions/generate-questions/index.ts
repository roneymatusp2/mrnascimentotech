// Supabase Edge Function for generating math questions using Mistral AI
import { createClient } from 'npm:@supabase/supabase-js@2.38.4';
import { MistralClient } from 'npm:@mistralai/mistralai@0.0.8';

// Define types
interface GenerationJob {
  id: string;
  topic_id: string;
  level_id: string;
  cognitive_level: string;
  quantity: number;
  prompt: string;
  status: string;
  created_by: string;
}

interface QuestionData {
  statement_md: string;
  solution_md: string;
  options: any[];
  correct_option: number;
  academic_level: string;
  topic_id: string;
  cognitive_level: string;
  generation_job_id: string;
  generated_by_ai: boolean;
}

// Initialize Supabase client with environment variables
const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Initialize Mistral AI client
const mistralApiKey = Deno.env.get('MISTRAL_API_KEY') || 'Y9axn09O0SsxShtxWJHE34tGzRR52ZHz';
const mistral = new MistralClient(mistralApiKey);

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Helper function to craft prompts for different question types
function craftPrompt(topic: string, level: string, cognitiveLevel: string, quantity: number): string {
  const basePrompt = `Generate ${quantity} math questions for ${level} students on the topic of "${topic}". 
These should be at the ${cognitiveLevel} cognitive level.

For each question:
1. Create a clear statement in markdown format
2. Provide 4 multiple-choice options (A, B, C, D) where only one is correct
3. Include a detailed step-by-step solution with explanations
4. Label the correct option (0-based index)

Return the result as a JSON array with this structure for each question:
{
  "statement_md": "Question text in markdown",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct_option": 0, // 0-based index of correct answer
  "solution_md": "Detailed solution in markdown"
}`;

  return basePrompt;
}

// Process a job and generate questions
async function processJob(job: GenerationJob) {
  try {
    // Update job status to in-progress
    await supabase
      .from('ai_generation_jobs')
      .update({ status: 'in-progress' })
      .eq('id', job.id);
    
    // Fetch topic and level information
    const { data: topicData, error: topicError } = await supabase
      .from('question_topics')
      .select('name')
      .eq('id', job.topic_id)
      .single();
    
    if (topicError) throw new Error(`Topic fetch error: ${topicError.message}`);
    
    const { data: levelData, error: levelError } = await supabase
      .from('question_levels')
      .select('name')
      .eq('id', job.level_id)
      .single();
    
    if (levelError) throw new Error(`Level fetch error: ${levelError.message}`);
    
    // Craft the prompt based on topic, level, and cognitive level
    const prompt = job.prompt || craftPrompt(
      topicData.name,
      levelData.name,
      job.cognitive_level,
      job.quantity
    );
    
    // Call Mistral AI API
    const chatResponse = await mistral.chat({
      model: "mistral-medium",
      messages: [
        { role: "user", content: prompt }
      ],
    });
    
    // Save the API interaction to history
    await supabase.from('ai_generation_history').insert({
      job_id: job.id,
      prompt: prompt,
      response: chatResponse,
      tokens_used: chatResponse.usage?.totalTokens || 0,
      model_used: "mistral-medium",
      created_by: job.created_by
    });
    
    // Parse the response to extract questions
    const responseContent = chatResponse.messages[0].content;
    let questions: QuestionData[] = [];
    
    try {
      // Try to extract JSON from the response
      const jsonMatch = responseContent.match(/```json\n([\s\S]*?)\n```/) || 
                        responseContent.match(/\[\n?\s*{[\s\S]*}\n?\s*\]/);
                        
      if (jsonMatch && jsonMatch[1]) {
        questions = JSON.parse(jsonMatch[1]);
      } else if (responseContent.includes('[') && responseContent.includes(']')) {
        // Try to extract JSON array directly
        const jsonStr = responseContent.substring(
          responseContent.indexOf('['),
          responseContent.lastIndexOf(']') + 1
        );
        questions = JSON.parse(jsonStr);
      } else {
        throw new Error("Could not extract JSON from response");
      }
      
      // Validate each question
      questions = questions.filter(q => 
        q.statement_md && 
        Array.isArray(q.options) && 
        q.options.length >= 2 && 
        typeof q.correct_option === 'number' &&
        q.solution_md
      );
      
      // Insert questions into the database
      for (const question of questions) {
        await supabase.from('questions').insert({
          statement_md: question.statement_md,
          solution_md: question.solution_md,
          options: question.options,
          correct_option: question.correct_option,
          academic_level: levelData.name,
          topic_id: job.topic_id,
          cognitive_level: job.cognitive_level,
          generation_job_id: job.id,
          generated_by_ai: true,
          topic: topicData.name.toLowerCase() // For compatibility with existing schema
        });
      }
      
      // Update job as completed
      await supabase
        .from('ai_generation_jobs')
        .update({ 
          status: 'completed', 
          completed_at: new Date().toISOString(),
          questions_generated: questions.length
        })
        .eq('id', job.id);
        
      return { success: true, questionsGenerated: questions.length };
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      
      // Update job with error
      await supabase
        .from('ai_generation_jobs')
        .update({ 
          status: 'failed', 
          error_message: `Failed to parse AI response: ${parseError.message}`
        })
        .eq('id', job.id);
        
      return { success: false, error: parseError.message };
    }
  } catch (error) {
    console.error("Job processing error:", error);
    
    // Update job with error
    await supabase
      .from('ai_generation_jobs')
      .update({ 
        status: 'failed', 
        error_message: `Job processing error: ${error.message}`
      })
      .eq('id', job.id);
      
    return { success: false, error: error.message };
  }
}

// Main handler
Deno.serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }
  
  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Parse request body
    const { jobId } = await req.json();
    
    if (!jobId) {
      return new Response(JSON.stringify({ error: "Job ID is required" }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Fetch the job
    const { data: job, error: jobError } = await supabase
      .from('ai_generation_jobs')
      .select('*')
      .eq('id', jobId)
      .eq('status', 'pending')
      .single();
    
    if (jobError || !job) {
      return new Response(JSON.stringify({ error: "Job not found or not in pending status" }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Process the job
    const result = await processJob(job);
    
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});