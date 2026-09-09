import AdminNavbar from "../components/layout/AdminNavbar";

export default function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#173528] text-[#f7f0d0]">
      <AdminNavbar />

      {/* Main content shifted right on desktop to accommodate the 72 (7rem/18rem = w-72) sidebar */}
      <main className="pt-20 lg:pl-72 lg:pt-0 min-h-screen">
        <div className="mx-auto max-w-[1600px] p-6 sm:p-10 lg:p-12">
          {children}
        </div>
      </main>
    </div>
  );
}