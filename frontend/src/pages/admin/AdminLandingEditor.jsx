import { useState, useEffect } from "react";
import { api } from "../../services/api";
import { Button, Input } from "../../components/ui";
import { Upload, Link as LinkIcon, X, Plus, Image as ImageIcon, Layers, Sparkles } from "lucide-react";

export default function AdminLandingEditor() {
  const [sectionKey, setSectionKey] = useState("hero_main");
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  
  const [imageSourceType, setImageSourceType] = useState("file"); // 'file' or 'url'
  const [imageFiles, setImageFiles] = useState([]);
  const [imageUrl, setImageUrl] = useState("");

  // Gallery specific metadata inputs (for title & description per item)
  const [itemTitle, setItemTitle] = useState("");
  const [itemDesc, setItemDesc] = useState("");
  const [galleryItems, setGalleryItems] = useState([]); // Array of { file/url, title, description }

  // Villages section specific custom area cards state
  const [areas, setAreas] = useState([
    { name: "পালিতপুর মেইন", icon: "Home", summary: "গ্রামের প্রাণকেন্দ্র — বাজারের গলি ও প্রাথমিক বিদ্যালয়।", tags: "বাজার, পঞ্চায়েত, বিদ্যালয়" },
    { name: "আমতলা পাড়া", icon: "Sprout", summary: "চারদিকে আমবাগান ও খোলা ধানখেত, মাঠের রাস্তা ধরে সারিবদ্ধ ঘরবাড়ি।", tags: "আমবাগান, কৃষিজমি, বাড়িঘর" },
    { name: "উত্তর পল্লী", icon: "Landmark", summary: "উত্তর দিকের পাড়া, মন্দিরের আঙিনা ও সান্ধ্য সমাবেশের জন্য পরিচিত।", tags: "মন্দির, আঙিনা, সমাবেশ" },
    { name: "পুকুর ডাঙা", icon: "Waves", summary: "পুকুর, মাছ ধরা ও স্নানের ঘাট যা প্রতিটি সকালের ছন্দ গড়ে তোলে।", tags: "পুকুর, ঘাট, মৎস্য শিকার" }
  ]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch existing section content when sectionKey changes to pre-populate inputs
  useEffect(() => {
    async function fetchSectionData() {
      try {
        const response = await api.getLandingContent();
        const section = (response?.data || []).find(s => s.section_key === sectionKey);
        if (section) {
          setTitle(section.title || "");
          setSubtitle(section.subtitle || "");
          if (sectionKey === "villages_section" && Array.isArray(section.areas) && section.areas.length > 0) {
            setAreas(section.areas.map(a => ({
              ...a,
              tags: Array.isArray(a.tags) ? a.tags.join(", ") : a.tags
            })));
          }
        } else {
          setTitle("");
          setSubtitle("");
        }
      } catch (err) {
        console.error("Failed to load section data", err);
      }
    }
    fetchSectionData();
  }, [sectionKey]);

  const handleAddGalleryItem = () => {
    if (imageSourceType === "file" && imageFiles.length === 0) return;
    if (imageSourceType === "url" && !imageUrl.trim()) return;

    const newItem = {
      type: imageSourceType,
      file: imageSourceType === "file" ? imageFiles[0] : null,
      url: imageSourceType === "url" ? imageUrl.trim() : "",
      name: imageSourceType === "file" ? imageFiles[0].name : imageUrl.trim(),
      title: itemTitle.trim() || "Palitpur Moment",
      description: itemDesc.trim() || "Captured moment from village life.",
    };

    setGalleryItems((prev) => [...prev, newItem].slice(0, 10));
    setImageFiles([]);
    setImageUrl("");
    setItemTitle("");
    setItemDesc("");
  };

  const removeGalleryItem = (index) => {
    setGalleryItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAreaChange = (index, field, value) => {
    setAreas(prev => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const handleAddArea = () => {
    setAreas(prev => [...prev, { name: "", icon: "Home", summary: "", tags: "" }]);
  };

  const handleRemoveArea = (index) => {
    setAreas(prev => prev.filter((_, i) => i !== index));
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

      if (sectionKey === "villages_section") {
        const formattedAreas = areas.map(a => ({
          ...a,
          tags: typeof a.tags === "string" ? a.tags.split(",").map(t => t.trim()).filter(Boolean) : a.tags
        }));
        formData.append("areas", JSON.stringify(formattedAreas));
      }

      if (sectionKey === "village_gallery" && galleryItems.length > 0) {
        const metadata = galleryItems.map(item => ({
          title: item.title,
          description: item.description,
          url: item.type === "url" ? item.url : undefined
        }));
        formData.append("gallery_metadata", JSON.stringify(metadata));

        galleryItems.forEach((item) => {
          if (item.type === "file" && item.file) {
            formData.append("images", item.file);
          }
        });
      } else {
        if (imageFiles.length > 0) {
          imageFiles.forEach((file) => {
            formData.append("images", file);
          });
        }
        if (imageUrl.trim() !== "") {
          formData.append("image_url", imageUrl.trim());
        }
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
    <section className="min-h-screen bg-[#361a0d] text-[#faebd7] relative isolate overflow-hidden p-6 sm:p-10 lg:p-12">
      {/* Retro ambient background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 bottom-0 h-96 w-96 rounded-full bg-[#e68a45]/10 blur-3xl" />
        <div className="absolute -right-24 top-0 h-96 w-96 rounded-full bg-[#d4a373]/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#faebd7]/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(#faebd7_1px,transparent_1px)] [background-size:12px_12px]" />
      </div>

      <div className="mx-auto max-w-3xl rounded-[28px] border-[3px] border-[#221208] bg-[#4a2512] p-8 text-[#faebd7] shadow-[12px_12px_0_rgba(34,18,8,0.3)] relative z-10">
        <div className="inline-flex items-center gap-2 rounded-xl border-[2px] border-[#221208] bg-[#faebd7] px-4 py-1.5 text-xs font-black text-[#221208] shadow-[3px_3px_0_#221208] uppercase tracking-wider mb-3">
          <Sparkles size={14} className="text-[#e68a45]" />
          <span>Landing Page Control 🛠️</span>
        </div>

        <h2 className="text-3xl font-black text-[#faebd7] tracking-tight mb-2">Manage Landing Page</h2>
        <p className="text-sm font-medium text-[#eddcd2] mb-8">Update public section text and carousel banners (up to 10 images).</p>
        
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-[#faebd7] mb-2">Target Section</label>
            <select 
              value={sectionKey} 
              onChange={(e) => setSectionKey(e.target.value)}
              className="w-full rounded-xl border-2 border-[#221208] bg-white p-3 text-sm font-black text-[#221208] outline-none transition focus:border-[#4a2512] focus:ring-2 focus:ring-[#e68a45] cursor-pointer shadow-[3px_3px_0_#221208]"
            >
              <option value="hero_main">Hero Main Heading & Images</option>
              <option value="community_section">Community Section Banner</option>
              <option value="village_gallery">Village Gallery (Images with Titles & Descriptions)</option>
              <option value="villages_section">Explore Villages Section (Custom Area Cards)</option>
              <option value="culture_section">Culture & Heritage Showcase</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-[#faebd7] mb-2">Main Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter updated title"
              required
              className="w-full rounded-xl border-2 border-[#221208] bg-white px-4 py-3 text-sm font-semibold text-[#221208] outline-none transition focus:border-[#4a2512] focus:ring-2 focus:ring-[#e68a45]"
            />
          </div>
          
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-[#faebd7] mb-2">Description / Subtitle</label>
            <textarea 
              value={subtitle} 
              onChange={(e) => setSubtitle(e.target.value)}
              rows={4} 
              placeholder="Enter description text..."
              className="w-full resize-y rounded-xl border-2 border-[#221208] bg-white px-4 py-3 text-sm font-semibold text-[#221208] outline-none transition focus:border-[#4a2512] focus:ring-2 focus:ring-[#e68a45]"
              required
            />
          </div>

          {/* SPECIAL CONTROLS FOR VILLAGES SECTION (CUSTOM AREA CARDS CONFIG) */}
          {sectionKey === "villages_section" && (
            <div className="space-y-4 rounded-[24px] border-[3px] border-[#221208] bg-[#faebd7] p-6 text-[#221208] shadow-[6px_6px_0_#221208]">
              <div className="flex items-center justify-between border-b-2 border-[#221208]/15 pb-3">
                <h3 className="text-sm font-black text-[#221208] flex items-center gap-2">
                  <Layers size={16} className="text-[#e68a45]" />
                  Configure Neighbourhood / Area Cards
                </h3>
                <button type="button" onClick={handleAddArea} className="text-xs font-black bg-[#e68a45] text-[#221208] px-4 py-2 rounded-xl border-2 border-[#221208] shadow-[3px_3px_0_#221208] hover:bg-[#f4a261] transition">
                  + Add Area Card
                </button>
              </div>

              <div className="space-y-3">
                {areas.map((area, index) => (
                  <div key={index} className="bg-white p-4 rounded-xl border-2 border-[#221208] space-y-3 relative shadow-[4px_4px_0_#221208]">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-[#5a321a]">Card #{index + 1}</span>
                      {areas.length > 1 && (
                        <button type="button" onClick={() => handleRemoveArea(index)} className="text-red-600 hover:text-red-800 font-black">
                          <X size={16} />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={area.name}
                        onChange={(e) => handleAreaChange(index, "name", e.target.value)}
                        placeholder="Area Name (e.g., পালিতপুর মেইন)"
                        className="rounded-lg border-2 border-[#221208] p-2 text-xs font-bold text-[#221208] outline-none"
                        required
                      />
                      <select
                        value={area.icon}
                        onChange={(e) => handleAreaChange(index, "icon", e.target.value)}
                        className="rounded-lg border-2 border-[#221208] p-2 text-xs font-black text-[#221208] outline-none bg-white cursor-pointer"
                      >
                        <option value="Home">Icon: Home</option>
                        <option value="Sprout">Icon: Sprout</option>
                        <option value="Landmark">Icon: Landmark</option>
                        <option value="Waves">Icon: Waves</option>
                      </select>
                    </div>
                    <textarea
                      value={area.summary}
                      onChange={(e) => handleAreaChange(index, "summary", e.target.value)}
                      placeholder="Short summary description..."
                      rows={2}
                      className="w-full rounded-lg border-2 border-[#221208] p-2 text-xs font-semibold text-[#221208] outline-none"
                      required
                    />
                    <input
                      type="text"
                      value={area.tags}
                      onChange={(e) => handleAreaChange(index, "tags", e.target.value)}
                      placeholder="Tags separated by comma (e.g., বাজার, পঞ্চায়েত, বিদ্যালয়)"
                      className="w-full rounded-lg border-2 border-[#221208] p-2 text-xs font-semibold text-[#221208] outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SPECIAL CONTROLS FOR VILLAGE GALLERY (TITLE + DESC PER IMAGE) */}
          {sectionKey === "village_gallery" ? (
            <div className="space-y-4 rounded-[24px] border-[3px] border-[#221208] bg-[#faebd7] p-6 text-[#221208] shadow-[6px_6px_0_#221208]">
              <h3 className="text-sm font-black text-[#221208] flex items-center gap-2">
                <ImageIcon size={16} className="text-[#e68a45]" />
                Add Gallery Items (Image + Title + Description)
              </h3>

              <div className="flex gap-2 p-1 bg-[#221208]/10 rounded-xl w-fit border-2 border-[#221208]">
                <button
                  type="button"
                  onClick={() => setImageSourceType("file")}
                  className={`px-3 py-1.5 text-xs font-black rounded-lg transition ${imageSourceType === "file" ? "bg-[#e68a45] text-[#221208] shadow-[2px_2px_0_#221208]" : "text-[#5a321a]"}`}
                >
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setImageSourceType("url")}
                  className={`px-3 py-1.5 text-xs font-black rounded-lg transition ${imageSourceType === "url" ? "bg-[#e68a45] text-[#221208] shadow-[2px_2px_0_#221208]" : "text-[#5a321a]"}`}
                >
                  Online Link
                </button>
              </div>

              {imageSourceType === "file" ? (
                <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-[#221208] bg-white p-3 text-xs font-black text-[#221208] shadow-[3px_3px_0_#221208] hover:bg-slate-50 transition">
                  <Upload size={16} className="text-[#4a2512]" />
                  <span>{imageFiles.length > 0 ? imageFiles[0].name : "Choose image file..."}</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => e.target.files[0] && setImageFiles([e.target.files[0]])} 
                    className="hidden" 
                  />
                </label>
              ) : (
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full rounded-xl border-2 border-[#221208] bg-white p-2.5 text-xs font-semibold text-[#221208] outline-none"
                />
              )}

              <input
                type="text"
                value={itemTitle}
                onChange={(e) => setItemTitle(e.target.value)}
                placeholder="Image Moment Title (e.g., Pukur Danga Morning)"
                className="w-full rounded-xl border-2 border-[#221208] bg-white p-2.5 text-xs font-semibold text-[#221208] outline-none"
              />

              <textarea
                value={itemDesc}
                onChange={(e) => setItemDesc(e.target.value)}
                placeholder="Image Moment Description..."
                rows={2}
                className="w-full rounded-xl border-2 border-[#221208] bg-white p-2.5 text-xs font-semibold text-[#221208] outline-none"
              />

              <button type="button" onClick={handleAddGalleryItem} className="w-full text-xs font-black py-3 rounded-xl border-2 border-[#221208] bg-[#4a2512] text-[#faebd7] shadow-[3px_3px_0_#221208] hover:bg-[#361a0d] transition flex items-center justify-center gap-2">
                <Plus size={14} /> Add to Gallery Queue ({galleryItems.length}/10)
              </button>

              {galleryItems.length > 0 && (
                <div className="space-y-2 pt-2">
                  <p className="text-xs font-black text-[#221208]">Queued Items ({galleryItems.length}):</p>
                  {galleryItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border-2 border-[#221208] text-xs shadow-[2px_2px_0_#221208]">
                      <div>
                        <p className="font-black text-[#221208]">{item.title}</p>
                        <p className="text-[10px] font-medium text-[#5a321a] truncate max-w-[280px]">{item.description}</p>
                      </div>
                      <button type="button" onClick={() => removeGalleryItem(idx)} className="text-red-600 hover:text-red-800 p-1 font-black">
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* STANDARD IMAGE UPLOAD FOR OTHER SECTIONS */
            <div className="space-y-3">
              <label className="block text-xs font-black uppercase tracking-wider text-[#faebd7]">Section Banner Images (Up to 10)</label>
              <div className="flex gap-2 p-1 bg-[#221208]/10 rounded-xl w-fit border-2 border-[#221208]">
                <button
                  type="button"
                  onClick={() => setImageSourceType("file")}
                  className={`px-4 py-2 text-xs font-black rounded-lg transition ${imageSourceType === "file" ? "bg-[#e68a45] text-[#221208] shadow-[2px_2px_0_#221208]" : "text-[#5a321a]"}`}
                >
                  Upload from Device
                </button>
                <button
                  type="button"
                  onClick={() => setImageSourceType("url")}
                  className={`px-4 py-2 text-xs font-black rounded-lg transition ${imageSourceType === "url" ? "bg-[#e68a45] text-[#221208] shadow-[2px_2px_0_#221208]" : "text-[#5a321a]"}`}
                >
                  Online Image Link
                </button>
              </div>

              {imageSourceType === "file" ? (
                <div className="space-y-3">
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#221208] bg-white p-4 text-xs font-black text-[#221208] shadow-[3px_3px_0_#221208] hover:bg-slate-50 transition">
                    <Upload size={18} className="text-[#4a2512]" />
                    <span>Choose up to 10 image files...</span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      multiple
                      onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        if (files.length > 0) setImageFiles((prev) => [...prev, ...files].slice(0, 10));
                      }} 
                      className="hidden" 
                    />
                  </label>

                  {imageFiles.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {imageFiles.map((file, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border-2 border-[#221208] text-xs font-semibold text-[#221208] shadow-[2px_2px_0_#221208]">
                          <span className="truncate max-w-[120px]">{file.name}</span>
                          <button type="button" onClick={() => setImageFiles(prev => prev.filter((_, i) => i !== idx))} className="text-red-600 hover:text-red-800 font-black">
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="relative">
                  <LinkIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#5a321a]" />
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/banner-image.jpg"
                    className="w-full rounded-xl border-2 border-[#221208] bg-white py-3 pl-10 pr-4 text-sm font-semibold text-[#221208] outline-none"
                  />
                </div>
              )}
            </div>
          )}

          {message && <p className="text-xs font-black text-[#221208] bg-emerald-200 p-4 rounded-xl border-2 border-[#221208] shadow-[3px_3px_0_#221208]">{message}</p>}

          <button type="submit" disabled={loading} className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-[#221208] bg-[#e68a45] px-8 py-4 text-sm font-black text-[#221208] shadow-[4px_4px_0_#221208] transition hover:bg-[#f4a261] disabled:opacity-50">
            {loading ? "Publishing..." : "Publish Changes Live"}
          </button>
        </form>
      </div>
    </section>
  );
}