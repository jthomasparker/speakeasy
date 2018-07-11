const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const trainerSchema = new Schema({
    input: { type: String, required: true },
    sentiment: { type: Number, required: true},
    moods: { type: Array },
    trained: { type: Boolean, default: false, required: true}
})

const Trainer = mongoose.model("Trainer", trainerSchema);

module.exports = Trainer;