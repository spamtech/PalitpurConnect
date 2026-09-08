import {
  Check,
  Edit3,
  Loader2,
  MapPin,
  Plus,
  Trash2,
  X,
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

  // --------------------------------------------------
  // LOAD DIRECTORY
  // --------------------------------------------------

  const loadEntries = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.getAdminDirectoryEntries();

      /*
       * Backend may return:
       *
       * data: [...]
       *
       * OR
       *
       * data: {
       *   entries: [...]
       * }
       */

      const directoryEntries = Array.isArray(response?.data)
        ? response.data
        : Array.isArray(response?.data?.entries)
          ? response.data.entries
          : [];

      setEntries(directoryEntries.map(normalizeEntry));
    } catch (err) {
      console.error("Failed to load directory:", err);

      setError(
        err.message ||
          "Failed to load directory entries."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEntries();
  }, []);

  // --------------------------------------------------
  // FORM HANDLING
  // --------------------------------------------------

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

  // --------------------------------------------------
  // CREATE / UPDATE
  // --------------------------------------------------

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
        // ------------------------------------------
        // UPDATE
        // ------------------------------------------

        const response =
          await api.updateAdminDirectoryEntry(
            editingId,
            payload
          );

        /*
         * Backend may return:
         *
         * data: {
         *   id: "...",
         *   name: "..."
         * }
         *
         * OR:
         *
         * data: {
         *   entry: {
         *     id: "...",
         *     name: "..."
         *   }
         * }
         */

        const updatedEntry =
          response?.data?.entry ||
          response?.data;

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

        setSuccess(
          "Directory entry updated successfully."
        );
      } else {
        // ------------------------------------------
        // CREATE
        // ------------------------------------------

        const response =
          await api.createAdminDirectoryEntry(
            payload
          );

        /*
         * Backend currently returns:
         *
         * data: {
         *   id: "...",
         *   name: "...",
         *   category: "..."
         * }
         *
         * So response.data itself is the entry.
         */

        const createdEntry =
          response?.data?.entry ||
          response?.data;

        if (!createdEntry?.id) {
          throw new Error(
            "Directory entry was created, but the server returned invalid data."
          );
        }

        setEntries((previous) => [
          normalizeEntry(createdEntry),
          ...previous,
        ]);

        setSuccess(
          "Directory entry created successfully."
        );
      }

      resetForm();
    } catch (err) {
      console.error(
        "Failed to save directory entry:",
        err
      );

      setError(
        err.message ||
          "Failed to save directory entry."
      );
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // DELETE
  // --------------------------------------------------

  const handleDelete = async (entry) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${entry.name}"?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(entry.id);
      setError("");
      setSuccess("");

      await api.deleteAdminDirectoryEntry(
        entry.id
      );

      setEntries((previous) =>
        previous.filter(
          (item) => item.id !== entry.id
        )
      );

      if (editingId === entry.id) {
        resetForm();
      }

      setSuccess(
        "Directory entry deleted successfully."
      );
    } catch (err) {
      console.error(
        "Failed to delete directory entry:",
        err
      );

      setError(
        err.message ||
          "Failed to delete directory entry."
      );
    } finally {
      setDeletingId(null);
    }
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="space-y-8">
      {/* PAGE HEADER */}

      <div>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Directory Management
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage local services, businesses,
              officials, and important village contacts.
            </p>
          </div>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <X className="h-4 w-4" />
              Cancel Edit
            </button>
          )}
        </div>
      </div>

      {/* ALERTS */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          {success}
        </div>
      )}

      {/* FORM */}

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            {editingId ? (
              <Edit3 className="h-5 w-5" />
            ) : (
              <Plus className="h-5 w-5" />
            )}
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {editingId
                ? "Edit Directory Entry"
                : "Add Directory Entry"}
            </h2>

            <p className="text-sm text-slate-500">
              {editingId
                ? "Update the selected directory entry."
                : "Add a new service or important local contact."}
            </p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="grid gap-5 md:grid-cols-2">
            {/* NAME */}

            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Name *
              </label>

              <input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Palitpur Primary Health Centre"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {/* CATEGORY */}

            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Category *
              </label>

              <input
                id="category"
                name="category"
                value={form.category}
                onChange={handleChange}
                placeholder="e.g. Health, Education, Government"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {/* PHONE */}

            <div>
              <label
                htmlFor="phone"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Phone
              </label>

              <input
                id="phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="+91 XXXXX XXXXX"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {/* EMAIL */}

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Email
              </label>

              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="contact@example.com"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {/* ADDRESS */}

            <div className="md:col-span-2">
              <label
                htmlFor="address"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Address
              </label>

              <input
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Full address"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {/* DESCRIPTION */}

            <div className="md:col-span-2">
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                rows={4}
                value={form.description}
                onChange={handleChange}
                placeholder="Describe the service or organization..."
                className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {/* IMAGE URL */}

            <div>
              <label
                htmlFor="image_url"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Image URL
              </label>

              <input
                id="image_url"
                name="image_url"
                value={form.image_url}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>

            {/* WEBSITE */}

            <div>
              <label
                htmlFor="website_url"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Website URL
              </label>

              <input
                id="website_url"
                name="website_url"
                value={form.website_url}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              />
            </div>
          </div>

          {/* ACTIVE */}

          <label className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              name="is_active"
              checked={form.is_active}
              onChange={handleChange}
              className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />

            <span className="text-sm font-medium text-slate-700">
              Active directory entry
            </span>
          </label>

          {/* BUTTONS */}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : editingId ? (
                <>
                  <Check className="h-4 w-4" />
                  Update Entry
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add Entry
                </>
              )}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      {/* DIRECTORY LIST */}

      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5 sm:p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Directory Entries
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {entries.length}{" "}
                {entries.length === 1
                  ? "entry"
                  : "entries"}
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center px-6 py-16">
            <div className="flex items-center gap-3 text-sm font-medium text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              Loading directory...
            </div>
          </div>
        ) : entries.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <MapPin className="h-6 w-6" />
            </div>

            <h3 className="mt-4 text-sm font-semibold text-slate-900">
              No directory entries
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Add your first directory entry using
              the form above.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="p-5 transition hover:bg-slate-50 sm:p-6"
              >
                <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                  {/* ENTRY INFO */}

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold text-slate-900">
                        {entry.name}
                      </h3>

                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        {entry.category}
                      </span>

                      {!entry.is_active && (
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                          Inactive
                        </span>
                      )}
                    </div>

                    {entry.description && (
                      <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                        {entry.description}
                      </p>
                    )}

                    <div className="mt-4 grid gap-2 text-sm text-slate-500 sm:grid-cols-2">
                      {entry.phone && (
                        <div>
                          <span className="font-semibold text-slate-700">
                            Phone:
                          </span>{" "}
                          {entry.phone}
                        </div>
                      )}

                      {entry.email && (
                        <div className="break-all">
                          <span className="font-semibold text-slate-700">
                            Email:
                          </span>{" "}
                          {entry.email}
                        </div>
                      )}

                      {entry.address && (
                        <div className="flex gap-2 sm:col-span-2">
                          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />

                          <span>
                            {entry.address}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ACTIONS */}

                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(entry)}
                      disabled={
                        saving ||
                        deletingId === entry.id
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <Edit3 className="h-4 w-4" />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(entry)
                      }
                      disabled={
                        saving ||
                        deletingId === entry.id
                      }
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {deletingId === entry.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
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
  );
}