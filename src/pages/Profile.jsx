import { User, Mail, Shield } from "lucide-react";

export default function Profile({ user }) {
  if (!user) return null;

  return (
    <section className="profile-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">Account</p>
          <h1>Profile</h1>
          <p>
            View your account information.
          </p>
        </div>
      </div>

      <div className="profile-card">
        <div className="profile-avatar">
          {user.name
            ?.split(" ")
            .map((name) => name[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()}
        </div>

        <div className="profile-information">
          <div className="profile-row">
            <div className="profile-icon">
              <User size={18} />
            </div>

            <div>
              <span>Name</span>
              <strong>{user.name}</strong>
            </div>
          </div>

          <div className="profile-row">
            <div className="profile-icon">
              <Mail size={18} />
            </div>

            <div>
              <span>Email</span>
              <strong>{user.email}</strong>
            </div>
          </div>

          <div className="profile-row">
            <div className="profile-icon">
              <Shield size={18} />
            </div>

            <div>
              <span>Account role</span>
              <strong>{user.role}</strong>
            </div>
          </div>

          <div className="profile-row">
            <div className="profile-icon">
              <User size={18} />
            </div>

            <div>
              <span>User ID</span>
              <code>{user.id}</code>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}