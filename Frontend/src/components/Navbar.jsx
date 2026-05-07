import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { navLinks } from "../data/mockData";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const isAuthPage = pathname === "/auth";
  const { user, logout } = useAuth();
  const [isDropdownMenuOpen, setIsDropdownMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const isActiveLink = (to) => {
    if (to === "/") {
      return pathname === "/" && (hash === "" || hash === "#");
    }

    const hashStartIndex = to.indexOf("#");

    if (hashStartIndex !== -1) {
      const targetHash = to.slice(hashStartIndex);
      return pathname === "/" && hash === targetHash;
    }

    return pathname === to;
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-red-500 text-sm font-bold text-white shadow-sm">
            H+
          </span>
          <div>
            <p className="text-sm font-bold tracking-wide text-slate-900">
              HaloHealth
            </p>
            <p className="text-xs text-slate-500">Kesehatan jadi lebih mudah</p>
          </div>
        </Link>

        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                to={link.to}
                className={`nav-link rounded-full px-4 py-2 text-sm font-medium transition ${
                  isActiveLink(link.to)
                    ? "bg-red-500 text-white shadow-sm transition-all duration-300 ease-out hover:bg-red-600 hover:shadow-none"
                    : "nav-link--inactive text-slate-700"
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {user ? (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownMenuOpen(!isDropdownMenuOpen)}
              className="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1 pr-3 shadow-sm transition hover:bg-slate-50 focus:outline-none"
            >
              <img
                src={`https://ui-avatars.com/api/?name=${user.fullName || user.username || "User"}&background=random`}
                alt="Profile"
                className="h-8 w-8 rounded-full object-cover"
              />
              <span className="text-sm font-semibold text-slate-700">
                Hi, {user.fullName || user.username || "User"}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 text-slate-500 transition-transform ${isDropdownMenuOpen ? "rotate-180" : ""}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isDropdownMenuOpen && (
              <div className="ring-opacity-5 absolute right-0 z-50 mt-2 w-48 origin-top-right rounded-xl border border-slate-200 bg-white py-1 shadow-lg ring-1 ring-black focus:outline-none">
                <button
                  onClick={() => {
                    setIsDropdownMenuOpen(false);
                    logout();
                    navigate("/");
                  }}
                  className="flex w-full items-center px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="mr-2 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to={isAuthPage ? "/" : "/auth"}
            className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            {isAuthPage ? "Beranda" : "Masuk"}
          </Link>
        )}
      </nav>

      <div className="mx-auto flex w-full max-w-6xl gap-1 overflow-x-auto px-4 pb-3 md:hidden">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.to}
            className={`nav-link rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap transition ${
              isActiveLink(link.to)
                ? "bg-red-500 text-white shadow-sm transition-all duration-300 ease-out hover:bg-red-600 hover:shadow-none"
                : "nav-link--inactive text-slate-700"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </div>
    </header>
  );
}

export default Navbar;
