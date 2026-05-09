const StatCard = ({ title, value }) => {
  return (
    <div className="glass rounded-2xl p-6">
      <p className="text-gray-400 text-sm mb-2">{title}</p>
      <h2 className="text-3xl font-bold">{value}</h2>
    </div>
  );
};

export default StatCard;