import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext"; // পাথ তোমার ফোল্ডার অনুযায়ী ঠিক করে নিও

const menuItems = [
  { label: "হোম", href: "#", active: true },
  { label: "আমাদের সম্পর্কে", href: "#" },
  { label: "সার্ভিস", href: "#" },
  { label: "পোর্টফোলিও", href: "#" },
  { label: "যোগাযোগ", href: "#" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    setOpen(false);
    navigate("/login");
  };

  return (
    <div style={{ fontFamily: "Inter, sans-serif" }}>
      <nav className="sticky top-0 z-50 bg-stone-50/90 backdrop-blur border-b border-stone-200">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-6 px-6 py-3">
          {/* Brand */}
          <a href="#" className="flex items-center gap-2 shrink-0">
            <div className="relative w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-800 to-emerald-600 flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-amber-500 rotate-45 rounded-sm" />
            </div>
            <span
              className="text-xl font-bold text-stone-900 tracking-tight"
              style={{ fontFamily: "Georgia, serif" }}
            >
              Orbit<span className="text-emerald-700">Ly</span>
            </span>
          </a>

          {/* Desktop menu */}
          <ul className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {menuItems.map((item) => (
              <li key={item.label} className="relative group">
                <a
                  href={item.href}
                  className={`block px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    item.active
                      ? "text-emerald-800"
                      : "text-stone-800 hover:text-emerald-800 hover:bg-emerald-800/5"
                  }`}
                >
                  {item.label}
                </a>
                <span
                  className={`absolute left-4 right-4 -bottom-0.5 h-0.5 rounded-full bg-amber-500 transition-transform origin-left ${
                    item.active
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </li>
            ))}
          </ul>

          {/* Auth buttons - desktop */}
          <div className="hidden md:flex items-center gap-2.5 shrink-0">
            {user ? (
              <>
                <span className="text-sm text-stone-600">
                  হাই, {user.displayName || user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-5 py-2 rounded-lg text-sm font-semibold border-[1.5px] border-emerald-800 text-emerald-800 hover:bg-emerald-800 hover:text-white transition-colors"
                >
                  লগআউট
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2 rounded-lg text-sm font-semibold border-[1.5px] border-emerald-800 text-emerald-800 hover:bg-emerald-800 hover:text-white transition-colors"
                >
                  লগইন
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 rounded-lg text-sm font-semibold text-white bg-gradient-to-br from-amber-500 to-amber-600 shadow-md shadow-amber-500/30 hover:-translate-y-0.5 transition-transform"
                >
                  রেজিস্ট্রেশন
                </Link>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg border border-stone-200 bg-white shrink-0"
          >
            {open ? (
              <X size={18} className="text-stone-900" />
            ) : (
              <Menu size={18} className="text-stone-900" />
            )}
          </button>
        </div>

        {/* Mobile panel */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 bg-stone-50 border-b border-stone-200 ${
            open ? "max-h-[520px]" : "max-h-0"
          }`}
        >
          <ul className="flex flex-col px-5 py-2">
            {menuItems.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`block py-3.5 border-b border-stone-200 text-base font-medium ${
                    item.active
                      ? "text-emerald-800 font-bold"
                      : "text-stone-800"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex gap-2.5 px-5 pb-6 pt-4">
            {user ? (
              <button
                onClick={handleLogout}
                className="flex-1 text-center px-5 py-2.5 rounded-lg text-sm font-semibold border-[1.5px] border-emerald-800 text-emerald-800"
              >
                লগআউট
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="flex-1 text-center px-5 py-2.5 rounded-lg text-sm font-semibold border-[1.5px] border-emerald-800 text-emerald-800"
                >
                  লগইন
                </Link>
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="flex-1 text-center px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-gradient-to-br from-amber-500 to-amber-600"
                >
                  রেজিস্ট্রেশন
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Demo content so you can see the navbar in context */}
      <div className="max-w-3xl mx-auto text-center py-16 px-6 text-stone-500">
        <h1
          className="text-3xl font-bold text-stone-900 mb-3"
          style={{ fontFamily: "Georgia, serif" }}
        >
          Fully Responsive Navbar
        </h1>
        <p>স্ক্রিন সাইজ ছোট করে (বা মোবাইলে) দেখুন — hamburger menu কাজ করবে।</p>
      </div>
    </div>
  );
};

export default Navbar;