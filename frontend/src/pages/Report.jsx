import { useState } from "react";
import { Button, DatePicker, Form, Input, Select, message } from "antd";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { itemApi } from "../services/api";
import "../styles/report.css";

const categories = [
  "Electronics",
  "Documents",
  "Accessories",
  "Clothing",
  "Cards & IDs",
  "Other",
];

const Report = () => {
  const [form] = Form.useForm();
  const [uploadLabel, setUploadLabel] = useState("Upload reference photo (optional)");
  const [imageData, setImageData] = useState("");
  const [submitting, setSubmitting] = useState(false);
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
    const encoded = await toBase64(file);
    setImageData(encoded);
    setUploadLabel(file.name);
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
        lostDate: values.lostDate ? values.lostDate.toDate().toISOString() : undefined,
        imageData,
      };
      await itemApi.create(payload, token);
      message.success("Item posted to the feed");
      form.resetFields();
      setImageData("");
      setUploadLabel("Upload reference photo (optional)");
    } catch (error) {
      console.error(error);
      message.error(error.response?.data?.message || "Unable to post item");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="report-page">
      <Navbar />
      <main>
        <section className="report-intro">
          <div>
            <p className="eyebrow">Report center</p>
            <h1>Post a lost or found item</h1>
            <p>
              Share as many details as possible. Smart Match uses these signals to compare your report with active
              submissions.
            </p>
          </div>
          <div className="tips">
            <h3>Tips</h3>
            <ul>
              <li>Add a short, clear title (e.g., “Black Lenovo ThinkPad”).</li>
              <li>Use the reference photo so Smart Match can fingerprint it.</li>
              <li>Include a contact channel that you monitor frequently.</li>
            </ul>
          </div>
        </section>

        <section className="report-form">
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item name="status" label="Status" rules={[{ required: true, message: "Select lost or found" }]}>
              <Select options={[{ value: "lost", label: "Lost" }, { value: "found", label: "Found" }]} />
            </Form.Item>

            <Form.Item name="title" label="Title" rules={[{ required: true, message: "Enter a title" }]}>
              <Input placeholder="Black wallet near cafeteria" />
            </Form.Item>

            <Form.Item name="description" label="Description" rules={[{ required: true, message: "Describe the item" }]}>
              <Input.TextArea rows={4} placeholder="What does it look like, any identifiers, etc." />
            </Form.Item>

            <Form.Item name="category" label="Category">
              <Select options={categories.map((value) => ({ value, label: value }))} allowClear />
            </Form.Item>

            <Form.Item name="location" label="Last seen / Found at">
              <Input placeholder="Library steps, Building A lobby..." />
            </Form.Item>

            <Form.Item name="lostDate" label="Date">
              <DatePicker style={{ width: "100%" }} />
            </Form.Item>

            <div className="form-grid">
              <Form.Item name="contactEmail" label="Contact email" rules={[{ type: "email", message: "Invalid email" }]}>
                <Input placeholder="you@mail.com" />
              </Form.Item>
              <Form.Item name="contactPhone" label="Contact phone">
                <Input placeholder="(+91) 123-456-7890" />
              </Form.Item>
            </div>

            <Form.Item name="imageUrl" label="Image URL">
              <Input placeholder="https://link-to-photo" />
            </Form.Item>

            <label className="file-upload">
              <input type="file" accept="image/*" onChange={handleFileChange} />
              <span>{uploadLabel}</span>
            </label>

            <Button type="primary" htmlType="submit" loading={submitting} size="large">
              Publish to feed
            </Button>
          </Form>
        </section>
      </main>
    </div>
  );
};

export default Report;
