import { useState } from "react";
import { api } from "../../services/api";
import { Button, Input } from "../../components/ui";
import { Upload, Link as LinkIcon, X } from "lucide-react";

export default function AdminLandingEditor() {
  const [sectionKey, setSectionKey] = useState("hero_main");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  
  const [imageSourceType, setImageSourceType] = useState("file"); // 'file' or 'url'
  const [imageFiles, setImageFiles] = useState([]);
  const [imageUrl, setImageUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    // Limit to maximum 10 images total
    if (files.length > 0) {
      setImageFiles((prev) => [...prev, ...files].slice(0, 10));
    }
  };

  const removeFile = (index) => {
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("section_key", sectionKey);
      formData.append("title", title);
      formData.append("subtitle", subtitle);

      // Append files if any are selected from device
      if (imageFiles.length > 0) {
        imageFiles.forEach((file) => {
          formData.append("images", file);
        });
      }

      // Append online image link if provided
      if (imageUrl.trim() !== "") {
        formData.append("image_url", imageUrl.trim());
      }

      await api.updateLandingContentMultipart(formData);
      setMessage("Landing section and images published successfully!");
    } catch (err) {
      setMessage(err.message || "Failed to update content.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl border border-amber-200/60 shadow-xl">
      <h2 className="text-2xl font-black text-slate-900 mb-2">Manage Landing Page 🛠️</h2>
      <p className="text-sm text-slate-500 mb-6">Update public section text and carousel banners (up to 10 images).</p>
      
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Target Section</label>
          <select 
            value={sectionKey} 
            onChange={(e) => setSectionKey(e.target.value)}
            className="w-full rounded-xl border border-slate-200 p-3 text-sm font-semibold text-slate-800 outline-none focus:border-emerald-500"
          >
            <option value="hero_main">Hero Main Heading & Images</option>
            <option value="community_section">Community Section Banner</option>
            <option value="villages_section">Explore Villages Section</option>
            <option value="culture_section">Culture & Heritage Showcase</option>
          </select>
        </div>

        <Input label="Main Title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter updated title" required />
        
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">Description / Subtitle</label>
          <textarea 
            value={subtitle} 
            onChange={(e) => setSubtitle(e.target.value)}
            rows={4} 
            placeholder="Enter description text..."
            className="w-full rounded-xl border border-slate-200 p-3 text-sm font-medium text-slate-800 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            required
          />
        </div>

        {/* Image Source Toggle */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">Section Banner Images (Up to 10)</label>
          <div className="flex gap-2 p-1 bg-slate-100 rounded-xl w-fit">
            <button
              type="button"
              onClick={() => setImageSourceType("file")}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition ${imageSourceType === "file" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"}`}
            >
              Upload from Device
            </button>
            <button
              type="button"
              onClick={() => setImageSourceType("url")}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition ${imageSourceType === "url" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"}`}
            >
              Online Image Link
            </button>
          </div>

          {imageSourceType === "file" ? (
            <div className="space-y-3">
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm font-semibold text-slate-700 hover:bg-emerald-50/50 hover:border-emerald-400 transition">
                <Upload size={18} className="text-emerald-600" />
                <span>Choose up to 10 image files...</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  multiple
                  onChange={handleFileSelect} 
                  className="hidden" 
                />
              </label>

              {imageFiles.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {imageFiles.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-slate-100 px-3 py-2 rounded-xl text-xs font-medium text-slate-700">
                      <span className="truncate max-w-[120px]">{file.name}</span>
                      <button type="button" onClick={() => removeFile(idx)} className="text-rose-500 hover:text-rose-700">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="relative">
              <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/banner-image.jpg"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm font-medium text-slate-900 outline-none focus:border-emerald-500 focus:bg-white"
              />
            </div>
          )}
        </div>

        {message && <p className="text-xs font-bold text-emerald-700 bg-emerald-50 p-3 rounded-xl border border-emerald-200">{message}</p>}

        <Button type="submit" loading={loading} className="w-full bg-slate-900 hover:bg-slate-950 text-white font-bold py-3">
          Publish Changes Live
        </Button>
      </form>
    </div>
  );
}