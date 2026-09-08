
import {
  AlertTriangle,
  Check,
  Edit3,
  Loader2,
  Plus,
  Trash2,
  X,
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
    alternate_phone:
      contact.alternate_phone || "",
    description: contact.description || "",
    is_active: Boolean(contact.is_active),
    display_order:
      Number(contact.display_order) || 0,
    created_at: contact.created_at,
    updated_at: contact.updated_at,
  };
}

export default function EmergencyAdmin() {
  const [contacts, setContacts] = useState([]);

  const [form, setForm] =
    useState(EMPTY_FORM);

  const [editingId, setEditingId] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] =
    useState("");

  const isEditing =
    Boolean(editingId);

  useEffect(() => {
    loadContacts();
  }, []);

  async function loadContacts() {
    try {
      setLoading(true);
      setError("");

      /*
        Expected response:

        {
          success: true,
          message: "Emergency contacts fetched successfully",
          data: {
            contacts: [
              {
                id: "...",
                name: "...",
                service: "...",
                phone: "...",
                alternate_phone: "...",
                description: "...",
                is_active: true,
                display_order: 0,
                created_at: "...",
                updated_at: "..."
              }
            ]
          }
        }
      */

      const response =
        await api.getAdminEmergencyContacts();

      const data =
        response?.data?.contacts;

      if (!Array.isArray(data)) {
        throw new Error(
          "Invalid emergency contacts response from server."
        );
      }

      setContacts(
        data
          .map(normalizeContact)
          .sort(
            (a, b) =>
              a.display_order -
              b.display_order
          )
      );
    } catch (err) {
      console.error(
        "Failed to load emergency contacts:",
        err
      );

      setError(
        err.message ||
          "Unable to load emergency contacts."
      );
    } finally {
      setLoading(false);
    }
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
        type === "checkbox"
          ? checked
          : value,
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

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function startEdit(contact) {
    setError("");
    setSuccess("");

    setEditingId(contact.id);

    setForm({
      name: contact.name,
      service: contact.service,
      phone: contact.phone,
      alternate_phone:
        contact.alternate_phone,
      description:
        contact.description,
      is_active:
        contact.is_active,
      display_order:
        contact.display_order,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function validateForm() {
    if (!form.name.trim()) {
      return "Contact name is required.";
    }

    if (!form.service.trim()) {
      return "Service is required.";
    }

    if (!form.phone.trim()) {
      return "Phone number is required.";
    }

    const order =
      Number(form.display_order);

    if (
      !Number.isInteger(order) ||
      order < 0
    ) {
      return "Display order must be a non-negative whole number.";
    }

    return "";
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const validationError =
      validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    const payload = {
      name: form.name.trim(),
      service: form.service.trim(),
      phone: form.phone.trim(),
      alternate_phone:
        form.alternate_phone.trim() ||
        null,
      description:
        form.description.trim() ||
        null,
      is_active:
        Boolean(form.is_active),
      display_order:
        Number(form.display_order),
    };

    try {
      setSaving(true);

      if (isEditing) {
        /*
          Expected response:

          {
            success: true,
            message: "Emergency contact updated successfully",
            data: {
              contact: { ... }
            }
          }
        */

        const response =
          await api.updateAdminEmergencyContact(
            editingId,
            payload
          );

        const updatedContact =
          response?.data?.contact;

        if (!updatedContact) {
          throw new Error(
            "Invalid update response from server."
          );
        }

        const normalized =
          normalizeContact(
            updatedContact
          );

        setContacts((current) =>
          current
            .map((contact) =>
              contact.id === editingId
                ? normalized
                : contact
            )
            .sort(
              (a, b) =>
                a.display_order -
                b.display_order
            )
        );

        setSuccess(
          "Emergency contact updated successfully."
        );
      } else {
        /*
          Expected response:

          {
            success: true,
            message: "Emergency contact created successfully",
            data: {
              contact: { ... }
            }
          }
        */

        const response =
          await api.createAdminEmergencyContact(
            payload
          );

        const createdContact =
          response?.data?.contact;

        if (!createdContact) {
          throw new Error(
            "Invalid create response from server."
          );
        }

        setContacts((current) =>
          [
            normalizeContact(
              createdContact
            ),
            ...current,
          ].sort(
            (a, b) =>
              a.display_order -
              b.display_order
          )
        );

        setSuccess(
          "Emergency contact created successfully."
        );
      }

      resetForm();
    } catch (err) {
      console.error(
        "Failed to save emergency contact:",
        err
      );

      setError(
        err.message ||
          "Unable to save emergency contact."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(contact) {
    const confirmed =
      window.confirm(
        `Delete "${contact.name}" from emergency contacts?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(contact.id);
      setError("");
      setSuccess("");

      /*
        Expected response:

        {
          success: true,
          message: "Emergency contact deleted successfully",
          data: {
            id: "..."
          }
        }
      */

      await api.deleteAdminEmergencyContact(
        contact.id
      );

      setContacts((current) =>
        current.filter(
          (item) =>
            item.id !== contact.id
        )
      );

      if (editingId === contact.id) {
        resetForm();
      }

      setSuccess(
        "Emergency contact deleted successfully."
      );
    } catch (err) {
      console.error(
        "Failed to delete emergency contact:",
        err
      );

      setError(
        err.message ||
          "Unable to delete emergency contact."
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
              Emergency Contacts
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Maintain emergency and important
              service numbers.
            </p>
          </div>

          <Button
            type="button"
            onClick={startCreate}
          >
            <Plus className="h-4 w-4" />
            Add Contact
          </Button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            <X className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-700">
            <Check className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Form */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {isEditing
                  ? "Edit Emergency Contact"
                  : "Add Emergency Contact"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Maintain accurate emergency and
                essential service information.
              </p>
            </div>

            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-6 space-y-6"
          >
            {/* Name / Service */}
            <div className="grid gap-5 md:grid-cols-2">
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
            <div className="grid gap-5 md:grid-cols-2">
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
                value={
                  form.alternate_phone
                }
                onChange={handleChange}
                placeholder="Optional alternate number"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-semibold text-slate-700"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Brief information about this emergency service."
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
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

              <p className="mt-2 text-xs text-slate-500">
                Lower numbers appear first.
              </p>
            </div>

            {/* Active */}
            <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
              <input
                type="checkbox"
                name="is_active"
                checked={form.is_active}
                onChange={handleChange}
                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />

              <span>
                <span className="block text-sm font-semibold text-slate-800">
                  Active emergency contact
                </span>

                <span className="mt-1 block text-xs text-slate-500">
                  Active contacts can be displayed
                  to citizens.
                </span>
              </span>
            </label>

            {/* Submit */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />

                    {isEditing
                      ? "Updating..."
                      : "Creating..."}
                  </>
                ) : (
                  <>
                    {isEditing ? (
                      <Edit3 className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}

                    {isEditing
                      ? "Update Contact"
                      : "Create Contact"}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>

        {/* Contact List */}
        <div className="mt-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Emergency Contacts
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              {contacts.length}{" "}
              {contacts.length === 1
                ? "contact"
                : "contacts"}
            </p>
          </div>

          {loading ? (
            <div className="mt-5 flex min-h-40 items-center justify-center rounded-2xl border border-slate-200 bg-white">
              <Loader2 className="h-7 w-7 animate-spin text-emerald-600" />
            </div>
          ) : contacts.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-10 text-center">
              <AlertTriangle className="mx-auto h-10 w-10 text-slate-300" />

              <h3 className="mt-4 font-semibold text-slate-900">
                No emergency contacts
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Add the first emergency or essential
                service contact.
              </p>
            </div>
          ) : (
            <div className="mt-5 grid gap-4">
              {contacts.map((contact) => (
                <ContactCard
                  key={contact.id}
                  contact={contact}
                  deleting={
                    deletingId ===
                    contact.id
                  }
                  onEdit={() =>
                    startEdit(contact)
                  }
                  onDelete={() =>
                    handleDelete(contact)
                  }
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
      <label
        htmlFor={name}
        className="block text-sm font-semibold text-slate-700"
      >
        {label}

        {required && (
          <span className="ml-1 text-red-500">
            *
          </span>
        )}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={
          type === "number"
            ? "0"
            : undefined
        }
        step={
          type === "number"
            ? "1"
            : undefined
        }
        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
      />
    </div>
  );
}

function ContactCard({
  contact,
  deleting,
  onEdit,
  onDelete,
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex min-w-0 gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
            <AlertTriangle className="h-7 w-7" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900">
                {contact.name}
              </h3>

              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                {contact.service}
              </span>

              <span
                className={
                  contact.is_active
                    ? "rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700"
                    : "rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500"
                }
              >
                {contact.is_active
                  ? "Active"
                  : "Inactive"}
              </span>
            </div>

            <div className="mt-3 space-y-1 text-sm text-slate-600">
              <p>
                <span className="font-semibold">
                  Phone:
                </span>{" "}
                {contact.phone}
              </p>

              {contact.alternate_phone && (
                <p>
                  <span className="font-semibold">
                    Alternate:
                  </span>{" "}
                  {contact.alternate_phone}
                </p>
              )}

              {contact.description && (
                <p className="mt-2 max-w-3xl leading-6 text-slate-500">
                  {contact.description}
                </p>
              )}
            </div>

            <p className="mt-3 text-xs font-medium text-slate-400">
              Display order:{" "}
              {contact.display_order}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
          >
            <Edit3 className="h-4 w-4" />
            Edit
          </button>

          <button
            type="button"
            onClick={onDelete}
            disabled={deleting}
            className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {deleting ? (
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

