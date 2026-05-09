const InterviewCard = ({ title, role, questions }) => {
  return (
    <div className="glass rounded-3xl p-6 hover:scale-[1.02] transition duration-300">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-gray-400 text-sm mt-1">{role}</p>
        </div>

        <div className="w-14 h-14 rounded-2xl bg-linear-to-r from-violet-500 to-cyan-500 flex items-center justify-center text-xl">
          🤖
        </div>
      </div>

      <div className="flex justify-between items-center text-sm text-gray-400 mb-6">
        <p>{questions} Questions</p>
        <p>Realtime Voice</p>
      </div>

      <button className="w-full py-3 rounded-xl bg-violet-600 hover:bg-violet-700 transition">
        Start Interview
      </button>
    </div>
  );
};

export default InterviewCard;