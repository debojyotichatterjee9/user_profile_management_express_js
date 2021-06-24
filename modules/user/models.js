const mongoose = require("mongoose")
const uuid = require("uuid");

const UserSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.String, default: uuid.v4 },
    first_name: { type: mongoose.Schema.Types.String },
    last_name: { type: mongoose.Schema.Types.String },
    email: { type: mongoose.Schema.Types.String, index: true },
    username: { type: mongoose.Schema.Types.String, index: true },
}, {
    collection: "users",
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
});
UserSchema.virtual("id").get(function () {
    return String(this._id);
});
exports.User = mongoose.model("User", UserSchema);