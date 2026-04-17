import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLogin, useRegister } from "../../hooks";

const INITIAL_LOGIN_FORM = {
  email: "",
  password: "",
};

const INITIAL_REGISTER_FORM = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  telephoneNumber: "",
  dob: "",
  gender: "MALE",
};

function AuthPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");

  const {
    mutateAsync: login,
    isPending: isLoginPending,
    error: loginError,
  } = useLogin();
  const {
    mutateAsync: register,
    isPending: isRegisterPending,
    error: registerError,
  } = useRegister();

  const [loginForm, setLoginForm] = useState(INITIAL_LOGIN_FORM);
  const [registerForm, setRegisterForm] = useState(INITIAL_REGISTER_FORM);
  const [registerFormError, setRegisterFormError] = useState("");

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const data = await login(loginForm);

      if (data?.token || data?.accessToken || data?.access_token) {
        localStorage.setItem(
          "token",
          data.token || data.accessToken || data.access_token,
        );
      }
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterFormError("");

    if (registerForm.password !== registerForm.confirmPassword) {
      setRegisterFormError("Password tidak cocok!");
      return;
    }

    try {
      await register(registerForm);

      setActiveTab("login");
      setLoginForm({ ...INITIAL_LOGIN_FORM, email: registerForm.email });
      setRegisterForm(INITIAL_REGISTER_FORM);
    } catch (error) {
      console.error("Register failed:", error);
    }
  };

  return (
    <div className="bg-auth-gradient min-h-screen px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <Link
          to="/"
          className="mb-5 inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-100"
        >
          Kembali
        </Link>

        <div className="mx-auto w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-5 shadow-xl sm:p-7">
          <div className="mb-6 rounded-2xl bg-slate-100 p-1">
            <div className="grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => setActiveTab("login")}
                className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                  activeTab === "login"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("register")}
                className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${
                  activeTab === "register"
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Register
              </button>
            </div>
          </div>

          {activeTab === "login" ? (
            <form className="space-y-4" onSubmit={handleLogin}>
              {loginError && (
                <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
                  {loginError instanceof Error
                    ? loginError.message
                    : "Terjadi kesalahan saat login."}
                </div>
              )}
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">
                  Email
                </span>
                <input
                  type="email"
                  name="email"
                  placeholder="Masukkan email"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 transition outline-none focus:border-red-400"
                  value={loginForm.email}
                  onChange={handleLoginChange}
                  required
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">
                  Password
                </span>
                <input
                  type="password"
                  name="password"
                  placeholder="Masukkan password"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 transition outline-none focus:border-red-400"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  required
                />
              </label>
              <button
                type="submit"
                disabled={isLoginPending}
                className="w-full rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-70"
              >
                {isLoginPending ? "Memproses..." : "Masuk Sekarang"}
              </button>
              <p className="text-center text-xs text-slate-500">
                Lupa password? Hubungi support HaloHealth.
              </p>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={handleRegister}>
              {(registerError || registerFormError) && (
                <div className="rounded-xl bg-red-50 p-3 text-sm text-red-600">
                  {registerFormError ||
                    (registerError instanceof Error
                      ? registerError.message
                      : "Terjadi kesalahan saat mendaftar.")}
                </div>
              )}
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">
                  Nama Lengkap
                </span>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Masukkan nama lengkap"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 transition outline-none focus:border-red-400"
                  value={registerForm.fullName}
                  onChange={handleRegisterChange}
                  required
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">
                  Email
                </span>
                <input
                  type="email"
                  name="email"
                  placeholder="nama@email.com"
                  className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 transition outline-none focus:border-red-400"
                  value={registerForm.email}
                  onChange={handleRegisterChange}
                  required
                />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-slate-700">
                    No. Telepon
                  </span>
                  <input
                    type="tel"
                    name="telephoneNumber"
                    placeholder="Contoh: 08123456789"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 transition outline-none focus:border-red-400"
                    value={registerForm.telephoneNumber}
                    onChange={handleRegisterChange}
                    required
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-slate-700">
                    Tanggal Lahir
                  </span>
                  <input
                    type="date"
                    name="dob"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 transition outline-none focus:border-red-400"
                    value={registerForm.dob}
                    onChange={handleRegisterChange}
                    required
                  />
                </label>
              </div>
              <label className="block">
                <span className="mb-1 block text-sm font-medium text-slate-700">
                  Jenis Kelamin
                </span>
                <select
                  name="gender"
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 transition outline-none focus:border-red-400"
                  value={registerForm.gender}
                  onChange={handleRegisterChange}
                  required
                >
                  <option value="MALE">Laki-laki</option>
                  <option value="FEMALE">Perempuan</option>
                </select>
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-slate-700">
                    Password
                  </span>
                  <input
                    type="password"
                    name="password"
                    placeholder="Buat password"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 transition outline-none focus:border-red-400"
                    value={registerForm.password}
                    onChange={handleRegisterChange}
                    required
                  />
                </label>
                <label className="block">
                  <span className="mb-1 block text-sm font-medium text-slate-700">
                    Konfirmasi Password
                  </span>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Ulangi password"
                    className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-900 transition outline-none focus:border-red-400"
                    value={registerForm.confirmPassword}
                    onChange={handleRegisterChange}
                    required
                  />
                </label>
              </div>
              <button
                type="submit"
                disabled={isRegisterPending}
                className="w-full rounded-xl bg-red-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-600 disabled:opacity-70"
              >
                {isRegisterPending ? "Memproses..." : "Buat Akun"}
              </button>
              <p className="text-center text-xs text-slate-500">
                Dengan mendaftar, kamu setuju dengan syarat layanan.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
