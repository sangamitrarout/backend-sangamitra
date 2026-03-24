const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

// Schema & Model
const WordSchema = new mongoose.Schema({
  word: { type: String, required: true, unique: true },
  definition: { type: String, required: true }
});
const Word = mongoose.model("Word", WordSchema);

// Routes
// GET word definition
app.get("/api/word/:word", async (req, res) => {
  try {
    const found = await Word.findOne({ word: req.params.word });
    if (found) {
      res.json(found);
    } else {
      res.json({ word: req.params.word, definition: "Not found in database" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// POST new word
app.post("/api/word", async (req, res) => {
  try {
    const newWord = new Word(req.body);
    await newWord.save();
    res.json(newWord);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to save word" });
  }
});

// Start server on port 9900
const PORT = 9900;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

