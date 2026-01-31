import { Link } from 'react-router-dom';

const Banner = () => {
  return (
    <section className="relative bg-red-700/95 text-white text-center py-12 md:py-32 px-4">
      <h1 className="text-xl md:text-4xl lg:text-5xl font-bold mb-6 drop-shadow-lg">
        Every Drop Counts, Every Donor Matters
      </h1>
      <p className="max-w-xl mx-auto mb-8  md:text-xl lg:text-lg">
        Join our community of life-savers and help those in urgent need of blood donation. Together,
        we can make a difference.
      </p>
      <div className="flex justify-center gap-4 flex-wrap">
        <Link
          to="/auth/register"
          className="bg-white text-red-600 text-s md:text-base px-4 md:px-6 py-2 md:py-3 rounded-full font-semibold hover:shadow-lg hover:-translate-y-0.5 transition"
        >
          Join as a Donor
        </Link>
        <Link
          to="/search-donors"
          className="border-2 border-white text-white text-sm md:text-base px-4 md:px-6 py-2 md:py-3 rounded-full font-semibold hover:bg-white hover:text-red-600 transition"
        >
          Search Donors
        </Link>
      </div>
    </section>
  );
};

export default Banner;
