import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { navLinks } from "../data/mockData";
import { useAuth } from "../context/AuthContext";
import { Stethoscope, Hospital, Bell, LogOut, ChevronDown } from "lucide-react";
import logo from "../assets/logo.png";

function decodeTokenRole(token) {
  try { return JSON.parse(atob(token.split(".")[1])).role || null; }
  catch { return null; }
}

function Navbar() {
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const isAuthPage = pathname === "/auth";
  const { user, token, logout } = useAuth();
  const role = user?.role || decodeTokenRole(token);
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
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <nav className="mx-auto flex md:grid md:grid-cols-[1fr_auto_1fr] w-full max-w-[1152px] items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex justify-start">
          <Link to="/" className="flex items-center">
            <img src={logo} alt="HaloHealth" className="h-[34px] w-auto object-contain" />
          </Link>
        </div>

        <ul className="hidden items-center justify-center gap-1 md:flex">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                to={link.to}
                className={`nav-link rounded-full px-4 py-2 text-[14px] font-semibold transition-all duration-150 ${
                  isActiveLink(link.to)
                    ? "bg-primary text-white hover:bg-primary-hover"
                    : "nav-link--inactive text-text-secondary hover:text-text-primary"
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex justify-end">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownMenuOpen(!isDropdownMenuOpen)}
                className="flex items-center gap-2 rounded-full border border-border bg-background p-1 pr-3 transition hover:bg-surface focus:outline-none"
                aria-expanded={isDropdownMenuOpen}
              >
                <img
                  src={`https://ui-avatars.com/api/?name=${user.fullName || user.username || "User"}&background=FFF1F5&color=FF5C8A`}
                  alt="Foto profil"
                  className="h-8 w-8 rounded-full object-cover"
                />
                <span className="text-[14px] font-semibold text-text-primary">
                  Hi, {user.fullName || user.username || "User"}
                </span>
                <ChevronDown
                  size={16}
                  strokeWidth={2}
                  className={`text-text-secondary transition-transform ${isDropdownMenuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isDropdownMenuOpen && (
                <div className="absolute right-0 z-50 mt-2 w-52 origin-top-right rounded-xl border border-border bg-background py-1 shadow-lg focus:outline-none">
                  {/* Role-based links */}
                  {role === "PATIENT" && (
                    <Link
                      to="/history"
                      onClick={() => setIsDropdownMenuOpen(false)}
                      className="flex w-full items-center gap-2.5 px-4 py-2.5 text-[14px] text-text-primary transition-colors hover:bg-surface"
                    >
                      <Stethoscope size={16} strokeWidth={1.75} className="text-text-secondary" />
                      Konsultasi Saya
                    </Link>
                  )}
                  {role === "DOCTOR" && (
                    <>
                      <Link
                        to="/doctor/dashboard"
                        onClick={() => setIsDropdownMenuOpen(false)}
                        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-[14px] text-text-primary transition-colors hover:bg-surface"
                      >
                        <Hospital size={16} strokeWidth={1.75} className="text-text-secondary" />
                        Dashboard Dokter
                      </Link>
                      <Link
                        to="/doctor/requests"
                        onClick={() => setIsDropdownMenuOpen(false)}
                        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-[14px] text-text-primary transition-colors hover:bg-surface"
                      >
                        <Bell size={16} strokeWidth={1.75} className="text-text-secondary" />
                        Permintaan Masuk
                      </Link>
                    </>
                  )}
                  <div className="my-1 border-t border-border" />
                  <button
                    onClick={() => {
                      setIsDropdownMenuOpen(false);
                      logout();
                      navigate("/");
                    }}
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-[14px] text-error transition-colors hover:bg-error-light"
                  >
                    <LogOut size={16} strokeWidth={1.75} />
                    Keluar
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to={isAuthPage ? "/" : "/auth"}
              className="rounded-xl bg-primary px-5 py-2.5 text-[14px] font-semibold text-white transition-all duration-150 hover:bg-primary-hover"
            >
              {isAuthPage ? "Beranda" : "Masuk"}
            </Link>
          )}
        </div>
      </nav>

      <div className="mx-auto flex w-full max-w-[1152px] gap-1 overflow-x-auto px-4 pb-3 md:hidden">
        {navLinks.map((link) => (
          <Link
            key={link.name}
            to={link.to}
            className={`nav-link rounded-full px-3 py-1.5 text-[13px] font-medium whitespace-nowrap transition ${
              isActiveLink(link.to)
                ? "bg-primary text-white hover:bg-primary-hover"
                : "nav-link--inactive text-text-secondary"
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
