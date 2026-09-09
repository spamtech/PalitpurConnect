const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api/v1";

/*
|--------------------------------------------------------------------------
| Generic API Request
|--------------------------------------------------------------------------
*/

async function request(endpoint, options = {}) {
  const token = localStorage.getItem(
    "palitpurconnect_access_token"
  );

  const headers = {
    ...(options.headers || {}),
  };

  // Only add JSON content-type if the body is not FormData (for file uploads)
  if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data.message ||
        "Something went wrong. Please try again."
    );
  }

  return data;
}

/*
|--------------------------------------------------------------------------
| API
|--------------------------------------------------------------------------
*/

export const api = {
  /*
  |--------------------------------------------------------------------------
  | AUTHENTICATION
  |--------------------------------------------------------------------------
  */

  register: (payload) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  verifyEmail: (payload) =>
    request("/auth/verify-email", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  resendVerificationOtp: (payload) =>
    request("/auth/verify-email/resend", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  login: (payload) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  me: () =>
    request("/auth/me", {
      method: "GET",
    }),

  logout: () =>
    request("/auth/logout", {
      method: "POST",
    }),

  getAllUsersAdmin: () =>
    request("/auth/admin/users", {
      method: "GET",
    }),

  /*
  |--------------------------------------------------------------------------
  | ADMIN DASHBOARD
  |--------------------------------------------------------------------------
  */

  getAdminDashboardStats: () =>
    request("/admin/dashboard/stats", {
      method: "GET",
    }),

  /*
  |--------------------------------------------------------------------------
  | ADMIN ANNOUNCEMENTS
  |--------------------------------------------------------------------------
  */

  getAdminAnnouncements: () =>
    request("/admin/announcements", {
      method: "GET",
    }),

  createAnnouncement: (payload) =>
    request("/admin/announcements", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateAnnouncement: (id, payload) =>
    request(`/admin/announcements/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  deleteAnnouncement: (id) =>
    request(`/admin/announcements/${id}`, {
      method: "DELETE",
    }),

  /*
  |--------------------------------------------------------------------------
  | PUBLIC / CITIZEN ANNOUNCEMENTS
  |--------------------------------------------------------------------------
  */

  getAnnouncements: () =>
    request("/announcements", {
      method: "GET",
    }),

  getAnnouncementById: (id) =>
    request(`/announcements/${id}`, {
      method: "GET",
    }),

  /*
  |--------------------------------------------------------------------------
  | ADMIN DIRECTORY
  |--------------------------------------------------------------------------
  */

  getAdminDirectoryEntries: () =>
    request("/admin/directory", {
      method: "GET",
    }),

  createAdminDirectoryEntry: (payload) =>
    request("/admin/directory", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateAdminDirectoryEntry: (id, payload) =>
    request(`/admin/directory/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  deleteAdminDirectoryEntry: (id) =>
    request(`/admin/directory/${id}`, {
      method: "DELETE",
    }),

  /*
  |--------------------------------------------------------------------------
  | PUBLIC / CITIZEN DIRECTORY
  |--------------------------------------------------------------------------
  */

  getDirectory: () =>
    request("/directory", {
      method: "GET",
    }),

  getDirectoryById: (id) =>
    request(`/directory/${id}`, {
      method: "GET",
    }),

  /*
  |--------------------------------------------------------------------------
  | ADMIN EMERGENCY CONTACTS
  |--------------------------------------------------------------------------
  */

  getAdminEmergencyContacts: () =>
    request("/admin/emergency", {
      method: "GET",
    }),

  createAdminEmergencyContact: (payload) =>
    request("/admin/emergency", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  updateAdminEmergencyContact: (id, payload) =>
    request(`/admin/emergency/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  deleteAdminEmergencyContact: (id) =>
    request(`/admin/emergency/${id}`, {
      method: "DELETE",
    }),

  /*
  |--------------------------------------------------------------------------
  | PUBLIC / CITIZEN EMERGENCY CONTACTS
  |--------------------------------------------------------------------------
  */

  getEmergencyContacts: () =>
    request("/emergency", {
      method: "GET",
    }),

  getEmergencyContactById: (id) =>
    request(`/emergency/${id}`, {
      method: "GET",
    }),

  /*
  |--------------------------------------------------------------------------
  | ADMIN GRIEVANCES
  |--------------------------------------------------------------------------
  */

  getAdminGrievances: () =>
    request("/admin/grievances", {
      method: "GET",
    }),

  updateAdminGrievance: (id, payload) =>
    request(`/admin/grievances/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  /*
  |--------------------------------------------------------------------------
  | CITIZEN GRIEVANCES
  |--------------------------------------------------------------------------
  */

  submitGrievance: (payload) =>
    request("/grievances", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  trackGrievance: (ticketNumber) =>
    request(`/grievances/track/${ticketNumber}`, {
      method: "GET",
    }),

  getMyGrievances: () =>
    request("/grievances/my", {
      method: "GET",
    }),

  getGrievanceById: (id) =>
    request(`/grievances/${id}`, {
      method: "GET",
    }),

  /*
  |--------------------------------------------------------------------------
  | LANDING PAGE MANAGEMENT
  |--------------------------------------------------------------------------
  */

  getLandingContent: () =>
    request("/landing", {
      method: "GET",
    }),

  getAllLandingContentAdmin: () =>
    request("/landing/admin/all", {
      method: "GET",
    }),

  updateLandingContentMultipart: (payload) => {
    let body = payload;
    if (!(payload instanceof FormData)) {
      body = new FormData();
      Object.keys(payload).forEach((key) => {
        if (payload[key] !== undefined && payload[key] !== null) {
          if (
            key === "areas" ||
            key === "gallery_metadata" ||
            (typeof payload[key] === "object" && !(payload[key] instanceof File))
          ) {
            body.append(key, JSON.stringify(payload[key]));
          } else {
            body.append(key, payload[key]);
          }
        }
      });
    }

    return request("/landing/update", {
      method: "POST",
      body: body,
    });
  },

  deleteLandingSection: (key) =>
    request(`/landing/${key}`, {
      method: "DELETE",
    }),
};