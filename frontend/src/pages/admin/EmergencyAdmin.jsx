import {
  AlertTriangle,
  Check,
  Edit3,
  Loader2,
  Plus,
  Trash2,
  X,
  Sparkles,
  ShieldAlert,
} from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "../../components/ui";
import { api } from "../../services/api";

const EMPTY_FORM = {
  name: "",
  service: "",
  phone: "",
  alternate_phone: "",
  description: "",
  is_active: true,
  display_order: 0,
};

function normalizeContact(contact) {
  return {
    id: contact.id,
    name: contact.name || "",
    service: contact.service || "",
    phone: contact.phone || "",
    alternate_phone: contact.alternate_phone || "",
    description: contact.description || "",
    is_active: Boolean(contact.is_active),
    display_order: Number(contact.display_order) || 0,
    created_at: contact.created_at,
    updated_at: contact.updated_at,
  };
}

export default function EmergencyAdmin() {
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isEditing = Boolean(editingId);

  useEffect(() => {
    loadContacts();
  }, []);

  async function loadContacts() {
    try {
      setLoading(true);
      setError("");

      const response = await api.getAdminEmergencyContacts();
      const data = response?.data?.contacts;

      if (!Array.isArray(data)) {
        throw new Error("Invalid emergency contacts response from server.");
      }

      setContacts(
        data
          .map(normalizeContact)
          .sort((a, b) => a.display_order - b.display_order)
      );
    } catch (err) {
      console.error("Failed to load emergency contacts:", err);
      setError(err.message || "Unable to load emergency contacts.");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setEditingId(null);
  }

  function startCreate() {
    setError("");
    setSuccess("");
    resetForm();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function startEdit(contact) {
    setError("");
    setSuccess("");
    setEditingId(contact.id);
    setForm({
      name: contact.name,
      service: contact.service,
      phone: contact.phone,
      alternate_phone: contact.alternate_phone,
      description: contact.description,
      is_active: contact.is_active,
      display_order: contact.display_order,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function validateForm() {
    if (!form.name.trim()) return "Contact name is required.";
    if (!form.service.trim()) return "Service is required.";
    if (!form.phone.trim()) return "Phone number is required.";
    const order = Number(form.display_order);
    if (!Number.isInteger(order) || order < 0) {
      return "Display order must be a non-negative whole number.";
    }
    return "";
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = {
      name: form.name.trim(),
      service: form.service.trim(),
      phone: form.phone.trim(),
      alternate_phone: form.alternate_phone.trim() || null,
      description: form.description.trim() || null,
      is_active: Boolean(form.is_active),
      display_order: Number(form.display_order),
    };

    try {
      setSaving(true);

      if (isEditing) {
        const response = await api.updateAdminEmergencyContact(editingId, payload);
        const updatedContact = response?.data?.contact;

        if (!updatedContact) {
          throw new Error("Invalid update response from server.");
        }

        const normalized = normalizeContact(updatedContact);
        setContacts((current) =>
          current
            .map((contact) => (contact.id === editingId ? normalized : contact))
            .sort((a, b) => a.display_order - b.display_order)
        );
        setSuccess("Emergency contact updated successfully.");
      } else {
        const response = await api.createAdminEmergencyContact(payload);
        const createdContact = response?.data?.contact;

        if (!createdContact) {
          throw new Error("Invalid create response from server.");
        }

        setContacts((current) =>
          [normalizeContact(createdContact), ...current].sort(
            (a, b) => a.display_order - b.display_order
          )
        );
        setSuccess("Emergency contact created successfully.");
      }

      resetForm();
    } catch (err) {
      console.error("Failed to save emergency contact:", err);
      setError(err.message || "Unable to save emergency contact.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(contact) {
    const confirmed = window.confirm(`Delete "${contact.name}" from emergency contacts?`);
    if (!confirmed) return;

    try {
      setDeletingId(contact.id);
      setError("");
      setSuccess("");

      await api.deleteAdminEmergencyContact(contact.id);

      setContacts((current) => current.filter((item) => item.id !== contact.id));
      if (editingId === contact.id) resetForm();

      setSuccess("Emergency contact deleted successfully.");
    } catch (err) {
      console.error("Failed to delete emergency contact:", err);
      setError(err.message || "Unable to delete emergency contact.");
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

      <div className="mx-auto max-w-[1600px] px-6 py-12 sm:px-10 lg:px-12 space-y-10">
        
        {/* Header */}
        <div className="flex flex-col gap-6 rounded-[28px] border-[3px] border-[#221208] bg-[#4a2512] p-8 text-[#faebd7] shadow-[10px_10px_0_rgba(34,18,8,0.3)] sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-xl border-[2px] border-[#221208] bg-[#faebd7] px-4 py-1.5 text-xs font-black text-[#221208] shadow-[3px_3px_0_#221208] uppercase tracking-wider mb-3">
              <Sparkles size={14} className="text-[#e68a45]" />
              <span>Emergency Control 🚨</span>
            </div>

            <h1 className="text-3xl font-black tracking-tight text-[#faebd7] sm:text-4xl">
              Emergency Contacts
            </h1>

            <p className="mt-2 text-sm sm:text-base font-medium leading-relaxed text-[#eddcd2]">
              Maintain emergency and important service numbers.
            </p>
          </div>

          <button
            type="button"
            onClick={startCreate}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border-[2px] border-[#221208] bg-[#e68a45] px-6 py-3.5 text-xs font-black text-[#221208] shadow-[4px_4px_0_#221208] transition-all hover:-translate-y-0.5 hover:bg-[#f4a261]"
          >
            <Plus className="h-4 w-4" strokeWidth={2.5} />
            Add Contact
          </button>
        </div>

        {/* Alerts */}
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

        {/* Form */}
        <div className="rounded-[28px] border-[3px] border-[#221208] bg-[#faebd7] p-8 text-[#221208] shadow-[12px_12px_0_rgba(34,18,8,0.3)]">
          <div className="flex items-center justify-between gap-4 border-b-2 border-[#221208]/15 pb-5">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border-2 border-[#221208] bg-[#e68a45] text-[#221208] shadow-[3px_3px_0_#221208]">
                {isEditing ? <Edit3 className="h-6 w-6" strokeWidth={2.5} /> : <ShieldAlert className="h-6 w-6" strokeWidth={2.5} />}
              </div>
              <div>
                <h2 className="text-xl font-black text-[#221208]">
                  {isEditing ? "Edit Emergency Contact" : "Add Emergency Contact"}
                </h2>
                <p className="text-xs sm:text-sm font-medium text-[#5a321a]">
                  Maintain accurate emergency and essential service information.
                </p>
              </div>
            </div>

            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="flex h-10 w-10 items-center justify-center rounded-xl border-2 border-[#221208] bg-white text-[#221208] shadow-[3px_3px_0_#221208] transition hover:bg-[#e68a45]"
                aria-label="Cancel edit"
              >
                <X className="h-5 w-5" strokeWidth={2.5} />
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            {/* Name / Service */}
            <div className="grid gap-6 md:grid-cols-2">
              <Field
                label="Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. Palitpur Police Station"
                required
              />

              <Field
                label="Service"
                name="service"
                value={form.service}
                onChange={handleChange}
                placeholder="e.g. Police, Ambulance, Fire"
                required
              />
            </div>

            {/* Phone / Alternate Phone */}
            <div className="grid gap-6 md:grid-cols-2">
              <Field
                label="Phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="e.g. 100"
                required
              />

              <Field
                label="Alternate Phone"
                name="alternate_phone"
                type="tel"
                value={form.alternate_phone}
                onChange={handleChange}
                placeholder="Optional alternate number"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-black text-[#221208] mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Brief information about this emergency service."
                className="w-full resize-none rounded-xl border-2 border-[#221208] bg-white px-4 py-3 text-sm font-semibold text-[#221208] outline-none transition focus:border-[#4a2512] focus:ring-2 focus:ring-[#e68a45]"
              />
            </div>

            {/* Display Order */}
            <div className="max-w-xs">
              <Field
                label="Display Order"
                name="display_order"
                type="number"
                value={form.display_order}
                onChange={handleChange}
                placeholder="0"
                required
              />
              <p className="mt-1 text-xs font-medium text-[#5a321a]">
                Lower numbers appear first.
              </p>
            </div>

            {/* Active */}
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-[#221208] bg-white px-4 py-3 shadow-[3px_3px_0_#221208] w-fit">
              <input
                type="checkbox"
                name="is_active"
                checked={form.is_active}
                onChange={handleChange}
                className="h-4 w-4 rounded border-2 border-[#221208] text-[#e68a45] focus:ring-[#e68a45]"
              />
              <span className="text-xs sm:text-sm font-black text-[#221208]">
                Active emergency contact
              </span>
            </label>

            {/* Submit */}
            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end pt-4 border-t-2 border-[#221208]/15">
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={saving}
                  className="rounded-xl border-2 border-[#221208] bg-white px-6 py-3 text-xs font-black text-[#221208] shadow-[3px_3px_0_#221208] transition hover:bg-slate-100 disabled:opacity-50"
                >
                  Cancel
                </button>
              )}

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#221208] bg-[#e68a45] px-8 py-3 text-xs font-black text-[#221208] shadow-[4px_4px_0_#221208] transition hover:bg-[#f4a261] disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isEditing ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>
                    {isEditing ? <Edit3 className="h-4 w-4" strokeWidth={2.5} /> : <Plus className="h-4 w-4" strokeWidth={2.5} />}
                    {isEditing ? "Update Contact" : "Create Contact"}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Contact List */}
        <div className="rounded-[28px] border-[3px] border-[#221208] bg-[#faebd7] p-8 text-[#221208] shadow-[12px_12px_0_rgba(34,18,8,0.3)]">
          <div className="mb-6 flex items-center justify-between gap-4 border-b-2 border-[#221208]/15 pb-5">
            <div>
              <h2 className="text-xl font-black text-[#221208]">
                Emergency Contacts
              </h2>
              <p className="mt-1 text-xs sm:text-sm font-medium text-[#5a321a]">
                {contacts.length} {contacts.length === 1 ? "contact" : "contacts"} managed
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex items-center gap-3 text-sm font-black text-[#221208]">
                <Loader2 className="h-6 w-6 animate-spin text-[#4a2512]" />
                Loading emergency contacts...
              </div>
            </div>
          ) : contacts.length === 0 ? (
            <div className="py-12 text-center">
              <AlertTriangle className="mx-auto h-10 w-10 text-[#4a2512]" />
              <h3 className="mt-4 text-base font-black text-[#221208]">
                No emergency contacts
              </h3>
              <p className="mt-1 text-xs sm:text-sm font-medium text-[#5a321a]">
                Add the first emergency or essential service contact.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {contacts.map((contact) => (
                <ContactCard
                  key={contact.id}
                  contact={contact}
                  deleting={deletingId === contact.id}
                  onEdit={() => startEdit(contact)}
                  onDelete={() => handleDelete(contact)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
}) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-black text-[#221208] mb-2">
        {label}
        {required && <span className="ml-1 text-red-600">*</span>}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={type === "number" ? "0" : undefined}
        step={type === "number" ? "1" : undefined}
        className="w-full rounded-xl border-2 border-[#221208] bg-white px-4 py-3 text-sm font-semibold text-[#221208] outline-none transition focus:border-[#4a2512] focus:ring-2 focus:ring-[#e68a45]"
      />
    </div>
  );
}

function ContactCard({ contact, deleting, onEdit, onDelete }) {
  return (
    <div className="rounded-[24px] border-[3px] border-[#221208] bg-white p-6 text-[#221208] shadow-[8px_8px_0_rgba(34,18,8,0.2)] transition hover:bg-[#fff5eb]">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2 border-[#221208] bg-red-600 text-white shadow-[3px_3px_0_#221208]">
            <ShieldAlert className="h-7 w-7" strokeWidth={2.5} />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="text-base font-black tracking-tight text-[#221208]">
                {contact.name}
              </h3>

              <span className="rounded-xl bg-[#4a2512] px-3 py-1 text-[10px] font-black border-2 border-[#221208] text-[#faebd7] shadow-[2px_2px_0_#221208] uppercase tracking-wider">
                {contact.service}
              </span>

              <span
                className={
                  contact.is_active
                    ? "rounded-xl bg-[#b8d85a] px-3 py-1 text-[10px] font-black border-2 border-[#221208] text-[#221208] shadow-[2px_2px_0_#221208] uppercase tracking-wider"
                    : "rounded-xl bg-slate-200 px-3 py-1 text-[10px] font-black border-2 border-[#221208] text-slate-700 shadow-[2px_2px_0_#221208] uppercase tracking-wider"
                }
              >
                {contact.is_active ? "Active" : "Inactive"}
              </span>
            </div>

            <div className="mt-3 space-y-1.5 text-xs sm:text-sm font-bold text-[#5a321a]/90">
              <p>
                <span className="font-black text-[#221208]">Phone:</span> {contact.phone}
              </p>

              {contact.alternate_phone && (
                <p>
                  <span className="font-black text-[#221208]">Alternate:</span> {contact.alternate_phone}
                </p>
              )}

              {contact.description && (
                <p className="mt-2 max-w-3xl font-medium leading-relaxed text-[#5a321a]">
                  {contact.description}
                </p>
              )}
            </div>

            <p className="mt-4 text-xs font-black text-[#5a321a]/60">
              Display order: {contact.display_order}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 gap-3 pt-2 lg:pt-0">
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-[#221208] bg-[#faebd7] px-4 py-2.5 text-xs font-black text-[#221208] shadow-[3px_3px_0_#221208] transition hover:bg-[#e68a45]"
          >
            <Edit3 className="h-4 w-4" strokeWidth={2.5} /> Edit
          </button>

          <button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            className="inline-flex items-center gap-2 rounded-xl border-2 border-[#221208] bg-red-600 px-4 py-2.5 text-xs font-black text-white shadow-[3px_3px_0_#221208] transition hover:bg-red-700 disabled:opacity-50"
          >
            {deleting ? (
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
}