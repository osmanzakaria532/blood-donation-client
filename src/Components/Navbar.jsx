import { useState } from 'react';
import { Link } from 'react-router-dom';
import Container from './_UI/Container';
import Logo from './_UI/Logo';
import NavItem from './_UI/NavItem';

const Navbar = () => {
  const [open, setOpen] = useState(false);

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
        <nav className="navbar shadow-sm md:px-0">
          <div className="navbar-start">
            <Logo />
          </div>

          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1">{links}</ul>
          </div>

          <div className="navbar-end">
            <Link to="/" className="btn btn-sm btn-soft text-base">
              Log In
            </Link>

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
