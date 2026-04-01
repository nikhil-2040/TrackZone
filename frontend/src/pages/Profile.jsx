import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Empty, Input, Modal, Spin, Tabs, message } from "antd";
import Navbar from "../components/Navbar";
import ItemCard from "../components/ItemCard";
import { authApi, contactApi } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../styles/profile.css";

const Profile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState({ received: [], sent: [] });
  const [shareModal, setShareModal] = useState({ open: false, request: null, contact: "" });

  const isMe = useMemo(() => (!id && user) || id === user?._id, [id, user]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const { data } = id ? await authApi.profile(id) : await authApi.me();
      setProfile(data.data);
      if (isMe) {
        const [received, sent] = await Promise.all([
          contactApi.list({ type: "received" }),
          contactApi.list({ type: "sent" }),
        ]);
        setRequests({ received: received.data.data, sent: sent.data.data });
      }
    } catch (error) {
      console.error(error);
      message.error("Unable to load profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const openShareModal = (request) => {
    setShareModal({ open: true, request, contact: profile?.phone || "" });
  };

  const handleShareContact = async () => {
    if (!shareModal.contact) {
      return message.warning("Add contact information to share");
    }
    try {
      await contactApi.share(shareModal.request._id, { contactInfo: shareModal.contact });
      message.success("Contact shared with requester");
      setShareModal({ open: false, request: null, contact: "" });
      loadProfile();
    } catch (error) {
      console.error(error);
      message.error(error.response?.data?.message || "Unable to share contact");
    }
  };

  if (loading) {
    return (
      <div className="route-loader">
        <Spin />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="route-loader">
        <Empty description="Profile not found" />
      </div>
    );
  }

  return (
    <div className="profile-page">
      <Navbar />
      <main>
        <section className="profile-header">
          <div>
            <h1>{profile.name}</h1>
            {profile.bio ? <p>{profile.bio}</p> : <p>No bio added yet.</p>}
            {isMe && (
              <div className="profile-actions">
                <Button type="primary" onClick={() => navigate("/report")}>
                  Post new item
                </Button>
                <Button onClick={() => navigate("/feed")}>Browse feed</Button>
              </div>
            )}
          </div>
          <div className="profile-stats">
            <article>
              <span>Posts</span>
              <strong>{profile.stats?.posts || 0}</strong>
            </article>
            {isMe && (
              <article>
                <span>Pending contact</span>
                <strong>{profile.stats?.pendingContact || 0}</strong>
              </article>
            )}
          </div>
        </section>

        <section>
          <h2>Items posted</h2>
          {profile.items?.length ? (
            <div className="item-grid">
              {profile.items.map((item) => (
                <ItemCard key={item._id} item={item} hideActions />
              ))}
            </div>
          ) : (
            <Empty description="No items yet" />
          )}
        </section>

        {isMe && (
          <section className="requests-section">
            <Tabs
              items={[
                {
                  key: "received",
                  label: `Received (${requests.received.length})`,
                  children: requests.received.length ? (
                    <div className="requests-list">
                      {requests.received.map((request) => (
                        <article key={request._id} className="request-card">
                          <div>
                            <h4>{request.item?.title}</h4>
                            <p>
                              {request.requester?.name} shared contact: {request.requesterContact}
                            </p>
                            {request.message && <p className="message">“{request.message}”</p>}
                          </div>
                          {request.status === "shared" ? (
                            <span className="badge success">Shared</span>
                          ) : (
                            <Button type="primary" onClick={() => openShareModal(request)}>
                              Share my contact
                            </Button>
                          )}
                        </article>
                      ))}
                    </div>
                  ) : (
                    <Empty description="No requests yet" />
                  ),
                },
                {
                  key: "sent",
                  label: `Sent (${requests.sent.length})`,
                  children: requests.sent.length ? (
                    <div className="requests-list">
                      {requests.sent.map((request) => (
                        <article key={request._id} className="request-card">
                          <div>
                            <h4>{request.item?.title}</h4>
                            <p>Status: {request.status}</p>
                            {request.ownerContact && (
                              <p>Owner shared: {request.ownerContact}</p>
                            )}
                          </div>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <Empty description="No outgoing requests" />
                  ),
                },
              ]}
            />
          </section>
        )}
      </main>

      <Modal
        title="Share your contact"
        open={shareModal.open}
        okText="Share"
        onOk={handleShareContact}
        onCancel={() => setShareModal({ open: false, request: null, contact: "" })}
      >
        <p>Provide the contact details you would like to share with the requester.</p>
        <Input.TextArea
          rows={3}
          value={shareModal.contact}
          onChange={(e) => setShareModal((prev) => ({ ...prev, contact: e.target.value }))}
          placeholder="Phone, email, or preferred contact channel"
        />
      </Modal>
    </div>
  );
};

export default Profile;
