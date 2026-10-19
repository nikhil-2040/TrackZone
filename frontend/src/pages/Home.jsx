import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Search, 
  PlusCircle, 
  Layers, 
  CheckCircle2, 
  MapPin, 
  Clock, 
  Compass,
  HeartHandshake
} from "lucide-react";
import Navbar from "../components/Navbar";
import loading from "../assets/loading.json";

const stats = [
  { label: "Items reunited", value: "420+", description: "Safely recovered on campus" },
  { label: "Active volunteers", value: "120+", description: "Helping monitor lost items" },
  { label: "Avg. match time", value: "18 mins", description: "From report to notification" },
  { label: "Success rate", value: "94%", description: "Verified owner reunions" },
];

const features = [
  {
    icon: Layers,
    title: "Real-time Community Feed",
    description: "One unified, live timeline for every reported item. Filter seamlessly by lost, found, category, or location.",
    badge: "Live Sync"
  },
  {
    icon: Sparkles,
    title: "Smart Match Intelligence",
    description: "Upload a photo or enter a quick description to instantly scan and fingerprint similar reports in our database.",
    badge: "AI Powered"
  },
  {
    icon: ShieldCheck,
    title: "Trust-first Contact Auth",
    description: "Privacy-preserving contact requests keep personal details protected until you choose to connect with the finder.",
    badge: "Secure"
  },
];

