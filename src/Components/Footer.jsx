import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Container from './_UI/Container';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300 py-12">
      <Container className="px-2 md:px-0">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-red-700 font-semibold text-lg mb-4">About LifeStream</h3>
            <p>
              LifeStream is dedicated to connecting blood donors with those in urgent need. Every
              donation has the power to save lives.
            </p>

            {/* social links (external, so <a> ই থাকবে) */}

            <div className="flex gap-3 mt-4">
              <Link
                to="https://facebook.com"
                target="_blank"
                className="bg-gray-700 p-2 flex items-center justify-center rounded-full hover:bg-red-700 transition"
              >
                <FaFacebookF />
              </Link>

              <Link
                to="https://twitter.com"
                target="_blank"
                className="bg-gray-700 p-2  flex items-center justify-center rounded-full hover:bg-red-700 transition"
              >
                <FaTwitter />
              </Link>

              <Link
                to="https://linkedin.com"
                target="_blank"
                className="bg-gray-700 p-2  flex items-center justify-center rounded-full hover:bg-red-700 transition"
              >
                <FaLinkedinIn />
              </Link>

              <Link
                to="https://instagram.com"
                target="_blank"
                className="bg-gray-700 p-2 flex items-center justify-center rounded-full hover:bg-red-700 transition"
              >
                <FaInstagram />
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-red-700 font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="flex flex-col gap-2">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/search">Search Donors</Link>
              </li>
              <li>
                <Link to="/donation-requests">Donation Requests</Link>
              </li>
              <li>
                <Link to="/register">Become a Donor</Link>
              </li>
              <li>
                <Link to="/funding">Funding Campaigns</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-red-700 font-semibold text-lg mb-4">Resources</h3>
            <ul className="flex flex-col gap-2">
              <li>
                <Link to="/about">About Blood Donation</Link>
              </li>
              <li>
                <Link to="/eligibility">Donor Eligibility</Link>
              </li>
              <li>
                <Link to="/faq">FAQ</Link>
              </li>
              <li>
                <Link to="/blog">Health Blog</Link>
              </li>
              <li>
                <Link to="/partner-hospitals">Partner Hospitals</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-red-700 font-semibold text-lg mb-4">Legal</h3>
            <ul className="flex flex-col gap-2">
              <li>
                <Link to="/privacy">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms">Terms of Service</Link>
              </li>
              <li>
                <Link to="/disclaimer">Medical Disclaimer</Link>
              </li>
              <li>
                <Link to="/contact">Contact Us</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="text-center text-gray-400 border-t border-gray-700 pt-4">
          © 2025 LifeStream. All rights reserved. Saving lives, one donation at a time.
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
