
import {
  Bell,
  Edit,
  Loader2,
  Plus,
  Trash2,
  X,
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
      console.error(
        "Failed to load announcements:",
        err
      );

      setError(
        err.message ||
          "Unable to load announcements."
      );
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
      description:
        announcement.description || "",
      category:
        announcement.category || "general",
      image_url:
        announcement.image_url || "",
      is_published:
        announcement.is_published ?? true,
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
    const {
      name,
      value,
      type,
      checked,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        type === "checkbox" ? checked : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.title.trim()) {
      setError(
        "Announcement title is required."
      );
      return;
    }

    if (!form.description.trim()) {
      setError(
        "Announcement description is required."
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        image_url:
          form.image_url.trim() || null,
        is_published: form.is_published,
        published_at:
          form.published_at || null,
      };

      if (editingId) {
        await api.updateAnnouncement(
          editingId,
          payload
        );

        setSuccess(
          "Announcement updated successfully."
        );
      } else {
        await api.createAnnouncement(payload);

        setSuccess(
          "Announcement created successfully."
        );
      }

      setShowForm(false);
      setEditingId(null);
      setForm(EMPTY_FORM);

      await loadAnnouncements();
    } catch (err) {
      console.error(
        "Failed to save announcement:",
        err
      );

      setError(
        err.message ||
          "Unable to save announcement."
      );
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

      setSuccess(
        "Announcement deleted successfully."
      );

      await loadAnnouncements();
    } catch (err) {
      console.error(
        "Failed to delete announcement:",
        err
      );

      setError(
        err.message ||
          "Unable to delete announcement."
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="min-h-screen bg-slate-100 py-10">
      <div className="page-x">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-emerald-600">
              ADMIN
            </p>

            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Announcements
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Manage village announcements and
              notices.
            </p>
          </div>

          <Button
            type="button"
            onClick={openCreateForm}
          >
            <Plus className="h-4 w-4" />
            New Announcement
          </Button>
        </div>

        {/* Messages */}
        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
            {success}
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingId
                    ? "Edit Announcement"
                    : "New Announcement"}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Publish important information
                  for Palitpur residents.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                disabled={saving}
                className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
                aria-label="Close form"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-5"
            >
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Title
                </label>

                <input
                  id="title"
                  name="title"
                  type="text"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter announcement title"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              {/* Description */}
              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Description
                </label>

                <textarea
                  id="description"
                  name="description"
                  rows={6}
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Write the announcement..."
                  required
                  className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              {/* Category + Published */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="category"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Category
                  </label>

                  <select
                    id="category"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  >
                    {CATEGORY_OPTIONS.map(
                      (category) => (
                        <option
                          key={category.value}
                          value={category.value}
                        >
                          {category.label}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div className="flex items-center sm:pt-7">
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      name="is_published"
                      checked={
                        form.is_published
                      }
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />

                    <span className="text-sm font-semibold text-slate-700">
                      Publish immediately
                    </span>
                  </label>
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label
                  htmlFor="image_url"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Image URL
                  <span className="ml-2 font-normal text-slate-400">
                    Optional
                  </span>
                </label>

                <input
                  id="image_url"
                  name="image_url"
                  type="url"
                  value={form.image_url}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              {/* Published Date */}
              <div>
                <label
                  htmlFor="published_at"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Publish Date
                  <span className="ml-2 font-normal text-slate-400">
                    Optional
                  </span>
                </label>

                <input
                  id="published_at"
                  name="published_at"
                  type="datetime-local"
                  value={form.published_at}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>

              {/* Actions */}
              <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={closeForm}
                  disabled={saving}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={saving}
                >
                  {saving && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}

                  {editingId
                    ? "Update Announcement"
                    : "Create Announcement"}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Announcement List */}
        <div className="mt-8">
          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
              <Loader2 className="mx-auto h-8 w-8 animate-spin text-emerald-600" />

              <p className="mt-4 text-sm text-slate-500">
                Loading announcements...
              </p>
            </div>
          ) : announcements.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
              <Bell className="mx-auto h-10 w-10 text-slate-300" />

              <h2 className="mt-4 font-semibold text-slate-900">
                No announcements yet
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Create your first village
                announcement.
              </p>

              <div className="mt-5">
                <Button
                  type="button"
                  onClick={openCreateForm}
                >
                  <Plus className="h-4 w-4" />
                  New Announcement
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {announcements.map(
                (announcement) => {
                  const published =
                    announcement.is_published;

                  return (
                    <div
                      key={announcement.id}
                      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                    >
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-lg font-bold text-slate-900">
                              {announcement.title}
                            </h2>

                            {announcement.category && (
                              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-600">
                                {announcement.category}
                              </span>
                            )}

                            {published ? (
                              <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                                Published
                              </span>
                            ) : (
                              <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                                Draft
                              </span>
                            )}
                          </div>

                          <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-slate-600">
                            {
                              announcement.description
                            }
                          </p>

                          {announcement.published_at && (
                            <p className="mt-3 text-xs text-slate-400">
                              Published{" "}
                              {new Date(
                                announcement.published_at
                              ).toLocaleString()}
                            </p>
                          )}

                          {announcement.created_at && (
                            <p className="mt-1 text-xs text-slate-400">
                              Created{" "}
                              {new Date(
                                announcement.created_at
                              ).toLocaleString()}
                            </p>
                          )}
                        </div>

                        <div className="flex shrink-0 gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              openEditForm(
                                announcement
                              )
                            }
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                          >
                            <Edit className="h-4 w-4" />
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                announcement.id
                              )
                            }
                            disabled={
                              deletingId ===
                              announcement.id
                            }
                            className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingId ===
                            announcement.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}

                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

