const Item = require("../models/Item");
const { createSignature } = require("../utils/signature");

const buildSearchClause = (searchTerm) => {
  if (!searchTerm) return null;
  return {
    $or: [
      { title: { $regex: searchTerm, $options: "i" } },
      { description: { $regex: searchTerm, $options: "i" } },
      { location: { $regex: searchTerm, $options: "i" } },
      { category: { $regex: searchTerm, $options: "i" } },
    ],
  };
};

exports.createItem = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    const {
      title,
      description,
      status,
      location,
      lostDate,
      imageUrl,
      imageData,
      category,
      contactPhone,
      contactEmail,
    } = req.body;

    if (!title || !status) {
      return res.status(400).json({ success: false, message: "Title and status are required" });
    }

    const item = await Item.create({
      title,
      description,
      status,
      location,
      lostDate: lostDate ? new Date(lostDate) : undefined,
      imageUrl,
      imageData,
      imageSignature: createSignature(imageData || imageUrl),
      category,
      contactPhone,
      contactEmail,
      postedBy: req.user.id,
    });

    const populated = await item.populate("postedBy", "name email avatar");

    return res.status(201).json({ success: true, data: populated });
  } catch (error) {
    console.error("❌ createItem error", error.message);
    return res.status(500).json({ success: false, message: "Unable to create item" });
  }
};

exports.getItems = async (req, res) => {
  try {
    const { status, search } = req.query;
    const filter = {};
    if (status && status !== "all") {
      filter.status = status;
    }
    const searchClause = buildSearchClause(search?.trim());
    if (searchClause) {
      Object.assign(filter, searchClause);
    }

    const items = await Item.find(filter)
      .sort({ createdAt: -1 })
      .limit(100)
      .populate("postedBy", "name email avatar");
    return res.status(200).json({ success: true, data: items });
  } catch (error) {
    console.error("❌ getItems error", error.message);
    return res.status(500).json({ success: false, message: "Unable to fetch items" });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate("postedBy", "name email avatar");
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }
    return res.status(200).json({ success: true, data: item });
  } catch (error) {
    console.error("❌ getItemById error", error.message);
    return res.status(500).json({ success: false, message: "Unable to get item" });
  }
};

exports.matchItems = async (req, res) => {
  try {
    const { query, imageData } = req.body;
    if (!query && !imageData) {
      return res
        .status(400)
        .json({ success: false, message: "Provide a keyword or an image" });
    }

    const signature = createSignature(imageData);
    const clauses = [];
    const textClause = buildSearchClause(query?.trim());
    if (textClause) clauses.push(textClause);
    if (signature) clauses.push({ imageSignature: signature });

    const dbQuery = clauses.length ? { $and: clauses } : {};
    const candidates = await Item.find(dbQuery).limit(20).populate("postedBy", "name email avatar");

    const scored = candidates
      .map((item) => {
        let score = 0;
        if (signature && item.imageSignature === signature) {
          score += 0.7;
        }

        if (query) {
          const haystack = `${item.title} ${item.description || ""} ${item.location || ""}`.toLowerCase();
          const needles = query.toLowerCase().split(/\s+/).filter(Boolean);
          const matches = needles.filter((needle) => haystack.includes(needle)).length;
          score += Math.min(matches / Math.max(needles.length, 1), 0.3);
        }

        return { item, score };
      })
      .sort((a, b) => b.score - a.score);

    return res.status(200).json({
      success: true,
      data: scored.map(({ item, score }) => ({ ...item.toObject(), matchScore: Number(score.toFixed(2)) })),
    });
  } catch (error) {
    console.error("❌ matchItems error", error.message);
    return res.status(500).json({ success: false, message: "Unable to match items" });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }
    if (item.postedBy.toString() !== req.user?.id) {
      return res.status(403).json({ success: false, message: "You cannot edit this item" });
    }

    const updatableFields = [
      "title",
      "description",
      "status",
      "location",
      "category",
      "contactPhone",
      "contactEmail",
      "isResolved",
    ];
    updatableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        item[field] = req.body[field];
      }
    });

    if (req.body.lostDate) {
      item.lostDate = new Date(req.body.lostDate);
    }

    if (req.body.imageUrl !== undefined) {
      item.imageUrl = req.body.imageUrl;
    }

    if (req.body.imageData !== undefined) {
      item.imageData = req.body.imageData;
    }

    if (req.body.imageData || req.body.imageUrl) {
      item.imageSignature = createSignature(req.body.imageData || req.body.imageUrl || "");
    }

    await item.save();
    const populated = await item.populate("postedBy", "name email avatar");

    return res.status(200).json({ success: true, data: populated });
  } catch (error) {
    console.error("❌ updateItem error", error.message);
    return res.status(500).json({ success: false, message: "Unable to update item" });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }
    if (item.postedBy.toString() !== req.user?.id) {
      return res.status(403).json({ success: false, message: "You cannot delete this item" });
    }

    await Item.findByIdAndDelete(req.params.id);

    return res.status(200).json({ success: true, message: "Item deleted" });
  } catch (error) {
    console.error("❌ deleteItem error", error.message);
    return res.status(500).json({ success: false, message: "Unable to delete item" });
  }
};
