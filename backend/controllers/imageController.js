import Image from "../models/Image.js";

export const getImages = async (req, res) => {
  try {
    const { section } = req.query;
    let query = {};

    if (section) query.section = section;
    if (query.isActive !== false) query.isActive = true;

    const images = await Image.find(query).sort({ order: 1 });
    res.json(images);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createImage = async (req, res) => {
  try {
    const image = await Image.create(req.body);
    res.status(201).json(image);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateImage = async (req, res) => {
  try {
    const image = await Image.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!image) {
      return res.status(404).json({ msg: "Image not found" });
    }

    res.json(image);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteImage = async (req, res) => {
  try {
    const image = await Image.findByIdAndDelete(req.params.id);

    if (!image) {
      return res.status(404).json({ msg: "Image not found" });
    }

    res.json({ msg: "Image deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
