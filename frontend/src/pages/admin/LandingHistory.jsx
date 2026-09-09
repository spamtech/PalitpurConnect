import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { Button } from "../../components/ui";
import { History, Trash2, Edit3, Globe, ArrowLeft, RefreshCw, Sparkles, Layers } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await api.getAllLandingContentAdmin();
      setHistory(res.data || []);
    } catch (err) {
      console.error("Failed to load landing history", err);
      setMessage("Failed to load change history.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (key) => {
    if (!window.confirm(`Are you sure you want to delete the content for ${key}?`)) return;
    try {
      await api.deleteLandingSection(key);
      setMessage(`Deleted section ${key} successfully.`);
      fetchHistory();
    } catch (err) {
      setMessage(err.message || "Failed to delete section.");
    }
  };

  return (
    <section className="min-h-screen bg-[#361a0d] text-[#faebd7] relative isolate overflow-hidden p-6 sm:p-10 lg:p-12">
      {/* Retro ambient background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 bottom-0 h-96 w-96 rounded-full bg-[#e68a45]/10 blur-3xl" />
        <div className="absolute -right-24 top-0 h-96 w-96 rounded-full bg-[#d4a373]/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#faebd7]/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(#faebd7_1px,transparent_1px)] [background-size:12px_12px]" />
      </div>

      <div className="mx-auto max-w-5xl rounded-[28px] border-[3px] border-[#221208] bg-[#4a2512] p-8 text-[#faebd7] shadow-[12px_12px_0_rgba(34,18,8,0.3)] relative z-10 space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b-2 border-[#221208]/20 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-xl border-[2px] border-[#221208] bg-[#faebd7] px-4 py-1.5 text-xs font-black text-[#221208] shadow-[3px_3px_0_#221208] uppercase tracking-wider mb-3">
              <Sparkles size={14} className="text-[#e68a45]" />
              <span>Landing Logs 📜</span>
            </div>
            <h2 className="text-3xl font-black text-[#faebd7] tracking-tight mb-1">Landing Page History & Logs</h2>
            <p className="text-sm font-medium text-[#eddcd2]">Review all active custom uploads, changes, and update logs published by administrators.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={fetchHistory} 
              className="inline-flex items-center gap-2 rounded-xl border-2 border-[#221208] bg-[#faebd7] px-4 py-2.5 text-xs font-black text-[#221208] shadow-[3px_3px_0_#221208] hover:bg-[#e68a45] transition cursor-pointer"
            >
              <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh Logs
            </Button>
            <Button 
              variant="outline" 
              onClick={() => navigate("/admin/landing")} 
              className="inline-flex items-center gap-2 rounded-xl border-2 border-[#221208] bg-[#faebd7] px-4 py-2.5 text-xs font-black text-[#221208] shadow-[3px_3px_0_#221208] hover:bg-[#e68a45] transition cursor-pointer"
            >
              <ArrowLeft size={14} /> Back to Editor
            </Button>
          </div>
        </div>

        {message && (
          <div className="p-4 rounded-xl bg-emerald-200 border-2 border-[#221208] text-[#221208] text-xs font-black shadow-[3px_3px_0_#221208] flex items-center justify-between">
            <span>{message}</span>
            <button onClick={() => setMessage("")} className="text-[#221208] hover:text-black font-black text-base">×</button>
          </div>
        )}

        {/* Content Box */}
        <div className="rounded-[24px] border-[3px] border-[#221208] bg-[#faebd7] p-6 text-[#221208] shadow-[6px_6px_0_#221208] overflow-hidden">
          {loading ? (
            <div className="py-16 text-center space-y-3">
              <RefreshCw className="h-6 w-6 text-[#e68a45] animate-spin mx-auto" />
              <p className="text-xs font-black text-[#5a321a]">Loading history logs...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="text-center py-16 px-4">
              <div className="w-12 h-12 bg-[#221208]/10 rounded-full flex items-center justify-center mx-auto mb-3 text-[#5a321a] border-2 border-[#221208]">
                <Globe className="h-6 w-6" />
              </div>
              <p className="text-sm font-black text-[#221208]">No content history found.</p>
              <p className="text-xs font-medium text-[#5a321a] mt-1">Publish changes from the Landing Editor to track them here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b-2 border-[#221208]/15 text-[#5a321a] uppercase font-black tracking-wider">
                    <th className="py-3 px-4">Section Key</th>
                    <th className="py-3 px-4">Title</th>
                    <th className="py-3 px-4">Subtitle Preview</th>
                    <th className="py-3 px-4">Last Updated</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#221208]/10 font-semibold text-[#221208]">
                  {history.map((item) => (
                    <tr key={item.section_key} className="hover:bg-[#221208]/5 transition-colors">
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-mono font-black bg-white text-[#221208] border-2 border-[#221208] shadow-[2px_2px_0_#221208]">
                          {item.section_key}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-black truncate max-w-xs">{item.title || "—"}</td>
                      <td className="py-4 px-4 text-[#5a321a] truncate max-w-xs">{item.subtitle || "—"}</td>
                      <td className="py-4 px-4 text-[#5a321a] font-mono text-[11px] whitespace-nowrap">
                        {item.updated_at ? new Date(item.updated_at).toLocaleString() : "—"}
                      </td>
                      <td className="py-4 px-4 text-right space-x-2 whitespace-nowrap">
                        <button 
                          onClick={() => navigate("/admin/landing")} 
                          className="inline-flex items-center gap-1 bg-[#4a2512] text-[#faebd7] hover:bg-[#361a0d] px-3 py-1.5 rounded-xl border-2 border-[#221208] text-xs font-black transition shadow-[2px_2px_0_#221208]"
                        >
                          <Edit3 size={13} /> Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(item.section_key)} 
                          className="inline-flex items-center gap-1 bg-red-600 text-white hover:bg-red-700 px-3 py-1.5 rounded-xl border-2 border-[#221208] text-xs font-black transition shadow-[2px_2px_0_#221208]"
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}