import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    status: { type: String, enum: ["lost", "found"], required: true },
    location: { type: String, trim: true },
    lostDate: { type: Date },
    imageUrl: { type: String },
    imageData: { type: String },
    imageSignature: { type: String },
    category: { type: String, trim: true },
    contactPhone: { type: String },
    contactEmail: { type: String },
    isResolved: { type: Boolean, default: false },
    postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

itemSchema.index({ title: "text", description: "text", location: "text" });

const Item = mongoose.model("Item", itemSchema);

export default Item;
