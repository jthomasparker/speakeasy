const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const netSchema = new Schema({
    _userId: { type: Schema.Types.ObjectId, ref: 'User'},
    name: { type: String, required: true},
    netData: { type: Object }
})

const Net = mongoose.model("Net", netSchema);

module.exports = Net;