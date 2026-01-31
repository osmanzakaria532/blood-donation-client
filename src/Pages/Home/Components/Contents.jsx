import Container from '../../../Components/_UI/Container';

const Contact = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for contacting us! We will get back to you soon.');
    e.target.reset();
  };

  return (
    <section className="py-20 px-4 bg-white">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-2xl lg:text-3xl font-bold text-red-700 mb-2">Get In Touch</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have questions? We're here to help you 24/7
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-start md:items-stretch gap-12">
          {/* Contact Info */}
          <div className="flex flex-col gap-8 md:w-1/2">
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 flex items-center justify-center bg-red-100 text-red-600 rounded-full text-xl">
                📞
              </div>
              <div>
                <h3 className="font-semibold text-lg">Emergency Hotline</h3>
                <p>+880 1XXX-XXXXXX</p>
                <p>Available 24/7 for urgent requests</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 flex items-center justify-center bg-red-100 text-red-600 rounded-full text-xl">
                📧
              </div>
              <div>
                <h3 className="font-semibold text-lg">Email Support</h3>
                <p>support@lifestream.org</p>
                <p>We'll respond within 24 hours</p>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-12 h-12 flex items-center justify-center bg-red-100 text-red-600 rounded-full text-xl">
                📍
              </div>
              <div>
                <h3 className="font-semibold text-lg">Office Location</h3>
                <p>Agrabad, Chattogram, Bangladesh</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <form
            className="bg-gray-100 p-3 py-4 md:p-8 rounded-xl shadow-md flex flex-col gap-4 w-full md:w-1/2"
            onSubmit={handleSubmit}
          >
            <input
              type="text"
              placeholder="Full Name"
              required
              className="p-3 rounded border border-gray-300 focus:border-red-600 outline-none"
            />
            <input
              type="email"
              placeholder="Email Address"
              required
              className="p-3 rounded border border-gray-300 focus:border-red-600 outline-none"
            />
            <input
              type="tel"
              placeholder="Phone Number"
              required
              className="p-3 rounded border border-gray-300 focus:border-red-600 outline-none"
            />
            <textarea
              placeholder="Message"
              required
              className="p-3 rounded border border-gray-300 focus:border-red-600 outline-none min-h-37.5"
            />
            <button
              type="submit"
              className="bg-red-700 text-white py-3 rounded font-semibold hover:-translate-y-px transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </Container>
    </section>
  );
};

export default Contact;
