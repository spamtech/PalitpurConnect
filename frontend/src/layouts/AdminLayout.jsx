
import AdminNavbar from "../components/layout/AdminNavbar";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <AdminNavbar />

      <main className="pt-16">
        {children}
      </main>
    </div>
  );
}

