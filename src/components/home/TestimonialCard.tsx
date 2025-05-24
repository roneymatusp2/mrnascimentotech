interface TestimonialCardProps {
  name: string;
  role: string;
  content: string;
  image: string;
}

const TestimonialCard = ({ name, role, content, image }: TestimonialCardProps) => {
  return (
    <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center mb-4">
        <img
          src={image}
          alt={name}
          className="w-12 h-12 rounded-full object-cover mr-4"
        />
        <div>
          <h4 className="font-semibold text-slate-900 dark:text-white">{name}</h4>
          <p className="text-sm text-slate-600 dark:text-slate-400">{role}</p>
        </div>
      </div>
      <p className="text-slate-700 dark:text-slate-300 italic">"{content}"</p>
    </div>
  );
};

export default TestimonialCard;