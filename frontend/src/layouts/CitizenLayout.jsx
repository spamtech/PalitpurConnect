
import CitizenNavbar from "../components/layout/CitizenNavbar";
import CitizenFooter from "../components/layout/CitizenFooter";
export default function CitizenLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <CitizenNavbar />

      <main className="pt-16">
        {children}
      </main>

      <CitizenFooter />
    </div>
  );
}

