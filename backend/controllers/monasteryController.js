import Monastery from "../models/Monastery.js";

export const getMonasteries = async (req, res) => {
  try {
    const { region, sort = "-createdAt" } = req.query;
    let query = {};

    if (region) query.region = region;

    const monasteries = await Monastery.find(query).sort(sort);
    res.json(monasteries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMonastery = async (req, res) => {
  try {
    const monastery = await Monastery.findById(req.params.id)
      .populate("amenities")
      .populate("transportation");

    if (!monastery) {
      return res.status(404).json({ msg: "Monastery not found" });
    }

    res.json(monastery);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createMonastery = async (req, res) => {
  try {
    const monastery = await Monastery.create(req.body);
    res.status(201).json(monastery);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateMonastery = async (req, res) => {
  try {
    const monastery = await Monastery.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    if (!monastery) {
      return res.status(404).json({ msg: "Monastery not found" });
    }

    res.json(monastery);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteMonastery = async (req, res) => {
  try {
    const monastery = await Monastery.findByIdAndDelete(req.params.id);

    if (!monastery) {
      return res.status(404).json({ msg: "Monastery not found" });
    }

    res.json({ msg: "Monastery deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
