import ContactRequest from "../models/ContactRequest.js";
import Item from "../models/Item.js";

const populateRequest = (query) =>
  query
    .populate("item", "title status location postedBy")
    .populate("requester", "name email avatar")
    .populate("owner", "name email avatar");

export const createContactRequest = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { message, contactInfo } = req.body;

    if (!contactInfo) {
      return res.status(400).json({ success: false, message: "Contact info is required" });
    }

    const item = await Item.findById(itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    if (!item.postedBy) {
      return res.status(400).json({ success: false, message: "Item owner is undefined" });
    }

    if (item.postedBy.toString() === req.user.id) {
      return res.status(400).json({ success: false, message: "You already manage this item" });
    }

    const request = await ContactRequest.create({
      item: itemId,
      owner: item.postedBy,
      requester: req.user.id,
      requesterContact: contactInfo,
      message,
    });

    const populated = await populateRequest(ContactRequest.findById(request._id));

    return res.status(201).json({ success: true, data: populated });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: "You already sent a request for this item" });
    }
    console.error("❌ createContactRequest error", error.message);
    return res.status(500).json({ success: false, message: "Unable to create contact request" });
  }
};

export const getContactRequests = async (req, res) => {
  try {
    const { type = "all" } = req.query;
    let filter;
    if (type === "sent") {
      filter = { requester: req.user.id };
    } else if (type === "received") {
      filter = { owner: req.user.id };
    } else {
      filter = { $or: [{ requester: req.user.id }, { owner: req.user.id }] };
    }

    const requests = await populateRequest(ContactRequest.find(filter).sort({ createdAt: -1 }));

    return res.status(200).json({ success: true, data: requests });
  } catch (error) {
    console.error("❌ getContactRequests error", error.message);
    return res.status(500).json({ success: false, message: "Unable to fetch requests" });
  }
};

export const shareContactInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const { contactInfo } = req.body;

    if (!contactInfo) {
      return res.status(400).json({ success: false, message: "Contact info is required" });
    }

    const request = await ContactRequest.findById(id);
    if (!request) {
      return res.status(404).json({ success: false, message: "Request not found" });
    }

    if (request.owner.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: "Not authorized" });
    }

    request.ownerContact = contactInfo;
    request.status = "shared";
    request.sharedAt = new Date();
    await request.save();

    const populated = await populateRequest(ContactRequest.findById(id));

    return res.status(200).json({ success: true, data: populated });
  } catch (error) {
    console.error("❌ shareContactInfo error", error.message);
    return res.status(500).json({ success: false, message: "Unable to share contact" });
  }
};
