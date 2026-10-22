
import { useState } from "react";
import { UserRound, Mail, Phone, MapPin, Building2, Pencil, Save } from "lucide-react";
import { useStore } from "../context/StoreContext";
import { getInitials } from "../utils/formatters";
import { validateProfile } from "../utils/validators";

export default function Profile() {
  const { profile, updateProfile } = useStore();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ ...profile });
  const [errors, setErrors] = useState({});

  function startEdit() {
    setForm({ ...profile });
    setErrors({});
    setEditing(true);
  }

  function submit(event) {
    event.preventDefault();
    const nextErrors = validateProfile(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    updateProfile({
      ...form,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim()
    });
    setEditing(false);
  }

  return (
    <div className="page-content">
      <div className="page-heading"><div><span className="eyebrow">ACCOUNT MANAGEMENT</span><h2>My Profile</h2><p>View and update your administrator account details.</p></div></div>

      <div className="profile-layout">
        <section className="panel profile-card">
          <div className="profile-cover"><div className="profile-avatar">{getInitials(profile.name)}</div></div>
          <div className="profile-card-body">
            <h2>{profile.name}</h2><p>{profile.role}</p>
            <span className="profile-active"><i /> Account active</span>
            <div className="profile-card-divider" />
            <div className="profile-info-line"><Mail size={16} /><span>{profile.email}</span></div>
            <div className="profile-info-line"><Phone size={16} /><span>{profile.phone}</span></div>
            <div className="profile-info-line"><Building2 size={16} /><span>{profile.company}</span></div>
            <div className="profile-info-line"><MapPin size={16} /><span>{profile.city}</span></div>
          </div>
        </section>

        <section className="panel profile-form-panel">
          <div className="panel-heading"><div><h3>Personal information</h3><p>Changes are saved in your browser storage.</p></div>
            {!editing && <button className="button button-secondary button-small" onClick={startEdit}><Pencil size={13} /> Edit profile</button>}
          </div>

          {editing ? (
            <form className="form-body profile-edit-form" onSubmit={submit} noValidate>
              <div className="form-grid">
                <label>Full name *<input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />{errors.name && <small className="field-error">{errors.name}</small>}</label>
                <label>Email address *<input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />{errors.email && <small className="field-error">{errors.email}</small>}</label>
                <label>Phone number *<input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />{errors.phone && <small className="field-error">{errors.phone}</small>}</label>
                <label>Role<input value={form.role} disabled /></label>
                <label>Company<input value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} /></label>
                <label>City<input value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} /></label>
              </div>
              <div className="modal-actions">
                <button type="button" className="button button-secondary" onClick={() => { setEditing(false); setErrors({}); }}>Cancel</button>
                <button type="submit" className="button button-primary"><Save size={14} /> Save profile</button>
              </div>
            </form>
          ) : (
            <div className="profile-fields">
              {[["Full name", profile.name], ["Email address", profile.email], ["Phone number", profile.phone], ["Role", profile.role], ["Company", profile.company], ["City", profile.city]].map(([label, value]) => <div key={label}><span>{label}</span><strong>{value || "—"}</strong></div>)}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
