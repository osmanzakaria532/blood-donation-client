import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <div>
      <Link to="/" className="flex items-center gap-2 text-white font-bold text-xl">
        <div className="p-0.5 md:w-10 md:h-10 bg-white text-red-600 rounded-full flex items-center justify-center">
          🩸
        </div>
        LifeStream
      </Link>
    </div>
  );
};

export default Logo;
