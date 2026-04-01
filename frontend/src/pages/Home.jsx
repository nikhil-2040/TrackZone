import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import Navbar from "../components/Navbar";
import loading from "../assets/loading.json";
import "../styles/home.css";

const stats = [
  { label: "Items reunited", value: "420+" },
  { label: "Active volunteers", value: "120" },
  { label: "Avg. match time", value: "18 mins" },
];

const features = [
  {
    title: "Lost & Found Feed",
    description: "One live timeline for every reported item, filterable by campus or category.",
  },
  {
    title: "Smart Match",
    description: "Drop a photo or describe an item to instantly scan similar reports in our database.",
  },
  {
    title: "Trust-first Auth",
    description: "Brevo-powered verification keeps spam away and conversations safe.",
  },
];

const steps = [
  "Post a lost or found card with photos and context.",
  "Track leads in the shared feed, chat securely with finders.",
  "Smart Match alerts you when an item looks like yours.",
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-wrapper">
      <Navbar />

      <header className="hero">
        <div className="hero-text">
          <motion.p className="eyebrow" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            Lost & Found, made human
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Find things faster with community-powered signals.
          </motion.h1>
          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            TrackZone lets anyone post lost or found items, browse an open feed, and use Smart Match to compare
            images or descriptions against every report.
          </motion.p>
          <div className="hero-buttons">
            <Button type="primary" size="large" onClick={() => navigate("/register")}>
              Get started
            </Button>
            <Button size="large" onClick={() => navigate("/feed")}>
              Browse feed
            </Button>
          </div>
          <div className="hero-tags">
            <span>Real-time feed</span>
            <span>Smart match</span>
            <span>Brevo verified</span>
          </div>
        </div>
        <div className="hero-visual">
          <Lottie animationData={loading} loop autoplay className="hand-animation" />
          <div className="floating-card">
            <p>Latest activity</p>
            <h4>Wallet spotted near Library</h4>
            <small>Smart match confidence · 82%</small>
          </div>
        </div>
      </header>

      <section className="stats">
        {stats.map((stat) => (
          <article key={stat.label}>
            <h3>{stat.value}</h3>
            <p>{stat.label}</p>
          </article>
        ))}
      </section>

      <section className="features" id="features">
        <div>
          <p className="eyebrow">Why TrackZone</p>
          <h2>Every touchpoint built for faster reunions.</h2>
          <p>
            From the nav to the feed, everything stays responsive so anyone on campus can report items from a phone,
            kiosk, or laptop.
          </p>
        </div>
        <div className="feature-grid">
          {features.map((feature) => (
            <article key={feature.title}>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="journey">
        <div className="journey-content">
          <p className="eyebrow">How it works</p>
          <h2>Three lightweight steps.</h2>
          <ul>
            {steps.map((step, index) => (
              <li key={step}>
                <span>{index + 1}</span>
                {step}
              </li>
            ))}
          </ul>
        </div>
        <div className="journey-card">
          <h3>Feed preview</h3>
          <p>See missing backpacks, laptops, IDs, and more as soon as they are posted.</p>
          <Button type="primary" onClick={() => navigate("/feed")}>Open feed</Button>
        </div>
      </section>

      <section className="match-banner" id="match">
        <div>
          <p className="eyebrow">Smart match</p>
          <h2>Drop an image or search by name.</h2>
          <p>
            Our matching service fingerprints every upload so you can compare photos or descriptions against active
            reports. Works on mobile and desktop.
          </p>
        </div>
        <Button size="large" type="primary" onClick={() => navigate("/feed#smart-match")}>
          Try Smart Match
        </Button>
      </section>

      <section className="cta">
        <h2>Ready to bring items back home?</h2>
        <p>Create an account, verify via Brevo, and start posting lost or found items within minutes.</p>
        <div>
          <Button type="primary" size="large" onClick={() => navigate("/register")}>
            Create account
          </Button>
          <Button size="large" onClick={() => navigate("/report")}>Report an item</Button>
        </div>
      </section>

      <footer className="landing-footer">
        © {new Date().getFullYear()} TrackZone · Built for campus lost & found crews
      </footer>
    </div>
  );
};

export default Home;
