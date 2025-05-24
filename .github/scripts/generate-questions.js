const { createClient } = require('@supabase/supabase-js');
const { MistralClient } = require('@mistralai/mistralai');
const { argv } = require('process');

// Parse command line arguments
const args = argv.slice(2);
const params = {};
for (let i = 0; i < args.length; i += 2) {
  if (args[i].startsWith('--')) {
    params[args[i].substring(2)] = args[i + 1];
  }
}

// Set default values if not provided
const topic = params.topic || 'auto';
const level = params.level || 'auto';
const quantity = parseInt(params.quantity || '5', 10);

// Initialize clients
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const mistral = new MistralClient(process.env.MISTRAL_API_KEY);

async function run() {
  try {
    console.log(`Starting question generation process...`);
    console.log(`Topic: ${topic}, Level: ${level}, Quantity: ${quantity}`);
    
    // If auto, choose random topics and levels
    let topicIds = [];
    let levelIds = [];
    
    if (topic === 'auto') {
      // Get random topics
      const { data: topics, error: topicError } = await supabase
        .from('question_topics')
        .select('id')
        .is('parent_id', null)
        .limit(3);
      
      if (topicError) throw new Error(`Failed to fetch topics: ${topicError.message}`);
      topicIds = topics.map(t => t.id);
    } else {
      // Find topic by name
      const { data: topicData, error: topicError } = await supabase
        .from('question_topics')
        .select('id')
        .ilike('name', `%${topic}%`)
        .limit(1);
      
      if (topicError || !topicData.length) {
        throw new Error(`Topic not found: ${topic}`);
      }
      
      topicIds = [topicData[0].id];
    }
    
    if (level === 'auto') {
      // Get all levels
      const { data: levels, error: levelError } = await supabase
        .from('question_levels')
        .select('id');
      
      if (levelError) throw new Error(`Failed to fetch levels: ${levelError.message}`);
      levelIds = levels.map(l => l.id);
    } else {
      // Find level by name
      const { data: levelData, error: levelError } = await supabase
        .from('question_levels')
        .select('id')
        .eq('name', level)
        .limit(1);
      
      if (levelError || !levelData.length) {
        throw new Error(`Level not found: ${level}`);
      }
      
      levelIds = [levelData[0].id];
    }
    
    // Create generation jobs
    const cognitivelevels = ['knowledge', 'comprehension', 'application', 'analysis'];
    let jobsCreated = 0;
    
    for (const topicId of topicIds) {
      for (const levelId of levelIds) {
        // Select a random cognitive level
        const cognitiveLevel = cognitivelevels[Math.floor(Math.random() * cognitivelevels.length)];
        
        // Get topic and level details for the prompt
        const { data: topicData } = await supabase
          .from('question_topics')
          .select('name')
          .eq('id', topicId)
          .single();
          
        const { data: levelData } = await supabase
          .from('question_levels')
          .select('name')
          .eq('id', levelId)
          .single();
          
        // Create a job
        const prompt = `Generate ${quantity} math questions for ${levelData.name} students on the topic of "${topicData.name}". 
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

        const { data: job, error: jobError } = await supabase
          .from('ai_generation_jobs')
          .insert({
            topic_id: topicId,
            level_id: levelId,
            cognitive_level: cognitiveLevel,
            quantity: quantity,
            prompt: prompt,
            created_by: 'github-action', // Special user ID for the GitHub action
            status: 'pending'
          })
          .select()
          .single();
          
        if (jobError) {
          console.error(`Failed to create job: ${jobError.message}`);
          continue;
        }
        
        console.log(`Created job ${job.id} for ${topicData.name} at ${levelData.name} level`);
        jobsCreated++;
        
        // Process the job immediately
        await processJob(job);
      }
    }
    
    console.log(`Created and processed ${jobsCreated} generation jobs`);
  } catch (error) {
    console.error(`Error in generation process: ${error.message}`);
    process.exit(1);
  }
}

async function processJob(job) {
  try {
    console.log(`Processing job ${job.id}...`);
    
    // Update job status
    await supabase
      .from('ai_generation_jobs')
      .update({ status: 'in-progress' })
      .eq('id', job.id);
    
    // Get topic and level info
    const { data: topicData } = await supabase
      .from('question_topics')
      .select('name')
      .eq('id', job.topic_id)
      .single();
      
    const { data: levelData } = await supabase
      .from('question_levels')
      .select('name')
      .eq('id', job.level_id)
      .single();
    
    // Call Mistral AI
    console.log(`Calling Mistral AI for ${topicData.name} (${levelData.name})...`);
    const chatResponse = await mistral.chat({
      model: "mistral-medium",
      messages: [
        { role: "user", content: job.prompt }
      ],
    });
    
    // Log API interaction
    await supabase.from('ai_generation_history').insert({
      job_id: job.id,
      prompt: job.prompt,
      response: chatResponse,
      tokens_used: chatResponse.usage?.totalTokens || 0,
      model_used: "mistral-medium",
      created_by: job.created_by
    });
    
    // Parse and process the response
    const responseContent = chatResponse.messages[0].content;
    let questions = [];
    
    try {
      // Extract JSON from the response
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
      
      // Validate and filter questions
      questions = questions.filter(q => 
        q.statement_md && 
        Array.isArray(q.options) && 
        q.options.length >= 2 && 
        typeof q.correct_option === 'number' &&
        q.solution_md
      );
      
      console.log(`Successfully parsed ${questions.length} questions`);
      
      // Save questions to database
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
      
      // Update job status
      await supabase
        .from('ai_generation_jobs')
        .update({ 
          status: 'completed', 
          completed_at: new Date().toISOString(),
          questions_generated: questions.length
        })
        .eq('id', job.id);
        
      console.log(`Job ${job.id} completed successfully with ${questions.length} questions`);
    } catch (parseError) {
      console.error(`Failed to parse AI response: ${parseError.message}`);
      
      // Update job with error
      await supabase
        .from('ai_generation_jobs')
        .update({ 
          status: 'failed', 
          error_message: `Failed to parse AI response: ${parseError.message}`
        })
        .eq('id', job.id);
    }
  } catch (error) {
    console.error(`Error processing job ${job.id}: ${error.message}`);
    
    // Update job with error
    await supabase
      .from('ai_generation_jobs')
      .update({ 
        status: 'failed', 
        error_message: `Job processing error: ${error.message}`
      })
      .eq('id', job.id);
  }
}

// Run the script
run().catch(console.error);