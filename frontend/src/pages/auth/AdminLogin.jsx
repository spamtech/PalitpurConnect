
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  LockKeyhole,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { Button, Input } from "../../components/ui";
import { useAuth } from "../../context/AuthContext";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Please enter your username and password.");
      return;
    }

    setLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 700));

    login({
      id: "admin-demo",
      name: "Panchayat Administrator",
      username,
      role: "PANCHAYAT_ADMIN",
    });

    setLoading(false);
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="flex min-h-screen items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to PalitpurConnect
          </Link>

          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-7 shadow-2xl backdrop-blur-xl sm:p-9">
            <div className="mb-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                <ShieldCheck className="h-6 w-6" />
              </div>

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
                Administration
              </p>

              <h1 className="mt-2 text-3xl font-bold text-white">
                Admin Login
              </h1>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Secure access for authorized Panchayat staff
                and administrators.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <Input
                label="Username"
                placeholder="Enter username"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                icon={UserRound}
                className="text-white"
              />

              <Input
                label="Password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                icon={LockKeyhole}
              />

              {error && (
                <div className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                loading={loading}
                disabled={loading}
              >
                Sign in to Admin
                {!loading && (
                  <ArrowRight className="h-4 w-4" />
                )}
              </Button>
            </form>

            <div className="mt-7 border-t border-white/10 pt-6 text-center">
              <Link
                to="/login"
                className="text-sm font-semibold text-emerald-400 hover:text-emerald-300"
              >
                Citizen Login
              </Link>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-slate-600">
            Authorized personnel only
          </p>
        </div>
      </div>
    </div>
  );
}

