import { useState } from "react";
import { DatePicker, Form, message } from "antd";
import { useNavigate } from "react-router-dom";
import { 
  PlusCircle, 
  Upload, 
  MapPin, 
  Calendar, 
  Mail, 
  Phone, 
  Tag, 
  FileText, 
  CheckCircle2, 
  X, 
  Sparkles, 
  HelpCircle,
  Link as LinkIcon
} from "lucide-react";
import Navbar from "../components/Navbar";
import { itemApi } from "../services/api";

const categories = [
  "Electronics",
  "Documents",
  "Accessories",
  "Clothing",
  "Cards & IDs",
  "Keys",
  "Other",
];

const Report = () => {
  const [form] = Form.useForm();
  const [uploadLabel, setUploadLabel] = useState("");
  const [imageData, setImageData] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("lost");
  const navigate = useNavigate();

  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const encoded = await toBase64(file);
      setImageData(encoded);
      setUploadLabel(file.name);
      message.success("Image attached for Smart Match");
    } catch (err) {
      console.error(err);
      message.error("Error reading image file");
    }
  };

  const handleRemoveImage = () => {
    setImageData("");
    setUploadLabel("");
  };

  const onFinish = async (values) => {
    const token = localStorage.getItem("token");
    if (!token) {
      message.warning("Login required to post");
      navigate("/login");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        ...values,
        status: values.status || selectedStatus,
        lostDate: values.lostDate ? values.lostDate.toDate().toISOString() : undefined,
        imageData,
      };
      await itemApi.create(payload, token);
      message.success("Item successfully published to the feed!");
      form.resetFields();
      setImageData("");
      setUploadLabel("");
      navigate("/feed");
    } catch (error) {
      console.error(error);
      message.error(error.response?.data?.message || "Unable to post item");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Form Section */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xs">
            
            {/* Header */}
            <div className="border-b border-slate-100 pb-6 mb-8">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/60 mb-3">
                <PlusCircle className="w-3.5 h-3.5" />
                Community Notice
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Report a Lost or Found Item
              </h1>
              <p className="mt-1.5 text-sm text-slate-500 leading-relaxed">
                Provide as many descriptive identifiers as possible. Smart Match will cross-reference signals with active listings.
              </p>
            </div>

            <Form 
              form={form} 
              layout="vertical" 
              onFinish={onFinish}
              initialValues={{ status: "lost" }}
              requiredMark={false}
              className="space-y-6"
            >
              
              {/* Status Radio Pills */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Item Status <span className="text-rose-500">*</span>
                </label>
                <Form.Item 
                  name="status" 
                  rules={[{ required: true, message: "Select lost or found" }]}
                  className="mb-0"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedStatus("lost");
                        form.setFieldsValue({ status: "lost" });
                      }}
                      className={`py-3 px-4 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        selectedStatus === "lost"
                          ? "bg-rose-50 border-rose-300 text-rose-700 shadow-xs ring-2 ring-rose-500/20"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      <span>I Lost Something</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedStatus("found");
                        form.setFieldsValue({ status: "found" });
                      }}
                      className={`py-3 px-4 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        selectedStatus === "found"
                          ? "bg-emerald-50 border-emerald-300 text-emerald-700 shadow-xs ring-2 ring-emerald-500/20"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>I Found Something</span>
                    </button>
                  </div>
                </Form.Item>
              </div>

              {/* Title Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Item Title <span className="text-rose-500">*</span>
                </label>
                <Form.Item 
                  name="title" 
                  rules={[{ required: true, message: "Please enter an item title" }]}
                  className="mb-0"
                >
                  <input 
                    type="text" 
                    placeholder="e.g. Midnight Blue MacBook Air with stickers, Black leather wallet..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                  />
                </Form.Item>
              </div>

              {/* Description Input */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Detailed Description <span className="text-rose-500">*</span>
                </label>
                <Form.Item 
                  name="description" 
                  rules={[{ required: true, message: "Please describe the item" }]}
                  className="mb-0"
                >
                  <textarea 
                    rows={4}
                    placeholder="Include brand, color, distinguishing marks, scratches, accessories, keychain, or contents..."
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none"
                  />
                </Form.Item>
              </div>

              {/* Category & Location Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Category */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Category
                  </label>
                  <Form.Item name="category" className="mb-0">
                    <select
                      className="w-full px-3.5 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </Form.Item>
                </div>

                {/* Location */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Location Seen / Found
                  </label>
                  <Form.Item name="location" className="mb-0">
                    <div className="relative flex items-center">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                      <input 
                        type="text" 
                        placeholder="e.g. Science Library, Cafeteria 2nd floor"
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>
                  </Form.Item>
                </div>

              </div>

              {/* Date & Image URL Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Date Picker */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Approximate Date
                  </label>
                  <Form.Item name="lostDate" className="mb-0">
                    <DatePicker 
                      className="w-full py-2.5 px-3 rounded-xl bg-slate-50 border-slate-200" 
                      placeholder="Select date" 
                    />
                  </Form.Item>
                </div>

                {/* External Image URL */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Image URL (Optional)
                  </label>
                  <Form.Item name="imageUrl" className="mb-0">
                    <div className="relative flex items-center">
                      <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                      <input 
                        type="url" 
                        placeholder="https://image-link..."
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>
                  </Form.Item>
                </div>

              </div>

              {/* Photo Upload Area */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Reference Photo Upload
                </label>

                {imageData ? (
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200">
                    <div className="flex items-center gap-3">
                      <img 
                        src={imageData} 
                        alt="Upload preview" 
                        className="w-14 h-14 object-cover rounded-xl border border-indigo-300 shadow-2xs" 
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-900 line-clamp-1">
                          {uploadLabel || "Attached photo"}
                        </p>
                        <p className="text-[11px] text-indigo-700 flex items-center gap-1 mt-0.5">
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          Ready for Smart Match fingerprinting
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-slate-50/70 hover:bg-indigo-50/30 cursor-pointer transition-all">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-indigo-600 shadow-2xs mb-2">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-semibold text-slate-800">
                      Upload photo from device
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      JPEG, PNG, WEBP up to 5MB
                    </p>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                  </label>
                )}
              </div>

              {/* Contact Channels Grid */}
              <div className="pt-2 border-t border-slate-100">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                  Direct Contact Info (Optional)
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-600">
                      Contact Email
                    </label>
                    <Form.Item 
                      name="contactEmail" 
                      rules={[{ type: "email", message: "Please enter a valid email" }]}
                      className="mb-0"
                    >
                      <div className="relative flex items-center">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                        <input 
                          type="email" 
                          placeholder="you@campus.edu"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        />
                      </div>
                    </Form.Item>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-slate-600">
                      Contact Phone
                    </label>
                    <Form.Item name="contactPhone" className="mb-0">
                      <div className="relative flex items-center">
                        <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                        <input 
                          type="text" 
                          placeholder="+1 (555) 000-0000"
                          className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                        />
                      </div>
                    </Form.Item>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-base shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 active:scale-[0.99]"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      <span>Publishing to community...</span>
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-5 h-5 text-indigo-400" />
                      <span>Publish Item to Feed</span>
                    </>
                  )}
                </button>
              </div>

            </Form>

          </div>

          {/* Right Column: Tips & Guidelines */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
              <div className="flex items-center gap-2 text-indigo-600 font-bold text-xs uppercase tracking-wider mb-2">
                <HelpCircle className="w-4 h-4" />
                <span>Posting Guide</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-4">
                How to get faster results
              </h3>
              
              <ul className="space-y-4 text-xs sm:text-sm text-slate-600">
                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-semibold">Specific identifiers:</strong>
                    Mention scratches, stickers, or distinctive marks without disclosing sensitive info like card numbers.
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-semibold">Attach photos:</strong>
                    Smart Match uses photo fingerprints to compare visually matching items across reports.
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <strong className="text-slate-900 block font-semibold">Monitor requests:</strong>
                    Check your profile regularly for contact requests from potential finders or owners.
                  </div>
                </li>
              </ul>
            </div>

            {/* Smart Match info box */}
            <div className="bg-gradient-to-br from-indigo-50/70 to-violet-50/70 rounded-3xl p-6 border border-indigo-100">
              <div className="flex items-center gap-2 text-indigo-700 font-bold text-xs uppercase tracking-wider mb-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Automated Alerting</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 mb-1">
                Continuous Match Scanning
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                As soon as your item is published, TrackZone actively scans incoming lost & found reports to alert you when a match is detected.
              </p>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
};

export default Report;
