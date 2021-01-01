const mongoose = require("mongoose");

const rateSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  oneStar: {
    type: Number,
    default: 0,
  },
  twoStar: {
    type: Number,
    default: 0,
  },
  threeStar: {
    type: Number,
    default: 0,
  },
  fourStar: {
    type: Number,
    default: 0,
  },
  fiveStar: {
    type: Number,
    default: 0,
  },
  totalRate: {
    type: Number,
    default: 0,
  },
});

rateSchema.pre("save", async function (next) {
  const chat = this;
  const total =
    chat.oneStar +
    chat.twoStar +
    chat.threeStar +
    chat.fourStar +
    chat.fiveStar;
  if (total) {
    chat.totalRate =
      chat.oneStar +
      chat.twoStar * 2 +
      chat.threeStar * 3 +
      chat.fourStar * 4 +
      chat.fiveStar * 5;
    chat.totalRate = chat.totalRate / total;
    await chat.save()
  }
  next();
});

const Rate = mongoose.model("Rate", rateSchema);
module.exports = Rate;
