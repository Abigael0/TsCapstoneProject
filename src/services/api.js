const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const TOKEN_KEY = "complaintshq_token";

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

async function request(endpoint, options = {}) {
  const token = getToken();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const responseBody = await response.text();
  let data = null;

  if (responseBody) {
    try {
      data = JSON.parse(responseBody);
    } catch {
      data = responseBody;
    }
  }

  if (!response.ok) {
    const validationErrors =
      typeof data?.errors === "string"
        ? data.errors
        : Array.isArray(data?.errors)
          ? data.errors
              .map((error) =>
                typeof error === "string" ? error : error?.message || error?.msg
              )
              .filter(Boolean)
              .join(" ")
          : data?.errors && typeof data.errors === "object"
            ? Object.values(data.errors)
                .flat()
                .filter((error) => typeof error === "string")
                .join(" ")
            : null;

    throw new Error(
      (typeof data === "string" && data) ||
        data?.message ||
        data?.error ||
        data?.detail ||
        validationErrors ||
        `Request failed with status ${response.status}.`
    );
  }

  return data;
}

const api = {
  // -----------------------------
  // Authentication
  // -----------------------------

  async login({ email, password }) {
    const data = await request("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: email.trim(),
        password,
      }),
    });

    if (data.token) {
      saveToken(data.token);
    }

    return data.user;
  },

  async register({
    firstName,
    lastName,
    userName,
    email,
    password,
  }) {
    const data = await request("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        userName: userName.trim(),
        email: email.trim(),
        password,
      }),
    });

    if (data.token) {
      saveToken(data.token);
    }

    return data.user;
  },

  async registerAdmin({ name, email, password }) {
  const data = await request("/auth/admin/register", {
    method: "POST",
    body: JSON.stringify({
      name: name.trim(),
      email: email.trim(),
      password,
    }),
  });

  if (data.token) {
    saveToken(data.token);
  }

  return data.user;
},

  async getCurrentUser() {
    const data = await request("/auth/me", {
      method: "GET",
    });

    return data.user;
  },

  logout() {
    clearToken();
  },

  // -----------------------------
  // Complaints
  // -----------------------------

  async createComplaint({
    title,
    description,
    category,
    priority,
  }) {
    return request("/complaints", {
      method: "POST",
      body: JSON.stringify({
        title,
        description,
        category,
        priority,
      }),
    });
  },

  async getMyComplaints(params = {}) {
    const searchParams = new URLSearchParams();

    if (params.page) {
      searchParams.set("page", params.page);
    }

    if (params.limit) {
      searchParams.set("limit", params.limit);
    }

    if (params.status) {
      searchParams.set("status", params.status);
    }

    if (params.category) {
      searchParams.set("category", params.category);
    }

    if (params.priority) {
      searchParams.set("priority", params.priority);
    }

    const query = searchParams.toString();

    return request(
      `/complaints/my${query ? `?${query}` : ""}`,
      {
        method: "GET",
      }
    );
  },

  async getComplaint(id) {
    return request(`/complaints/${encodeURIComponent(id)}`, {
      method: "GET",
    });
  },

  async closeComplaint(id) {
    return request(
      `/complaints/${encodeURIComponent(id)}/close`,
      {
        method: "PATCH",
      }
    );
  },
};

export default api;