import Container from '../../../Components/_UI/Container';

const Featured = () => {
  const features = [
    {
      icon: '🔍',
      title: 'Quick Search',
      desc: 'Find compatible blood donors in your area within seconds. Search by blood type, location, and availability to get instant results.',
    },
    {
      icon: '🚨',
      title: 'Emergency Alerts',
      desc: 'Receive instant notifications for urgent blood donation requests near you. Be there when someone needs you the most.',
    },
    {
      icon: '🛡️',
      title: 'Verified Donors',
      desc: 'All donors are verified with proper documentation and health screening to ensure safe and reliable blood donations.',
    },
    {
      icon: '📱',
      title: 'Easy Communication',
      desc: 'Direct messaging system to connect with donors or recipients. Coordinate appointments and share important details securely.',
    },
    {
      icon: '📊',
      title: 'Donation History',
      desc: 'Track your donation journey, view your impact, and maintain a complete record of all your life-saving contributions.',
    },
    {
      icon: '💰',
      title: 'Funding Support',
      desc: 'Create or contribute to fundraising campaigns for patients who need financial assistance along with blood donations.',
    },
  ];

  return (
    <section className="bg-gray-100 py-20 px-4">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-2xl lg:text-3xl md:text-4xl font-bold text-red-700 mb-2">
            Why Choose LifeStream?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Connecting donors with those in need through a seamless and secure platform
          </p>
        </div>

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white p-4 lg:p-8 rounded-xl shadow-md hover:shadow-xl hover:-translate-y-2 transition text-center"
            >
              <div className="text-4xl  lg:w-20 h-12 lg:h-20 mx-auto mb-4 flex items-center justify-center rounded-full bg-red-100 text-red-700">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm lg:text-base">{feature.desc}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default Featured;
