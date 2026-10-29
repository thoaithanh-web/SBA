// Author: Lam Thoai Thanh - CE190169
import { useEffect, useState } from "react";
import { Alert, Button } from "react-bootstrap";
import api, { errorMessage } from "../api/client";
import { useAuth } from "../context/AuthContext";
import RecordDialog from "../components/RecordDialog";
export default function Profile() {
  const { setUser } = useAuth();
  const [profile, setProfile] = useState(null),
    [error, setError] = useState(""),
    [loading, setLoading] = useState(true),
    [editing, setEditing] = useState(false),
    [revision, setRevision] = useState(0),
    [notice, setNotice] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError("");
    api
      .get("/profile", { signal: controller.signal })
      .then((r) => {
        if (!controller.signal.aborted) {
          setProfile(r.data);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (!controller.signal.aborted) {
          setError(errorMessage(e));
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, [revision]);
  return (
    <main className="content edit-content">
      <div className="page-heading">
        <div>
          <p className="eyebrow">YOUR EDITORIAL IDENTITY</p>
          <h1>
            My profile<span className="title-dot">.</span>
          </h1>
          <p className="subtitle">
            Keep your name and contact details up to date.
          </p>
        </div>
      </div>
      {loading ? (
        <p role="status">Loading profile…</p>
      ) : error ? (
        <>
          <Alert variant="danger" role="alert">
            {error}
          </Alert>
          <Button onClick={() => setRevision((v) => v + 1)}>Try again</Button>
        </>
      ) : (
        <section className="panel form-panel">
          {notice && (
            <Alert variant="success" role="status">
              {notice}
            </Alert>
          )}
          <div className="profile-avatar">
            {profile.accountName.slice(0, 1)}
          </div>
          <h2>{profile.accountName}</h2>
          <p className="subtitle mt-2">{profile.accountEmail}</p>
          <dl className="profile-details">
            <dt>Account ID</dt>
            <dd>{profile.accountId}</dd>
            <dt>Role</dt>
            <dd>Staff</dd>
            <dt>Credentials</dt>
            <dd>
              Password stored as a one-way hash. Never exposed by this page.
            </dd>
          </dl>
          <Button onClick={() => setEditing(true)}>Edit profile</Button>
        </section>
      )}
      {editing && (
        <RecordDialog
          resource="profile"
          record={profile}
          onClose={() => setEditing(false)}
          onSaved={(data) => {
            setProfile(data);
            setUser(data);
            setEditing(false);
            setNotice("Profile updated successfully.");
          }}
        />
      )}
    </main>
  );
}
