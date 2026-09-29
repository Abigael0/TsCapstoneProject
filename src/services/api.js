const USERS_KEY = "complaintshq_users";
const SESSION_KEY = "complaintshq_session";
const COMPLAINTS_KEY = "complaintshq_complaints";

function delay(result, milliseconds = 300) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(result), milliseconds);
  });
}

function readStorage(key, fallback = []) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function generateLocalId(prefix) {
  return `${prefix}-${crypto.randomUUID()}`;
}

function migrateAccountIdentifiers() {
  const users = readStorage(USERS_KEY);
  const emailById = new Map();
  let usersChanged = false;

  users.forEach((user) => {
    if (user.id) {
      emailById.set(user.id, user.email.toLowerCase());
      delete user.id;
      usersChanged = true;
    }
  });

  const session = readStorage(SESSION_KEY, null);
  let sessionChanged = false;

  if (session?.id) {
    const email = emailById.get(session.id);
    if (email) session.email = email;
    delete session.id;
    sessionChanged = true;
  }

  const complaints = readStorage(COMPLAINTS_KEY, []);
  let complaintsChanged = false;

  complaints.forEach((complaint) => {
    const email = emailById.get(complaint.submittedBy);
    if (email) {
      complaint.submittedBy = email;
      complaintsChanged = true;
    }
  });

  if (usersChanged) writeStorage(USERS_KEY, users);
  if (sessionChanged) writeStorage(SESSION_KEY, session);
  if (complaintsChanged) writeStorage(COMPLAINTS_KEY, complaints);
}

const api = {
  // -----------------------------
  // Authentication
  // -----------------------------

  async login({ email, password }) {
    migrateAccountIdentifiers();
    const users = readStorage(USERS_KEY);

    const user = users.find(
      (item) =>
        item.email.toLowerCase() === email.toLowerCase()
    );

    if (!user || user.password !== password) {
      throw new Error("Invalid email or password.");
    }

const safeUser = users.map((user) => ({
    id: user.id,
  name: user.name,
  email: user.email,
  role: user.role,
  createdAt: user.createdAt,
}));
    writeStorage(SESSION_KEY, safeUser);

    return delay(safeUser);
  },

  async register({ name, email, password }) {
    return this.registerAccount({ name, email, password, role: "user" });
  },

  async registerAdmin({ name, email, password }) {
    return this.registerAccount({ name, email, password, role: "admin" });
  },

  async registerAccount({ name, email, password, role }) {
    migrateAccountIdentifiers();
    const users = readStorage(USERS_KEY);

    const existingUser = users.find(
      (item) =>
        item.email.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
      throw new Error(
        "An account with this email already exists."
      );
    }

    // const user = {
    //   name,
    //   email,
    //   password,
    //   role,
    //   createdAt: new Date().toISOString(),
    // };
 const user = {
  id: generateLocalId("USR"),
  name,
  email,
  password,
  role: "user",
  createdAt: new Date().toISOString(),
};

    users.push(user);

    writeStorage(USERS_KEY, users);

    const safeUser = {
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    };

    writeStorage(SESSION_KEY, safeUser);

    return delay(safeUser);
  },

  getStoredUser() {
    migrateAccountIdentifiers();
    return readStorage(SESSION_KEY, null);
  },

  logout() {
    localStorage.removeItem(SESSION_KEY);
  },

  // -----------------------------
  // Users
  // -----------------------------

  async getUsers() {
    migrateAccountIdentifiers();
    const users = readStorage(USERS_KEY);

    const safeUsers = users.map((user) => ({
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt,
    }));

    return delay(safeUsers);
  },

  // -----------------------------
  // Complaints
  // -----------------------------

  async getComplaints() {
    migrateAccountIdentifiers();
    const complaints = readStorage(
      COMPLAINTS_KEY,
      []
    );

    return delay(complaints);
  },

  async getComplaint(id) {
    const complaints = readStorage(
      COMPLAINTS_KEY,
      []
    );

    const complaint = complaints.find(
      (item) => String(item.id) === String(id)
    );

    return delay(complaint || null);
  },

  async createComplaint(data) {
    migrateAccountIdentifiers();
    const complaints = readStorage(
      COMPLAINTS_KEY,
      []
    );

    const user = readStorage(
      SESSION_KEY,
      null
    );

    if (!user) {
      throw new Error("You must be signed in.");
    }

    const now = new Date().toISOString();

    const complaint = {
      id: generateLocalId("CMP"),
      ticketNumber: `TKT-${Date.now()}`,
      userId: user.id,

      
      subject: data.subject,
      category: data.category,
      priority: data.priority,
      description: data.description,

      status: "Pending",
      feedback: null,

      createdAt: now,
      updatedAt: now,
    };

    complaints.unshift(complaint);

    writeStorage(
      COMPLAINTS_KEY,
      complaints
    );

    return delay(complaint);
  },

  async updateComplaint(id, updates) {
    const complaints = readStorage(
      COMPLAINTS_KEY,
      []
    );

    const index = complaints.findIndex(
      (item) => String(item.id) === String(id)
    );

    if (index === -1) {
      throw new Error("Complaint not found.");
    }

    const updatedComplaint = {
      ...complaints[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    complaints[index] = updatedComplaint;

    writeStorage(
      COMPLAINTS_KEY,
      complaints
    );

    return delay(updatedComplaint);
  },

  async resolveComplaint(id, feedback = "") {
    return this.updateComplaint(id, {
      status: "Resolved",
      feedback,
    });
  },
};

export default api;