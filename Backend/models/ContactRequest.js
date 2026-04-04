import mongoose from "mongoose";

const contactRequestSchema = new mongoose.Schema(
  {
    item: { type: mongoose.Schema.Types.ObjectId, ref: "Item", required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    requester: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    requesterContact: { type: String, required: true },
    ownerContact: { type: String },
    message: { type: String, maxlength: 500 },
    status: { type: String, enum: ["pending", "shared"], default: "pending" },
    sharedAt: { type: Date },
  },
  { timestamps: true }
);

contactRequestSchema.index({ item: 1, requester: 1 }, { unique: true });

const ContactRequest = mongoose.model("ContactRequest", contactRequestSchema);

export default ContactRequest;
