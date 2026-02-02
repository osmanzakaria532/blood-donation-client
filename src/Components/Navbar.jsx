import { useState } from 'react';
import { MdArrowOutward } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../Hooks/useAuth';
import Container from './_UI/Container';
import Logo from './_UI/Logo';
import NavItem from './_UI/NavItem';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, logOut } = useAuth();

  const handleSignOut = () => {
    logOut()
      .then((result) => {
        console.log(result);
        toast.success('Sign Out Successfully');
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const links = (
    <>
      <li onClick={() => setOpen(false)}>
        <NavItem children="Home" href="/" />
      </li>
      <li onClick={() => setOpen(false)}>
        <NavItem children="Donation Requests" href="/donation-requests" />
      </li>
      <li onClick={() => setOpen(false)}>
        <NavItem children="Funding" href="/funding" />
      </li>
    </>
  );

  return (
    <div className="bg-red-700/95 shadow sticky top-0 z-50">
      <Container>
        <nav className="navbar shadow-sm xl:px-0">
          <div className="navbar-start">
            <Logo />
          </div>

          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1">{links}</ul>
          </div>

          <div className="navbar-end">
            {/* <Link to="/" className="btn btn-sm btn-soft text-base">
              Log In
            </Link> */}
            {user ? (
              <>
                <div onClick={() => setOpen(!open)} className="relative cursor-pointer">
                  <img
                    src={user?.photoURL}
                    alt="Profile photo"
                    className="rounded-full w-10 h-10"
                    title={user?.displayName}
                  />
                  {open && (
                    <div className="w-32 absolute -right-2 mt-3 bg-white px-2 py-2 space-y-1.5 flex flex-col justify-end items-end text-center">
                      <div className="w-full">
                        <Link to="/dashboard" className="py-2 px-3 block bg-gray-400/10 ">
                          Dashboard
                        </Link>
                      </div>
                      <div className="w-full">
                        <button onClick={handleSignOut} className="btn px-3 w-full">
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link to="/auth/sign-in" className="flex">
                <span className="btn bg-gray-100 rounded-lg px-2 md:px-4 py-1 text-sm md:text-base">
                  Sign in
                </span>
                <span className="rounded-full w-10 h-10 bg-white md:flex items-center justify-center ms-1 hidden">
                  <MdArrowOutward className=" text-red-600 text-2xl" />
                </span>
              </Link>
            )}

            {/* mobile dropdown */}
            <div className={`dropdown dropdown-end lg:hidden ${open ? 'dropdown-open' : ''}`}>
              <div
                onClick={() => setOpen(!open)}
                role="button"
                className="btn btn-sm btn-ghost ml-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h8m-8 6h16"
                  />
                </svg>
              </div>

              <ul
                className={`
                  menu menu-sm dropdown-content
                  bg-red-700/95 rounded-box
                  mt-3 w-72 p-2 shadow
                  right-0
                  transform transition-transform duration-300 ease-in-out
                  ${open ? 'translate-x-0' : 'translate-x-full'}
                `}
              >
                {links}
              </ul>
            </div>
          </div>
        </nav>
      </Container>
    </div>
  );
};

export default Navbar;
