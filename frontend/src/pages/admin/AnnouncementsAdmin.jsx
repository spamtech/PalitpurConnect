import {
  Bell,
  Edit,
  Loader2,
  Plus,
  Trash2,
  X,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";

import { api } from "../../services/api";
import { Button } from "../../components/ui";

const EMPTY_FORM = {
  title: "",
  description: "",
  category: "general",
  image_url: "",
  is_published: true,
  published_at: "",
};

const CATEGORY_OPTIONS = [
  { value: "general", label: "General" },
  { value: "panchayat", label: "Panchayat" },
  { value: "health", label: "Health" },
  { value: "education", label: "Education" },
  { value: "agriculture", label: "Agriculture" },
  { value: "water", label: "Water" },
  { value: "electricity", label: "Electricity" },
  { value: "event", label: "Event" },
  { value: "emergency", label: "Emergency" },
];

export default function AnnouncementsAdmin() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  async function loadAnnouncements() {
    try {
      setLoading(true);
      setError("");

      const response = await api.getAdminAnnouncements();
      const data = response?.data || {};

      setAnnouncements(data.announcements || []);
    } catch (err) {
      console.error("Failed to load announcements:", err);
      setError(err.message || "Unable to load announcements.");
    } finally {
      setLoading(false);
    }
  }

  function openCreateForm() {
    setEditingId(null);
    setForm({
      ...EMPTY_FORM,
      published_at: "",
    });
    setError("");
    setSuccess("");
    setShowForm(true);
  }

  function openEditForm(announcement) {
    setEditingId(announcement.id);

    setForm({
      title: announcement.title || "",
      description: announcement.description || "",
      category: announcement.category || "general",
      image_url: announcement.image_url || "",
      is_published: announcement.is_published ?? true,
      published_at: announcement.published_at
        ? new Date(announcement.published_at)
            .toISOString()
            .slice(0, 16)
        : "",
    });

    setError("");
    setSuccess("");
    setShowForm(true);
  }

  function closeForm() {
    if (saving) return;

    setShowForm(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.title.trim()) {
      setError("Announcement title is required.");
      return;
    }

    if (!form.description.trim()) {
      setError("Announcement description is required.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        image_url: form.image_url.trim() || null,
        is_published: form.is_published,
        published_at: form.published_at || null,
      };

      if (editingId) {
        await api.updateAnnouncement(editingId, payload);
        setSuccess("Announcement updated successfully.");
      } else {
        await api.createAnnouncement(payload);
        setSuccess("Announcement created successfully.");
      }

      setShowForm(false);
      setEditingId(null);
      setForm(EMPTY_FORM);

      await loadAnnouncements();
    } catch (err) {
      console.error("Failed to save announcement:", err);
      setError(err.message || "Unable to save announcement.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this announcement?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");
      setSuccess("");

      await api.deleteAnnouncement(id);
      setSuccess("Announcement deleted successfully.");

      await loadAnnouncements();
    } catch (err) {
      console.error("Failed to delete announcement:", err);
      setError(err.message || "Unable to delete announcement.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="min-h-screen bg-[#361a0d] text-[#faebd7] relative isolate overflow-hidden">
      {/* Retro ambient background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 bottom-0 h-96 w-96 rounded-full bg-[#e68a45]/10 blur-3xl" />
        <div className="absolute -right-24 top-0 h-96 w-96 rounded-full bg-[#d4a373]/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#faebd7]/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(#faebd7_1px,transparent_1px)] [background-size:12px_12px]" />
      </div>

      <div className="mx-auto max-w-[1600px] px-6 py-12 sm:px-10 lg:px-12">
        {/* Header */}
        <div className="flex flex-col gap-6 rounded-[28px] border-[3px] border-[#221208] bg-[#4a2512] p-8 text-[#faebd7] shadow-[10px_10px_0_rgba(34,18,8,0.3)] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-xl border-[2px] border-[#221208] bg-[#faebd7] px-4 py-1.5 text-xs font-black text-[#221208] shadow-[3px_3px_0_#221208] uppercase tracking-wider mb-3">
              <Sparkles size={14} className="text-[#e68a45]" />
              <span>Announcements Control 📢</span>
            </div>

            <h1 className="text-3xl font-black tracking-tight text-[#faebd7] sm:text-4xl">
              Manage Announcements
            </h1>

            <p className="mt-2 text-sm sm:text-base font-medium leading-relaxed text-[#eddcd2]">
              Create, edit and publish official village notices and circulars.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateForm}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border-[2px] border-[#221208] bg-[#e68a45] px-6 py-3.5 text-xs font-black text-[#221208] shadow-[4px_4px_0_#221208] transition-all hover:-translate-y-0.5 hover:bg-[#f4a261]"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            New Announcement
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="mt-8 rounded-[24px] border-[3px] border-[#221208] bg-red-100 p-6 text-red-900 shadow-[8px_8px_0_rgba(34,18,8,0.3)]">
            <p className="font-black">Error</p>
            <p className="mt-1 text-sm font-semibold">{error}</p>
          </div>
        )}

        {success && (
          <div className="mt-8 rounded-[24px] border-[3px] border-[#221208] bg-emerald-100 p-6 text-emerald-900 shadow-[8px_8px_0_rgba(34,18,8,0.3)]">
            <p className="font-black">Success</p>
            <p className="mt-1 text-sm font-semibold">{success}</p>
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="mt-8 rounded-[28px] border-[3px] border-[#221208] bg-[#faebd7] p-8 text-[#221208] shadow-[12px_12px_0_rgba(34,18,8,0.3)]">
            <div className="flex items-center justify-between border-b-2 border-[#221208]/15 pb-5">
              <div>
                <h2 className="text-xl font-black text-[#221208]">
                  {editingId ? "Edit Announcement" : "New Announcement"}
                </h2>
                <p className="mt-1 text-xs sm:text-sm font-medium text-[#5a321a]">
                  Publish important information for Palitpur residents.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#221208] bg-white text-[#221208] shadow-[3px_3px_0_#221208] transition hover:bg-[#e68a45] disabled:opacity-50"
                aria-label="Close form"
              >
                <X className="h-5 w-5" strokeWidth={2.5} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              {/* Title */}
              <div>
                <label htmlFor="title" className="mb-2 block text-sm font-black text-[#221208]">
                  Title <span className="text-red-600">*</span>
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter announcement title"
                  required
                  className="w-full rounded-xl border-2 border-[#221208] bg-white px-4 py-3 text-sm font-semibold text-[#221208] outline-none transition focus:border-[#4a2512] focus:ring-2 focus:ring-[#e68a45]"
                />
              </div>

              {/* Description */}
              <div>
                <label htmlFor="description" className="mb-2 block text-sm font-black text-[#221208]">
                  Description <span className="text-red-600">*</span>
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={6}
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Write the announcement details..."
                  required
                  className="w-full resize-y rounded-xl border-2 border-[#221208] bg-white px-4 py-3 text-sm font-semibold text-[#221208] outline-none transition focus:border-[#4a2512] focus:ring-2 focus:ring-[#e68a45]"
                />
              </div>

              {/* Category + Published */}
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="category" className="mb-2 block text-sm font-black text-[#221208]">
                    Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full rounded-xl border-2 border-[#221208] bg-white px-4 py-3 text-sm font-black text-[#221208] outline-none transition focus:border-[#4a2512] focus:ring-2 focus:ring-[#e68a45] cursor-pointer"
                  >
                    {CATEGORY_OPTIONS.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center sm:pt-7">
                  <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-[#221208] bg-white px-4 py-3 shadow-[3px_3px_0_#221208] w-full">
                    <input
                      type="checkbox"
                      name="is_published"
                      checked={form.is_published}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-2 border-[#221208] text-[#e68a45] focus:ring-[#e68a45]"
                    />
                    <span className="text-xs sm:text-sm font-black text-[#221208]">
                      Publish immediately
                    </span>
                  </label>
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label htmlFor="image_url" className="mb-2 block text-sm font-black text-[#221208]">
                  Image URL <span className="font-semibold text-[#5a321a]">(Optional)</span>
                </label>
                <input
                  id="image_url"
                  name="image_url"
                  type="url"
                  value={form.image_url}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full rounded-xl border-2 border-[#221208] bg-white px-4 py-3 text-sm font-semibold text-[#221208] outline-none transition focus:border-[#4a2512] focus:ring-2 focus:ring-[#e68a45]"
                />
              </div>

              {/* Published Date */}
              <div>
                <label htmlFor="published_at" className="mb-2 block text-sm font-black text-[#221208]">
                  Publish Date <span className="font-semibold text-[#5a321a]">(Optional)</span>
                </label>
                <input
                  id="published_at"
                  name="published_at"
                  type="datetime-local"
                  value={form.published_at}
                  onChange={handleChange}
                  className="w-full rounded-xl border-2 border-[#221208] bg-white px-4 py-3 text-sm font-semibold text-[#221208] outline-none transition focus:border-[#4a2512] focus:ring-2 focus:ring-[#e68a45]"
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end pt-4 border-t-2 border-[#221208]/15">
                <button
                  type="button"
                  onClick={closeForm}
                  disabled={saving}
                  className="rounded-xl border-2 border-[#221208] bg-white px-6 py-3 text-xs font-black text-[#221208] shadow-[3px_3px_0_#221208] transition hover:bg-slate-100 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#221208] bg-[#e68a45] px-8 py-3 text-xs font-black text-[#221208] shadow-[4px_4px_0_#221208] transition hover:bg-[#f4a261] disabled:opacity-50"
                >
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {editingId ? "Update Announcement" : "Create Announcement"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Announcement List */}
        <div className="mt-10">
          {loading ? (
            <div className="rounded-[24px] border-[3px] border-[#221208] bg-[#faebd7] p-12 text-center text-[#221208] shadow-[8px_8px_0_rgba(34,18,8,0.3)]">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-[#4a2512]" />
              <p className="mt-4 text-sm font-black text-[#221208] animate-pulse">Loading announcements...</p>
            </div>
          ) : announcements.length === 0 ? (
            <div className="rounded-[24px] border-[3px] border-[#221208] bg-[#faebd7] p-12 text-center text-[#221208] shadow-[8px_8px_0_rgba(34,18,8,0.3)]">
              <Bell className="mx-auto h-10 w-10 text-[#4a2512]" />
              <h2 className="mt-4 text-lg font-black text-[#221208]">No announcements yet</h2>
              <p className="mt-1 text-xs sm:text-sm font-medium text-[#5a321a]">Create your first village announcement.</p>
              <div className="mt-6">
                <button
                  type="button"
                  onClick={openCreateForm}
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-[#221208] bg-[#e68a45] px-6 py-3 text-xs font-black text-[#221208] shadow-[3px_3px_0_#221208] transition hover:bg-[#f4a261]"
                >
                  <Plus className="h-4 w-4" strokeWidth={2.5} /> New Announcement
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {announcements.map((announcement) => {
                const published = announcement.is_published;

                return (
                  <div
                    key={announcement.id}
                    className="rounded-[24px] border-[3px] border-[#221208] bg-[#faebd7] p-6 text-[#221208] shadow-[8px_8px_0_rgba(34,18,8,0.3)] transition duration-300 hover:bg-[#fff5eb]"
                  >
                    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h2 className="text-lg font-black tracking-tight text-[#221208]">
                            {announcement.title}
                          </h2>

                          {announcement.category && (
                            <span className="rounded-xl bg-[#4a2512] px-3 py-1 text-[10px] font-black border-2 border-[#221208] text-[#faebd7] shadow-[2px_2px_0_#221208] uppercase tracking-wider">
                              {announcement.category}
                            </span>
                          )}

                          {published ? (
                            <span className="rounded-xl bg-[#b8d85a] px-3 py-1 text-[10px] font-black border-2 border-[#221208] text-[#221208] shadow-[2px_2px_0_#221208] uppercase tracking-wider">
                              Published
                            </span>
                          ) : (
                            <span className="rounded-xl bg-amber-200 px-3 py-1 text-[10px] font-black border-2 border-[#221208] text-[#221208] shadow-[2px_2px_0_#221208] uppercase tracking-wider">
                              Draft
                            </span>
                          )}
                        </div>

                        <p className="mt-3 whitespace-pre-wrap text-xs sm:text-sm font-medium leading-relaxed text-[#5a321a]">
                          {announcement.description}
                        </p>

                        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs font-bold text-[#5a321a]/80">
                          {announcement.published_at && (
                            <span>Published: {new Date(announcement.published_at).toLocaleString()}</span>
                          )}
                          {announcement.created_at && (
                            <span>Created: {new Date(announcement.created_at).toLocaleString()}</span>
                          )}
                        </div>
                      </div>

                      <div className="flex shrink-0 gap-3 pt-2 lg:pt-0">
                        <button
                          type="button"
                          onClick={() => openEditForm(announcement)}
                          className="inline-flex items-center gap-2 rounded-xl border-2 border-[#221208] bg-white px-4 py-2.5 text-xs font-black text-[#221208] shadow-[3px_3px_0_#221208] transition hover:bg-[#e68a45]"
                        >
                          <Edit className="h-4 w-4" strokeWidth={2.5} /> Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(announcement.id)}
                          disabled={deletingId === announcement.id}
                          className="inline-flex items-center gap-2 rounded-xl border-2 border-[#221208] bg-red-600 px-4 py-2.5 text-xs font-black text-white shadow-[3px_3px_0_#221208] transition hover:bg-red-700 disabled:opacity-50"
                        >
                          {deletingId === announcement.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" strokeWidth={2.5} />
                          )}
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}