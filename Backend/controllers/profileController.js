import ContactRequest from "../models/ContactRequest.js";
import Item from "../models/Item.js";
import User from "../models/User.js";

const sanitizeUser = (userDoc, includePrivate = false) => {
  if (!userDoc) return null;
  const user = userDoc.toObject();
  delete user.password;
  delete user.otp;
  delete user.otpExpires;
  if (!includePrivate) {
    delete user.email;
    delete user.phone;
  }
  return user;
};

const getUserPayload = async ({ userId, includePrivate }) => {
  const user = await User.findById(userId);
  if (!user) return null;

  const items = await Item.find({ postedBy: userId }).sort({ createdAt: -1 });
  const pendingCount = await ContactRequest.countDocuments({ owner: userId, status: "pending" });

  return {
    ...sanitizeUser(user, includePrivate),
    stats: {
      posts: items.length,
      pendingContact: includePrivate ? pendingCount : undefined,
    },
    items,
  };
};

export const getCurrentProfile = async (req, res) => {
  try {
    const payload = await getUserPayload({ userId: req.user.id, includePrivate: true });
    return res.status(200).json({ success: true, data: payload });
  } catch (error) {
    console.error("❌ getCurrentProfile error", error.message);
    return res.status(500).json({ success: false, message: "Unable to fetch profile" });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const includePrivate = req.user?.id === id;
    const payload = await getUserPayload({ userId: id, includePrivate });
    if (!payload) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, data: payload });
  } catch (error) {
    console.error("❌ getUserProfile error", error.message);
    return res.status(500).json({ success: false, message: "Unable to fetch profile" });
  }
};
