import { useState } from "react";
import useAuth from "../../../hooks/useAuth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";

const menuItems = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Websites", href: "/sites" },
  { label: "Contact", href: "/contact" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, logOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logOut();
    setOpen(false);
    navigate("/login");
  };

  return (
    <>
      <nav
        style={{ fontFamily: "Inter, sans-serif" }}
        className="sticky top-0 z-50 bg-[#0a0e27]/95 backdrop-blur border-b border-white/10"
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-6 px-6 py-3">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-orange-600 to-orange-400 flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-[#0a0e27] rotate-45 rounded-sm" />
            </div>
            <span
              className="text-xl font-bold text-white tracking-tight"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Orbit<span className="text-orange-500">Ly</span>
            </span>
          </Link>

          {/* Desktop menu */}
          <ul className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.label} className="relative group">
                  <Link
                    to={item.href}
                    className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? "text-orange-500"
                        : "text-slate-200 hover:text-orange-500 hover:bg-white/5"
                    }`}
                  >
                    {item.label}
                  </Link>
                  <span
                    className={`absolute left-4 right-4 -bottom-0.5 h-0.5 rounded-full bg-orange-500 transition-transform origin-left ${
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    }`}
                  />
                </li>
              );
            })}
          </ul>

          {/* Auth buttons - desktop */}
          <div className="hidden md:flex items-center gap-2.5 shrink-0">
            {user ? (
              <>
                <span className="text-sm text-slate-300">
                  Hi, {user.displayName || user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-5 py-2 rounded-lg text-sm font-semibold border-[1.5px] border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2 rounded-lg text-sm font-semibold border-[1.5px] border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-br from-orange-600 to-orange-500 shadow-md shadow-orange-500/30 hover:-translate-y-0.5 transition-transform"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg border border-white/10 bg-white/5 shrink-0"
          >
            {open ? (
              <X size={18} className="text-white" />
            ) : (
              <Menu size={18} className="text-white" />
            )}
          </button>
        </div>

        {/* Mobile panel */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 bg-[#0a0e27] border-b border-white/10 ${
            open ? "max-h-[520px]" : "max-h-0"
          }`}
        >
          <ul className="flex flex-col px-5 py-2">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.href;
              return (
                <li key={item.label}>
                  <Link
                    to={item.href}
                    onClick={() => setOpen(false)}
                    className={`block py-3.5 border-b border-white/10 text-base font-medium ${
                      isActive ? "text-orange-500 font-bold" : "text-slate-200"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
          <div className="flex gap-2.5 px-5 pb-6 pt-4">
            {user ? (
              <button
                onClick={handleLogout}
                className="flex-1 text-center px-5 py-2.5 rounded-lg text-sm font-semibold border-[1.5px] border-orange-500 text-orange-500"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="flex-1 text-center px-5 py-2.5 rounded-lg text-sm font-semibold border-[1.5px] border-orange-500 text-orange-500"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="flex-1 text-center px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-br from-orange-600 to-orange-500"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;