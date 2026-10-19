import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { message, Modal } from "antd";
import { 
  Search, 
  Sparkles, 
  Upload, 
  Check, 
  X, 
  Filter, 
  Inbox, 
  PlusCircle, 
  Send,
  Tag,
  ArrowRight
} from "lucide-react";
import Navbar from "../components/Navbar";
import ItemCard from "../components/ItemCard";
import { contactApi, itemApi } from "../services/api";
import { useAuth } from "../context/AuthContext";

const statusOptions = [
  { label: "All Items", value: "all" },
  { label: "Lost Items", value: "lost" },
  { label: "Found Items", value: "found" },
];

const Feed = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [matchForm, setMatchForm] = useState({ query: "", imageData: "" });
  const [matchResults, setMatchResults] = useState([]);
  const [matchLoading, setMatchLoading] = useState(false);
  const [contactModal, setContactModal] = useState({ open: false, item: null });
  const [contactForm, setContactForm] = useState({ contactInfo: "", message: "" });
  const [contactLoading, setContactLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const loadItems = async (filters = {}) => {
    setLoading(true);
    try {
      const activeStatus = filters.status !== undefined ? filters.status : status;
      const activeSearch = filters.search !== undefined ? filters.search : search;
      const params = {};
      if (activeStatus && activeStatus !== "all") params.status = activeStatus;
      if (activeSearch && activeSearch.trim()) params.search = activeSearch.trim();

      const { data } = await itemApi.list(params);
      setItems(data.data || []);
    } catch (error) {
      console.error(error);
      message.error("Unable to load feed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems({ status });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadItems({ search });
  };

  const handleClearSearch = () => {
    setSearch("");
    loadItems({ search: "" });
  };

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleMatch = async (event) => {
    event.preventDefault();
    if (!matchForm.query && !matchForm.imageData) {
      return message.warning("Enter a keyword or upload an image");
    }

    setMatchLoading(true);
    try {
      const { data } = await itemApi.match(matchForm);
      setMatchResults(data.data || []);
      if (!data.data || data.data.length === 0) {
        message.info("No matching items found. Try different keywords or images.");
      }
    } catch (error) {
      console.error(error);
      message.error("Smart match failed");
    } finally {
      setMatchLoading(false);
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const base64 = await toBase64(file);
    setMatchForm((prev) => ({ ...prev, imageData: base64 }));
  };

  const handleRemoveImage = () => {
    setMatchForm((prev) => ({ ...prev, imageData: "" }));
  };

  const openContactModal = (item) => {
    if (!user) {
      message.info("Please log in to share contact");
      navigate("/login");
      return;
    }
    setContactModal({ open: true, item });
    setContactForm({ contactInfo: user.phone || user.email || "", message: "" });
  };

  const handleContactShare = async () => {
    if (!contactForm.contactInfo.trim()) {
      return message.warning("Please provide contact information");
    }
    setContactLoading(true);
    try {
      await contactApi.create(contactModal.item._id, contactForm);
      message.success("Contact shared with poster!");
      setContactModal({ open: false, item: null });
      setContactForm({ contactInfo: "", message: "" });
    } catch (error) {
      console.error(error);
      message.error(error.response?.data?.message || "Unable to share contact");
    } finally {
      setContactLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 sm:space-y-12">
        
        {/* ================= HEADER & FILTER CONTROLS ================= */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  Community Feed
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                  {items.length} {items.length === 1 ? "item" : "items"}
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                Live timeline of lost and found items submitted by campus members.
              </p>
            </div>

            <button
              onClick={() => navigate("/report")}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-xs hover:shadow transition-all shrink-0 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Report Item</span>
            </button>
          </div>

          {/* Filter & Search Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t border-slate-100">
            
            {/* Status Segmented Buttons */}
            <div className="flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/70 self-start sm:self-auto">
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStatus(opt.value)}
                  className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer ${
                    status === opt.value
                      ? "bg-white text-slate-900 font-semibold shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            {/* Search Input Box */}
            <form onSubmit={handleSearchSubmit} className="flex-1 sm:max-w-md relative">
              <div className="relative flex items-center">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search by title, location, keywords..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-16 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
                <div className="absolute right-1.5 flex items-center gap-1">
                  {search && (
                    <button
                      type="button"
                      onClick={handleClearSearch}
                      className="p-1 rounded-md text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    type="submit"
                    className="px-2.5 py-1 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
                  >
                    Go
                  </button>
                </div>
              </div>
            </form>

          </div>
        </div>

        {/* ================= ITEMS GRID & STATES ================= */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <div className="w-10 h-10 rounded-full border-3 border-indigo-100 border-t-indigo-600 animate-spin" />
            <p className="text-sm font-medium text-slate-500">Loading community listings...</p>
          </div>
        ) : items.length > 0 ? (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <ItemCard
                key={item._id}
                item={item}
                isOwner={item.postedBy?._id === user?._id}
                isLogged={Boolean(user)}
                onContact={() => openContactModal(item)}
              />
            ))}
          </section>
        ) : (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/80 shadow-xs max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
              <Inbox className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No items found</h3>
            <p className="mt-1 text-sm text-slate-500 max-w-sm mx-auto">
              {search || status !== "all"
                ? "Try clearing your filters or search keywords to view other items."
                : "No lost or found items have been posted yet. Be the first to share one!"}
            </p>
            <div className="mt-6 flex justify-center gap-3">
              {(search || status !== "all") && (
                <button
                  onClick={() => {
                    setStatus("all");
                    setSearch("");
                    loadItems({ status: "all", search: "" });
                  }}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer"
                >
                  Clear Filters
                </button>
              )}
              <button
                onClick={() => navigate("/report")}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-xs transition-all cursor-pointer"
              >
                Post an Item
              </button>
            </div>
          </div>
        )}

        {/* ================= SMART MATCH SECTION ================= */}
        <section 
          id="smart-match" 
          className="bg-white rounded-3xl border border-indigo-100 shadow-sm overflow-hidden"
        >
          <div className="p-6 sm:p-8 border-b border-slate-100 bg-gradient-to-r from-indigo-50/50 via-white to-slate-50">
            <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-1">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>AI Visual & Keyword Fingerprinting</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Smart Match Finder
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl">
              Type keywords (e.g. “Black Dell charger”) or attach a reference photo. Smart Match scans existing reports to find potential matches.
            </p>
          </div>

          <form onSubmit={handleMatch} className="p-6 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Description Input */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Item Description or Keywords
                </label>
                <input
                  type="text"
                  placeholder="e.g. Silver AirPods Pro case, Blue hydro flask with stickers..."
                  value={matchForm.query}
                  onChange={(e) => setMatchForm((prev) => ({ ...prev, query: e.target.value }))}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                />
              </div>

              {/* File Upload Dropzone */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                  Reference Photo (Optional)
                </label>
                
                {matchForm.imageData ? (
                  <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200/80">
                    <div className="flex items-center gap-3">
                      <img 
                        src={matchForm.imageData} 
                        alt="Reference preview" 
                        className="w-10 h-10 object-cover rounded-lg border border-emerald-300"
                      />
                      <span className="text-xs font-semibold text-emerald-800">
                        Image attached for matching
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-100"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 p-3.5 rounded-xl border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50 hover:bg-indigo-50/30 text-slate-600 text-xs font-medium cursor-pointer transition-all">
                    <Upload className="w-4 h-4 text-indigo-500" />
                    <span>Upload photo to compare</span>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                )}
              </div>

            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                type="submit"
                disabled={matchLoading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm shadow-xs transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
              >
                {matchLoading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    <span>Analyzing reports...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Run Smart Match</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Potential Matches Results Area */}
          {matchResults.length > 0 && (
            <div className="p-6 sm:p-8 bg-slate-50 border-t border-slate-200/80 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    Potential Matches Found
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Items ranked by visual & text similarity confidence.
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-600 text-white shadow-2xs">
                  {matchResults.length} matches
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {matchResults.map((item) => (
                  <ItemCard
                    key={`${item._id}-match`}
                    item={item}
                    isOwner={item.postedBy?._id === user?._id}
                    isLogged={Boolean(user)}
                    onContact={() => openContactModal(item)}
                  />
                ))}
              </div>
            </div>
          )}
        </section>

      </main>

      {/* ================= SHARE CONTACT MODAL ================= */}
      <Modal
        title={null}
        footer={null}
        open={contactModal.open}
        onCancel={() => setContactModal({ open: false, item: null })}
        centered
        destroyOnClose
        className="tz-modal"
      >
        <div className="p-1">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Share Contact Details
              </h3>
              <p className="text-xs text-slate-500 truncate max-w-[280px]">
                Item: {contactModal.item?.title || "Selected Item"}
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Your Contact Information
              </label>
              <input
                type="text"
                placeholder="Phone number or preferred email..."
                value={contactForm.contactInfo}
                onChange={(e) => setContactForm((prev) => ({ ...prev, contactInfo: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Note or Message (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="e.g. I found this near the library lobby, happy to hand it over!"
                value={contactForm.message}
                onChange={(e) => setContactForm((prev) => ({ ...prev, message: e.target.value }))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setContactModal({ open: false, item: null })}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleContactShare}
                disabled={contactLoading}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-50"
              >
                {contactLoading ? (
                  <>
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Contact Request</span>
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

export default Feed;
