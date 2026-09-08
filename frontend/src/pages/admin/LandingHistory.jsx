import { useEffect, useState } from "react";
import { api } from "../../services/api";
import { Card, Button } from "../../components/ui";
import { History, Trash2, Edit3, Globe, ArrowLeft } from "lucide-react";
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
    <div className="max-w-6xl mx-auto space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <History className="h-6 w-6 text-emerald-600" /> Landing Page History & Logs
          </h2>
          <p className="text-sm text-slate-500 mt-1">Review all active custom uploads, changes, and update logs published by administrators.</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/admin/landing")} className="flex items-center gap-2">
          <ArrowLeft size={16} /> Back to Editor
        </Button>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold">
          {message}
        </div>
      )}

      <Card className="p-6 bg-white border border-slate-200 shadow-xl rounded-3xl">
        {loading ? (
          <p className="text-sm text-slate-500 text-py-8 text-center">Loading history logs...</p>
        ) : history.length === 0 ? (
          <div className="text-center py-12">
            <Globe className="h-12 w-12 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-medium text-slate-600">No content history found.</p>
            <p className="text-xs text-slate-400 mt-1">Publish changes from the Landing Editor to track them here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 text-xs uppercase tracking-wider">
                  <th className="py-3 px-4">Section Key</th>
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Subtitle Preview</th>
                  <th className="py-3 px-4">Last Updated</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {history.map((item) => (
                  <tr key={item.section_key} className="hover:bg-slate-50/80 transition">
                    <td className="py-4 px-4 font-bold text-slate-900">{item.section_key}</td>
                    <td className="py-4 px-4 truncate max-w-xs">{item.title}</td>
                    <td className="py-4 px-4 truncate max-w-xs text-slate-500">{item.subtitle}</td>
                    <td className="py-4 px-4 text-slate-400 text-xs whitespace-nowrap">{new Date(item.updated_at).toLocaleString()}</td>
                    <td className="py-4 px-4 text-right space-x-2 whitespace-nowrap">
                      <button 
                        onClick={() => navigate("/admin/landing")} 
                        className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 px-3 py-1.5 rounded-lg text-xs font-bold transition"
                      >
                        <Edit3 size={13} /> Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(item.section_key)} 
                        className="inline-flex items-center gap-1 bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs font-bold transition"
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
      </Card>
    </div>
  );
}