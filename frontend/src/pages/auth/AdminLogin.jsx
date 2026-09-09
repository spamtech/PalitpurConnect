import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  LockKeyhole,
  ShieldCheck,
  UserRound,
  Sparkles,
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
    <div className="min-h-screen bg-[#173528] text-[#f7f0d0] relative isolate overflow-hidden flex items-center justify-center px-6 py-12">
      {/* Retro ambient background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 bottom-0 h-96 w-96 rounded-full bg-[#b8d85a]/10 blur-3xl" />
        <div className="absolute -right-24 top-0 h-96 w-96 rounded-full bg-[#6f9f43]/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#e6ad45]/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(#f7f0d0_1px,transparent_1px)] [background-size:12px_12px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-xs font-black text-[#173528] transition hover:bg-[#e6ad45] rounded-2xl border-[2px] border-[#0c2218] bg-[#b8d85a] px-4 py-2.5 shadow-[4px_4px_0_#0c2218]"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to PalitpurConnect
        </Link>

        <div className="rounded-[24px] border-[3px] border-[#0c2218] bg-[#f7f0d0] p-8 sm:p-9 text-[#173528] shadow-[10px_10px_0_rgba(12,34,24,0.3)]">
          <div className="mb-8">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-[#173528] bg-[#b8d85a] text-[#173528] shadow-[4px_4px_0_#0c2218]">
              <ShieldCheck className="h-7 w-7" />
            </div>

            <span className="inline-flex rounded-xl bg-[#2d684d] px-3.5 py-1 text-xs font-black border-2 border-[#0c2218] text-[#f7f0d0] shadow-[3px_3px_0_#0c2218] tracking-widest uppercase">
              Administration
            </span>

            <h1 className="mt-4 text-3xl font-black tracking-tight text-[#173528]">
              Admin Login 🛡️
            </h1>

            <p className="mt-2 text-sm font-medium leading-relaxed text-[#42604e]">
              Secure access for authorized Panchayat staff and administrators.
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
              <div className="rounded-2xl border-2 border-[#0c2218] bg-red-100 px-4 py-3 text-xs font-bold text-red-800 shadow-[4px_4px_0_#0c2218]">
                {error}
              </div>
            )}

            <Button
              type="submit"
              className="w-full rounded-2xl border-[2px] border-[#0c2218] bg-[#b8d85a] py-3 text-xs font-black text-[#173528] shadow-[4px_4px_0_#0c2218] transition-all hover:-translate-y-0.5 hover:bg-[#e6ad45] hover:shadow-[5px_5px_0_#0c2218]"
              loading={loading}
              disabled={loading}
            >
              Sign in to Admin
              {!loading && (
                <ArrowRight className="ml-2 h-4 w-4" />
              )}
            </Button>
          </form>

          <div className="mt-7 border-t-2 border-[#173528]/15 pt-6 text-center">
            <Link
              to="/login"
              className="text-xs sm:text-sm font-black text-[#2d684d] hover:text-[#b07820] transition-colors"
            >
              Citizen Login
            </Link>
          </div>
        </div>

        <p className="mt-6 text-center text-xs font-bold uppercase tracking-wider text-[#a7b89a]">
          Authorized personnel only
        </p>
      </div>
    </div>
  );
}