import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Empty, Input, Modal, Segmented, Spin, message } from "antd";
import Navbar from "../components/Navbar";
import ItemCard from "../components/ItemCard";
import { contactApi, itemApi } from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../styles/feed.css";

const statusOptions = [
  { label: "All", value: "all" },
  { label: "Lost", value: "lost" },
  { label: "Found", value: "found" },
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
      const { data } = await itemApi.list({ status, search, ...filters });
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

  const handleSearch = (value) => {
    setSearch(value);
    loadItems({ search: value });
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

  const openContactModal = (item) => {
    if (!user) {
      message.info("Please log in to share contact");
      navigate("/login");
      return;
    }
    setContactModal({ open: true, item });
    setContactForm({ contactInfo: user.phone || "", message: "" });
  };

  const handleContactShare = async () => {
    if (!contactForm.contactInfo) {
      return message.warning("Add contact information");
    }
    setContactLoading(true);
    try {
      await contactApi.create(contactModal.item._id, contactForm);
      message.success("Contact shared with poster");
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
    <div className="feed-page">
      <Navbar />
      <main>
        <section className="feed-controls">
          <div>
            <h1>Community feed</h1>
            <p>Browse every lost or found report in one responsive view.</p>
          </div>
          <div className="controls">
            <Segmented options={statusOptions} value={status} onChange={setStatus} />
            <Input.Search placeholder="Search by title, location..." allowClear onSearch={handleSearch} enterButton />
          </div>
        </section>

        {loading ? (
          <div className="centered">
            <Spin />
          </div>
        ) : items.length ? (
          <section className="item-grid">
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
          <Empty description="No items yet" />
        )}

        <section className="smart-match" id="smart-match">
          <div>
            <h2>Smart Match</h2>
            <p>Compare your description or upload a photo to scan the database.</p>
          </div>
          <form onSubmit={handleMatch}>
            <Input
              placeholder="Describe the item"
              value={matchForm.query}
              onChange={(e) => setMatchForm((prev) => ({ ...prev, query: e.target.value }))}
            />
            <label className="upload">
              <input type="file" accept="image/*" onChange={handleFileChange} />
              <span>{matchForm.imageData ? "Image attached" : "Upload reference image"}</span>
            </label>
            <Button type="primary" htmlType="submit" loading={matchLoading}>
              Run match
            </Button>
          </form>
        </section>

        {matchResults.length > 0 && (
          <section className="match-results">
            <div className="results-head">
              <h3>Potential matches</h3>
              <span>{matchResults.length} items</span>
            </div>
            <div className="item-grid">
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
          </section>
        )}
      </main>
      <Modal
        title={contactModal.item ? `Share contact for ${contactModal.item.title}` : "Share contact"}
        open={contactModal.open}
        onCancel={() => setContactModal({ open: false, item: null })}
        onOk={handleContactShare}
        okButtonProps={{ loading: contactLoading }}
      >
        <Input
          placeholder="How can they reach you?"
          value={contactForm.contactInfo}
          onChange={(e) => setContactForm((prev) => ({ ...prev, contactInfo: e.target.value }))}
        />
        <Input.TextArea
          rows={3}
          placeholder="Optional message"
          value={contactForm.message}
          onChange={(e) => setContactForm((prev) => ({ ...prev, message: e.target.value }))}
          style={{ marginTop: "0.75rem" }}
        />
      </Modal>
    </div>
  );
};

export default Feed;
