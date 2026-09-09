import {
  Check,
  Edit3,
  Loader2,
  MapPin,
  Plus,
  Trash2,
  X,
  Sparkles,
  Building2,
} from "lucide-react";
import { useEffect, useState } from "react";

import { api } from "../../services/api";

const EMPTY_FORM = {
  name: "",
  category: "",
  description: "",
  phone: "",
  email: "",
  address: "",
  image_url: "",
  website_url: "",
  is_active: true,
};

function normalizeEntry(entry) {
  return {
    id: entry.id,
    name: entry.name || "",
    category: entry.category || "",
    description: entry.description || "",
    phone: entry.phone || "",
    email: entry.email || "",
    address: entry.address || "",
    image_url: entry.image_url || "",
    website_url: entry.website_url || "",
    is_active: entry.is_active !== false,
    created_at: entry.created_at,
    updated_at: entry.updated_at,
  };
}

export default function DirectoryAdmin() {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadEntries = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.getAdminDirectoryEntries();

      const directoryEntries = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response?.data?.entries)
          ? response.data.entries
          : [];

      setEntries(directoryEntries.map(normalizeEntry));
    } catch (err) {
      console.error("Failed to load directory:", err);
      setError(err.message || "Failed to load directory entries.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEntries();
  }, []);

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const startEdit = (entry) => {
    setEditingId(entry.id);

    setForm({
      name: entry.name || "",
      category: entry.category || "",
      description: entry.description || "",
      phone: entry.phone || "",
      email: entry.email || "",
      address: entry.address || "",
      image_url: entry.image_url || "",
      website_url: entry.website_url || "",
      is_active: entry.is_active !== false,
    });

    setError("");
    setSuccess("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.name.trim()) {
      setError("Directory name is required.");
      return;
    }

    if (!form.category.trim()) {
      setError("Category is required.");
      return;
    }

    const payload = {
      name: form.name.trim(),
      category: form.category.trim(),
      description: form.description.trim() || null,
      phone: form.phone.trim() || null,
      email: form.email.trim() || null,
      address: form.address.trim() || null,
      image_url: form.image_url.trim() || null,
      website_url: form.website_url.trim() || null,
      is_active: Boolean(form.is_active),
    };

    try {
      setSaving(true);

      if (editingId) {
        const response = await api.updateAdminDirectoryEntry(
          editingId,
          payload
        );

        const updatedEntry =
          response?.data?.entry || response?.data;

        if (!updatedEntry?.id) {
          throw new Error(
            "Directory entry was updated, but the server returned invalid data."
          );
        }

        setEntries((previous) =>
          previous.map((entry) =>
            entry.id === editingId
              ? normalizeEntry(updatedEntry)
              : entry
          )
        );

        setSuccess("Directory entry updated successfully.");
      } else {
        const response = await api.createAdminDirectoryEntry(
          payload
        );

        const createdEntry =
          response?.data?.entry || response?.data;

        if (!createdEntry?.id) {
          throw new Error(
            "Directory entry was created, but the server returned invalid data."
          );
        }

        setEntries((previous) => [
          normalizeEntry(createdEntry),
          ...previous,
        ]);

        setSuccess("Directory entry created successfully.");
      }

      resetForm();
    } catch (err) {
      console.error("Failed to save directory entry:", err);
      setError(err.message || "Failed to save directory entry.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (entry) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${entry.name}"?`
    );

    if (!confirmed) return;

    try {
      setDeletingId(entry.id);
      setError("");
      setSuccess("");

      await api.deleteAdminDirectoryEntry(entry.id);

      setEntries((previous) =>
        previous.filter((item) => item.id !== entry.id)
      );

      if (editingId === entry.id) {
        resetForm();
      }

      setSuccess("Directory entry deleted successfully.");
    } catch (err) {
      console.error("Failed to delete directory entry:", err);
      setError(err.message || "Failed to delete directory entry.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <section className="min-h-screen bg-[#361a0d] text-[#faebd7] relative isolate overflow-hidden">
      {/* Retro ambient background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 bottom-0 h-96 w-96 rounded-full bg-[#e68a45]/10 blur-3xl" />
        <div className="absolute -right-24 top-0 h-96 w-96 rounded-full bg-[#d4a373]/10 blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#faebd7]/10 blur-3xl" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:radial-gradient(#faebd7_1px,transparent_1px)] [background-size:12px_12px]" />
      </div>

      <div className="mx-auto max-w-[1600px] px-6 py-12 sm:px-10 lg:px-12 space-y-10">
        
        {/* PAGE HEADER */}
        <div className="flex flex-col gap-6 rounded-[28px] border-[3px] border-[#221208] bg-[#4a2512] p-8 text-[#faebd7] shadow-[10px_10px_0_rgba(34,18,8,0.3)] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-xl border-[2px] border-[#221208] bg-[#faebd7] px-4 py-1.5 text-xs font-black text-[#221208] shadow-[3px_3px_0_#221208] uppercase tracking-wider mb-3">
              <Sparkles size={14} className="text-[#e68a45]" />
              <span>Directory Control 📁</span>
            </div>

            <h1 className="text-3xl font-black tracking-tight text-[#faebd7] sm:text-4xl">
              Directory Management
            </h1>

            <p className="mt-2 text-sm sm:text-base font-medium leading-relaxed text-[#eddcd2]">
              Manage local services, businesses, officials, and important village contacts.
            </p>
          </div>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border-[2px] border-[#221208] bg-white px-6 py-3.5 text-xs font-black text-[#221208] shadow-[4px_4px_0_#221208] transition-all hover:bg-slate-100"
            >
              <X className="h-4 w-4" strokeWidth={2.5} />
              Cancel Edit
            </button>
          )}
        </div>

        {/* ALERTS */}
        {error && (
          <div className="rounded-[24px] border-[3px] border-[#221208] bg-red-100 p-6 text-red-900 shadow-[8px_8px_0_rgba(34,18,8,0.3)]">
            <p className="font-black">Error</p>
            <p className="mt-1 text-sm font-semibold">{error}</p>
          </div>
        )}

        {success && (
          <div className="rounded-[24px] border-[3px] border-[#221208] bg-emerald-100 p-6 text-emerald-900 shadow-[8px_8px_0_rgba(34,18,8,0.3)]">
            <p className="font-black">Success</p>
            <p className="mt-1 text-sm font-semibold">{success}</p>
          </div>
        )}

        {/* FORM */}
        <section className="rounded-[28px] border-[3px] border-[#221208] bg-[#faebd7] p-8 text-[#221208] shadow-[12px_12px_0_rgba(34,18,8,0.3)]">
          <div className="mb-6 flex items-center gap-4 border-b-2 border-[#221208]/15 pb-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-[#221208] bg-[#e68a45] text-[#221208] shadow-[3px_3px_0_#221208]">
              {editingId ? <Edit3 className="h-6 w-6" strokeWidth={2.5} /> : <Plus className="h-6 w-6" strokeWidth={2.5} />}
            </div>

            <div>
              <h2 className="text-xl font-black text-[#221208]">
                {editingId ? "Edit Directory Entry" : "Add Directory Entry"}
              </h2>

              <p className="text-xs sm:text-sm font-medium text-[#5a321a]">
                {editingId ? "Update the selected directory entry." : "Add a new service or important local contact."}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="name" className="mb-2 block text-sm font-black text-[#221208]">
                  Name <span className="text-red-600">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Palitpur Primary Health Centre"
                  className="w-full rounded-xl border-2 border-[#221208] bg-white px-4 py-3 text-sm font-semibold text-[#221208] outline-none transition focus:border-[#4a2512] focus:ring-2 focus:ring-[#e68a45]"
                />
              </div>

              <div>
                <label htmlFor="category" className="mb-2 block text-sm font-black text-[#221208]">
                  Category <span className="text-red-600">*</span>
                </label>
                <input
                  id="category"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  placeholder="e.g. Health, Education, Government"
                  className="w-full rounded-xl border-2 border-[#221208] bg-white px-4 py-3 text-sm font-semibold text-[#221208] outline-none transition focus:border-[#4a2512] focus:ring-2 focus:ring-[#e68a45]"
                />
              </div>

              <div>
                <label htmlFor="phone" className="mb-2 block text-sm font-black text-[#221208]">
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 XXXXX XXXXX"
                  className="w-full rounded-xl border-2 border-[#221208] bg-white px-4 py-3 text-sm font-semibold text-[#221208] outline-none transition focus:border-[#4a2512] focus:ring-2 focus:ring-[#e68a45]"
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-black text-[#221208]">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="contact@example.com"
                  className="w-full rounded-xl border-2 border-[#221208] bg-white px-4 py-3 text-sm font-semibold text-[#221208] outline-none transition focus:border-[#4a2512] focus:ring-2 focus:ring-[#e68a45]"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="address" className="mb-2 block text-sm font-black text-[#221208]">
                  Address
                </label>
                <input
                  id="address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Full address"
                  className="w-full rounded-xl border-2 border-[#221208] bg-white px-4 py-3 text-sm font-semibold text-[#221208] outline-none transition focus:border-[#4a2512] focus:ring-2 focus:ring-[#e68a45]"
                />
              </div>

              <div className="md:col-span-2">
                <label htmlFor="description" className="mb-2 block text-sm font-black text-[#221208]">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe the service or organization..."
                  className="w-full resize-none rounded-xl border-2 border-[#221208] bg-white px-4 py-3 text-sm font-semibold text-[#221208] outline-none transition focus:border-[#4a2512] focus:ring-2 focus:ring-[#e68a45]"
                />
              </div>

              <div>
                <label htmlFor="image_url" className="mb-2 block text-sm font-black text-[#221208]">
                  Image URL
                </label>
                <input
                  id="image_url"
                  name="image_url"
                  value={form.image_url}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full rounded-xl border-2 border-[#221208] bg-white px-4 py-3 text-sm font-semibold text-[#221208] outline-none transition focus:border-[#4a2512] focus:ring-2 focus:ring-[#e68a45]"
                />
              </div>

              <div>
                <label htmlFor="website_url" className="mb-2 block text-sm font-black text-[#221208]">
                  Website URL
                </label>
                <input
                  id="website_url"
                  name="website_url"
                  value={form.website_url}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="w-full rounded-xl border-2 border-[#221208] bg-white px-4 py-3 text-sm font-semibold text-[#221208] outline-none transition focus:border-[#4a2512] focus:ring-2 focus:ring-[#e68a45]"
                />
              </div>
            </div>

            <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-[#221208] bg-white px-4 py-3 shadow-[3px_3px_0_#221208] w-fit">
              <input
                type="checkbox"
                name="is_active"
                checked={form.is_active}
                onChange={handleChange}
                className="h-4 w-4 rounded border-2 border-[#221208] text-[#e68a45] focus:ring-[#e68a45]"
              />
              <span className="text-xs sm:text-sm font-black text-[#221208]">
                Active directory entry
              </span>
            </label>

            <div className="flex flex-col gap-3 sm:flex-row pt-4 border-t-2 border-[#221208]/15">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#221208] bg-[#e68a45] px-8 py-3 text-xs font-black text-[#221208] shadow-[4px_4px_0_#221208] transition hover:bg-[#f4a261] disabled:opacity-60"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : editingId ? (
                  <>
                    <Check className="h-4 w-4" strokeWidth={2.5} />
                    Update Entry
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" strokeWidth={2.5} />
                    Add Entry
                  </>
                )}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={saving}
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#221208] bg-white px-6 py-3 text-xs font-black text-[#221208] shadow-[3px_3px_0_#221208] transition hover:bg-slate-100 disabled:opacity-60"
                >
                  <X className="h-4 w-4" strokeWidth={2.5} />
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        {/* DIRECTORY LIST */}
        <section className="rounded-[28px] border-[3px] border-[#221208] bg-[#faebd7] p-8 text-[#221208] shadow-[12px_12px_0_rgba(34,18,8,0.3)]">
          <div className="mb-6 flex items-center justify-between gap-4 border-b-2 border-[#221208]/15 pb-5">
            <div>
              <h2 className="text-xl font-black text-[#221208]">
                Directory Entries
              </h2>
              <p className="mt-1 text-xs sm:text-sm font-medium text-[#5a321a]">
                {entries.length} {entries.length === 1 ? "entry" : "entries"} managed
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3 text-sm font-black text-[#221208]">
                <Loader2 className="h-6 w-6 animate-spin text-[#4a2512]" />
                Loading directory...
              </div>
            </div>
          ) : entries.length === 0 ? (
            <div className="py-12 text-center">
              <Building2 className="mx-auto h-10 w-10 text-[#4a2512]" />
              <h3 className="mt-4 text-base font-black text-[#221208]">
                No directory entries
              </h3>
              <p className="mt-1 text-xs sm:text-sm font-medium text-[#5a321a]">
                Add your first directory entry using the form above.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-[24px] border-[3px] border-[#221208] bg-white p-6 text-[#221208] shadow-[8px_8px_0_rgba(34,18,8,0.2)] transition hover:bg-[#fff5eb]"
                >
                  <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h3 className="text-base font-black tracking-tight text-[#221208]">
                          {entry.name}
                        </h3>

                        <span className="rounded-xl bg-[#4a2512] px-3 py-1 text-[10px] font-black border-2 border-[#221208] text-[#faebd7] shadow-[2px_2px_0_#221208] uppercase tracking-wider">
                          {entry.category}
                        </span>

                        {!entry.is_active && (
                          <span className="rounded-xl bg-slate-200 px-3 py-1 text-[10px] font-black border-2 border-[#221208] text-slate-700 shadow-[2px_2px_0_#221208] uppercase tracking-wider">
                            Inactive
                          </span>
                        )}
                      </div>

                      {entry.description && (
                        <p className="mt-3 max-w-3xl text-xs sm:text-sm font-medium leading-relaxed text-[#5a321a]">
                          {entry.description}
                        </p>
                      )}

                      <div className="mt-4 grid gap-2 text-xs font-bold text-[#5a321a]/90 sm:grid-cols-2">
                        {entry.phone && (
                          <div>
                            <span className="font-black text-[#221208]">Phone:</span> {entry.phone}
                          </div>
                        )}

                        {entry.email && (
                          <div className="break-all">
                            <span className="font-black text-[#221208]">Email:</span> {entry.email}
                          </div>
                        )}

                        {entry.address && (
                          <div className="flex gap-2 sm:col-span-2 items-start">
                            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#e68a45]" />
                            <span>{entry.address}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex shrink-0 gap-3 pt-2 lg:pt-0">
                      <button
                        type="button"
                        onClick={() => startEdit(entry)}
                        disabled={saving || deletingId === entry.id}
                        className="inline-flex items-center gap-2 rounded-xl border-2 border-[#221208] bg-[#faebd7] px-4 py-2.5 text-xs font-black text-[#221208] shadow-[3px_3px_0_#221208] transition hover:bg-[#e68a45] disabled:opacity-50"
                      >
                        <Edit3 className="h-4 w-4" strokeWidth={2.5} /> Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(entry)}
                        disabled={saving || deletingId === entry.id}
                        className="inline-flex items-center gap-2 rounded-xl border-2 border-[#221208] bg-red-600 px-4 py-2.5 text-xs font-black text-white shadow-[3px_3px_0_#221208] transition hover:bg-red-700 disabled:opacity-50"
                      >
                        {deletingId === entry.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4" strokeWidth={2.5} />
                        )}
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </section>
  );
}