const steps = [
  {
    number: "01",
    title: "Post with details",
    description: "Submit a lost or found card with photos, location, and key identifiers in seconds.",
  },
  {
    number: "02",
    title: "Community & Smart Match",
    description: "Our system continuously matches descriptions and photos across the campus network.",
  },
  {
    number: "03",
    title: "Reunite safely",
    description: "Share contact information through safe requests and collect your item back securely.",
  },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1">
        {/* ================= HERO SECTION ================= */}
        <section className="relative overflow-hidden pt-8 pb-16 sm:pt-16 sm:pb-24 subtle-mesh">
          {/* Background Ambient Glows */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-tr from-indigo-500/10 via-violet-500/10 to-transparent blur-3xl pointer-events-none rounded-full" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
              
              {/* Left Column: Headline & Action */}
              <div className="lg:col-span-7 flex flex-col items-start text-left">
                
                {/* Pill Eyebrow */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200 shadow-2xs text-xs font-semibold text-slate-700 mb-6"
                >
                  <span className="flex h-2 w-2 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600" />
                  </span>
                  <span>Lost & Found, made human</span>
                  <span className="text-slate-300">|</span>
                  <span className="text-indigo-600 font-medium flex items-center gap-1">
                    TrackZone 2.0 <Sparkles className="w-3 h-3" />
                  </span>
                </motion.div>

                {/* Primary Heading */}
                <motion.h1
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]"
                >
                  Find things faster with{" "}
                  <span className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 bg-clip-text text-transparent">
                    community-powered
                  </span>{" "}
                  signals.
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="mt-5 text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed font-normal"
                >
                  TrackZone lets anyone report lost or found possessions, browse a transparent open feed, and leverage Smart Match to cross-reference images and descriptions instantly.
                </motion.p>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-8 flex flex-wrap items-center gap-3 w-full sm:w-auto"
                >
                  <button
                    onClick={() => navigate("/feed")}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm sm:text-base shadow-sm hover:shadow-md transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <Search className="w-4 h-4 text-slate-300" />
                    <span>Browse Live Feed</span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </button>

                  <button
                    onClick={() => navigate("/report")}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm sm:text-base border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4 text-indigo-600" />
                    <span>Report Lost or Found</span>
                  </button>
                </motion.div>

                {/* Trust Badges */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  className="mt-10 pt-6 border-t border-slate-200/70 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-slate-500 font-medium"
                >
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Instant Feed Broadcast</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Photo Smart Fingerprinting</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Protected Contact Exchange</span>
                  </div>
                </motion.div>

              </div>

              {/* Right Column: Hero Visual Showcase */}
              <div className="lg:col-span-5 relative flex items-center justify-center">
                <div className="w-full max-w-md bg-white/90 backdrop-blur-md rounded-3xl border border-slate-200/80 p-6 shadow-xl relative">
                  
                  {/* Decorative Lottie hand animation */}
                  <div className="w-full h-48 sm:h-56 flex items-center justify-center">
                    <Lottie 
                      animationData={loading} 
                      loop 
                      autoplay 
                      className="w-full h-full max-w-[220px]" 
                    />
                  </div>

                  {/* Simulated Match Notification Pill */}
                  <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/70 shadow-xs">
                    <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-1">
                      <span className="flex items-center gap-1.5 text-indigo-600 font-semibold">
                        <Sparkles className="w-3.5 h-3.5" />
                        Smart Match Signal
                      </span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3 h-3" /> Just now
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                      Leather Wallet spotted near Library Steps
                    </h4>
                    <div className="mt-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                        <span>Central Campus</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                        94% confidence
                      </span>
                    </div>
                  </div>

                  {/* Quick stats floating bubble */}
                  <div className="absolute -bottom-4 -left-4 sm:-bottom-5 sm:-left-5 bg-white rounded-2xl p-3 border border-slate-200 shadow-md flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                      <HeartHandshake className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-400 font-medium">Reunited Today</p>
                      <p className="text-xs font-bold text-slate-900">+14 items returned</p>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ================= STATS SECTION ================= */}
        <section className="border-y border-slate-200/80 bg-white py-10 sm:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {stats.map((stat, idx) => (
                <div 
                  key={stat.label} 
                  className={`flex flex-col ${idx !== 0 ? "lg:border-l lg:border-slate-100 lg:pl-8" : ""}`}
                >
                  <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-slate-700">
                    {stat.label}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {stat.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ================= FEATURES SECTION ================= */}
        <section className="py-16 sm:py-24 bg-slate-50" id="features">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="max-w-2xl text-left sm:text-center sm:mx-auto">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200/50">
                Engineered for speed
              </span>
              <h2 className="mt-4 text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                Every touchpoint built for faster reunions.
              </h2>
              <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
                From mobile screens to desktop browsers, everything stays fast, responsive, and intuitive so anyone can report or find items effortlessly.
              </p>
            </div>

            <div className="mt-12 sm:mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.title}
                    className="group bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 hover:border-indigo-300 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-5">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-105 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-200">
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider bg-slate-100 px-2.5 py-0.5 rounded-full">
                          {feature.badge}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-slate-500 leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </section>

        {/* ================= HOW IT WORKS ================= */}
        <section className="py-16 sm:py-24 bg-white border-y border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-6">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200/50">
                  Simple workflow
                </span>
                <h2 className="mt-4 text-2xl sm:text-4xl font-bold text-slate-900 tracking-tight">
                  Three lightweight steps to recovery.
                </h2>
                <p className="mt-3 text-sm sm:text-base text-slate-600 mb-8">
                  No complicated bureaucracy or lost forms. A direct path from missing item to verified return.
                </p>

                <div className="space-y-6">
                  {steps.map((step) => (
                    <div key={step.number} className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                        {step.number}
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-slate-900">
                          {step.title}
                        </h4>
                        <p className="mt-1 text-sm text-slate-500 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feed Teaser Card */}
              <div className="lg:col-span-6">
                <div className="bg-gradient-to-br from-indigo-900 via-slate-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="relative z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-indigo-200 border border-white/10 mb-4">
                      <Zap className="w-3.5 h-3.5 text-amber-300" />
                      Live Feed Preview
                    </span>
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                      Ready to check current listings?
                    </h3>
                    <p className="text-slate-300 text-sm leading-relaxed mb-6">
                      Explore newly reported student IDs, electronics, keys, bags, and items reported across your campus today.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => navigate("/feed")}
                        className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-sm font-semibold transition-all cursor-pointer shadow-xs"
                      >
                        Open Community Feed
                      </button>
                      <button
                        onClick={() => navigate("/report")}
                        className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold border border-white/20 transition-all cursor-pointer"
                      >
                        Report Missing Item
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ================= SMART MATCH BANNER ================= */}
        <section className="py-16 bg-slate-50" id="match">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
              <div className="max-w-xl">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200/50">
                  Smart Match Engine
                </span>
                <h3 className="mt-3 text-2xl sm:text-3xl font-bold text-slate-900">
                  Drop an image or search with natural keywords.
                </h3>
                <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                  Our matching service scans visual fingerprints and text signatures across every active listing so you don't have to scroll manually through hundreds of posts.
                </p>
              </div>

              <button
                onClick={() => navigate("/feed#smart-match")}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-sm hover:shadow transition-all shrink-0 cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Try Smart Match</span>
              </button>
            </div>
          </div>
        </section>

        {/* ================= READY TO REUNITE CTA ================= */}
        <section className="py-16 sm:py-20 bg-slate-900 text-white">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Ready to bring items back home?
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
              Create your account in seconds, browse the live board, or file a report with photo signals.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => navigate("/register")}
                className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-sm transition-all cursor-pointer"
              >
                Create Free Account
              </button>
              <button
                onClick={() => navigate("/report")}
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition-all cursor-pointer"
              >
                Report an Item
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <Compass className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-slate-900 text-sm">TrackZone</span>
            <span className="text-slate-400">· Campus Lost & Found Network</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => navigate("/feed")} className="hover:text-slate-900 transition-colors">
              Feed
            </button>
            <button onClick={() => navigate("/report")} className="hover:text-slate-900 transition-colors">
              Report
            </button>
            <button onClick={() => navigate("/login")} className="hover:text-slate-900 transition-colors">
              Sign In
            </button>
          </div>

          <div>
            © {new Date().getFullYear()} TrackZone. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
