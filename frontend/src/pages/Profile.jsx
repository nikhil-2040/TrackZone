import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { message, Modal } from "antd";
import { 
  User, 
  Mail, 
  Phone, 
  PlusCircle, 
  Search, 
  Send, 
  Inbox, 
  CheckCircle2, 
  Clock, 
  MessageSquare, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  ExternalLink
} from "lucide-react";
import Navbar from "../components/Navbar";
import ItemCard from "../components/ItemCard";
import { authApi, contactApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("items");
  const [requests, setRequests] = useState({ received: [], sent: [] });
  const [shareModal, setShareModal] = useState({ open: false, request: null, contact: "" });
  const [shareLoading, setShareLoading] = useState(false);

  const isMe = useMemo(() => (!id && user) || id === user?._id, [id, user]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const { data } = id ? await authApi.profile(id) : await authApi.me();
      setProfile(data.data);
      if (isMe) {
        const [received, sent] = await Promise.all([
          contactApi.list({ type: "received" }).catch(() => ({ data: { data: [] } })),
          contactApi.list({ type: "sent" }).catch(() => ({ data: { data: [] } })),
        ]);
        setRequests({ received: received.data?.data || [], sent: sent.data?.data || [] });
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
    setShareModal({ open: true, request, contact: profile?.phone || profile?.email || "" });
  };

  const handleShareContact = async () => {
    if (!shareModal.contact.trim()) {
      return message.warning("Please provide contact information to share");
    }
    setShareLoading(true);
    try {
      await contactApi.share(shareModal.request._id, { contactInfo: shareModal.contact.trim() });
      message.success("Contact details shared with requester!");
      setShareModal({ open: false, request: null, contact: "" });
      loadProfile();
    } catch (error) {
      console.error(error);
      message.error(error.response?.data?.message || "Unable to share contact");
    } finally {
      setShareLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-full border-3 border-indigo-100 border-t-indigo-600 animate-spin" />
          <p className="text-sm font-medium text-slate-500">Loading user profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mb-4">
            <User className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Profile Not Found</h2>
          <p className="text-sm text-slate-500 mt-1 max-w-sm">
            We couldn't locate this user account or it may have been removed.
          </p>
          <button
            onClick={() => navigate("/feed")}
            className="mt-6 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-all"
          >
            Back to Feed
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        
        {/* ================= USER PROFILE CARD ================= */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs relative overflow-hidden">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* User Info Avatar & Details */}
            <div className="flex items-start sm:items-center gap-5">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white font-extrabold text-2xl sm:text-3xl flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
                {profile.name ? profile.name.charAt(0).toUpperCase() : "U"}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {profile.name}
                  </h1>
                  {isMe && (
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                      Your Account
                    </span>
                  )}
                </div>

                <p className="text-sm text-slate-500 mt-1 max-w-xl leading-relaxed">
                  {profile.bio || "Community member on TrackZone."}
                </p>

                {profile.email && (
                  <div className="mt-2.5 flex items-center gap-2 text-xs font-medium text-slate-400">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{profile.email}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats & Actions */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-slate-100">
              
              {/* Stat Boxes */}
              <div className="flex items-center gap-2">
                <div className="flex-1 sm:flex-initial px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200/70 text-center min-w-[90px]">
                  <p className="text-xl font-extrabold text-slate-900">
                    {profile.items?.length || profile.stats?.posts || 0}
                  </p>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mt-0.5">
                    Items
                  </p>
                </div>

                {isMe && (
                  <div className="flex-1 sm:flex-initial px-4 py-3 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-center min-w-[90px]">
                    <p className="text-xl font-extrabold text-indigo-700">
                      {requests.received.filter((r) => r.status !== "shared").length || profile.stats?.pendingContact || 0}
                    </p>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-indigo-500 mt-0.5">
                      Pending
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons if owner */}
              {isMe && (
                <div className="flex sm:flex-col gap-2">
                  <button
                    onClick={() => navigate("/report")}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Post Item</span>
                  </button>
                  <button
                    onClick={() => navigate("/feed")}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 shadow-2xs transition-all cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Browse Feed</span>
                  </button>
                </div>
              )}

            </div>

          </div>
        </section>

        {/* ================= TABS NAVIGATION (IF IS ME) ================= */}
        {isMe ? (
          <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-2xl max-w-fit overflow-x-auto">
            <button
              onClick={() => setActiveTab("items")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeTab === "items"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Items Posted</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === "items" ? "bg-slate-100 text-slate-700" : "bg-slate-200/80 text-slate-500"
              }`}>
                {profile.items?.length || 0}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("received")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeTab === "received"
                  ? "bg-white text-indigo-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Received Requests</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === "received" ? "bg-indigo-50 text-indigo-700" : "bg-slate-200/80 text-slate-500"
              }`}>
                {requests.received.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("sent")}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                activeTab === "sent"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Sent Requests</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === "sent" ? "bg-slate-100 text-slate-700" : "bg-slate-200/80 text-slate-500"
              }`}>
                {requests.sent.length}
              </span>
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-900">
              Items posted by {profile.name}
            </h2>
            <span className="text-xs text-slate-500 font-medium">
              {profile.items?.length || 0} items
            </span>
          </div>
        )}

        {/* ================= TAB 1: ITEMS POSTED ================= */}
        {(!isMe || activeTab === "items") && (
          <section>
            {profile.items?.length ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {profile.items.map((item) => (
                  <ItemCard key={item._id} item={item} hideActions={!isMe} isOwner={true} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs max-w-md mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
                  <Inbox className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">No items listed yet</h3>
                <p className="mt-1 text-sm text-slate-500">
                  {isMe ? "You haven't posted any lost or found items yet." : "This user has no active item reports."}
                </p>
                {isMe && (
                  <button
                    onClick={() => navigate("/report")}
                    className="mt-6 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow-xs transition-all cursor-pointer"
                  >
                    Post Your First Item
                  </button>
                )}
              </div>
            )}
          </section>
        )}

        {/* ================= TAB 2: RECEIVED REQUESTS ================= */}
        {isMe && activeTab === "received" && (
          <section className="space-y-4">
            {requests.received.length ? (
              <div className="space-y-3">
                {requests.received.map((request) => (
                  <div
                    key={request._id}
                    className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-slate-900 truncate">
                          {request.item?.title || "Item Notice"}
                        </h4>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                          {request.item?.status || "notice"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <span className="font-semibold text-slate-800">
                          {request.requester?.name || "Member"}:
                        </span>
                        <span className="bg-slate-50 px-2 py-0.5 rounded-md border border-slate-200 text-slate-700">
                          {request.requesterContact}
                        </span>
                      </div>

                      {request.message && (
                        <p className="text-xs text-slate-500 italic bg-slate-50/70 p-2.5 rounded-xl border border-slate-100 mt-2">
                          “{request.message}”
                        </p>
                      )}
                    </div>

                    <div className="shrink-0 flex items-center gap-2 self-end sm:self-center">
                      {request.status === "shared" ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Contact Shared</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => openShareModal(request)}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-xs transition-all cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Share My Contact</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs max-w-md mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
                  <ShieldCheck className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">No requests received</h3>
                <p className="mt-1 text-sm text-slate-500">
                  When other community members share their contact for items you posted, they will appear here.
                </p>
              </div>
            )}
          </section>
        )}

        {/* ================= TAB 3: SENT REQUESTS ================= */}
        {isMe && activeTab === "sent" && (
          <section className="space-y-4">
            {requests.sent.length ? (
              <div className="space-y-3">
                {requests.sent.map((request) => (
                  <div
                    key={request._id}
                    className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-slate-900">
                        {request.item?.title || "Item Notice"}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Sent contact: <span className="text-slate-700 font-medium">{request.requesterContact}</span>
                      </p>
                      {request.ownerContact && (
                        <div className="mt-2 p-2.5 rounded-xl bg-emerald-50 border border-emerald-200/70 text-xs text-emerald-800">
                          <strong>Owner shared their contact:</strong> {request.ownerContact}
                        </div>
                      )}
                    </div>

                    <div className="shrink-0 self-start sm:self-center">
                      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold border ${
                        request.status === "shared"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}>
                        {request.status === "shared" ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Response Received</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3" />
                            <span>Pending Owner Review</span>
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs max-w-md mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center mx-auto mb-4">
                  <Send className="w-8 h-8 stroke-[1.5]" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">No outgoing requests</h3>
                <p className="mt-1 text-sm text-slate-500">
                  You haven't requested contact info for any listed items yet.
                </p>
                <button
                  onClick={() => navigate("/feed")}
                  className="mt-6 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 transition-all cursor-pointer"
                >
                  Explore Feed
                </button>
              </div>
            )}
          </section>
        )}

      </main>

      {/* ================= SHARE CONTACT MODAL ================= */}
      <Modal
        title={null}
        footer={null}
        open={shareModal.open}
        onCancel={() => setShareModal({ open: false, request: null, contact: "" })}
        centered
        destroyOnClose
        className="tz-modal"
      >
        <div className="p-1">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Share Your Contact Information
              </h3>
              <p className="text-xs text-slate-500 truncate max-w-[280px]">
                Requester: {shareModal.request?.requester?.name || "Member"}
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-4">
            <p className="text-xs text-slate-600 leading-relaxed">
              Provide the phone number, email address, or messaging handle you'd like to disclose to arrange safe collection.
            </p>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                Contact Details
              </label>
              <textarea
                rows={3}
                placeholder="e.g. Phone: +1 555-0199 or WhatsApp / Telegram @username"
                value={shareModal.contact}
                onChange={(e) => setShareModal((prev) => ({ ...prev, contact: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setShareModal({ open: false, request: null, contact: "" })}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleShareContact}
                disabled={shareLoading}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                {shareLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    <span>Sharing...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Share Details</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;
