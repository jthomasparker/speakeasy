const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const netSchema = new Schema({
    _creator: { type: Number, ref: 'User'},
    name: { type: String, required: true},
    netData: { type: Object, required: true}
})

const Net = mongoose.model("Net", netSchema);

module.exports = Net;