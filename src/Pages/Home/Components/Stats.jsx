const statsData = [
  { number: '15,000+', label: 'Registered Donors' },
  { number: '8,500+', label: 'Lives Saved' },
  { number: '1,200+', label: 'Active Requests' },
  { number: '50+', label: 'Partner Hospitals' },
];

const Stats = () => {
  return (
    <section className="bg-red-700 text-white py-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {statsData.map((stat, idx) => (
          <div key={idx}>
            <div className="text-3xl md:text-4xl font-bold mb-2">{stat.number}</div>
            <div className="text-lg opacity-90">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Stats;
