import { NavLink } from 'react-router-dom';

const NavItem = ({ href, className = '', children }) => {
  return (
    <NavLink
      to={href}
      className={({ isActive }) =>
        `text-white hover:opacity-80 font-semibold ${isActive ? 'bg-rose-50/10' : ''} ${className}`
      }
    >
      {children}
    </NavLink>
  );
};

export default NavItem;
