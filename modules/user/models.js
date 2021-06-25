const mongoose = require("mongoose")
const uuid = require("uuid");
const crypto = require("crypto");



const UserContactSchema = new mongoose.Schema({
    label: String,
    street: { type: mongoose.Schema.Types.Mixed },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    country: { type: String, default: '' },
    zipcode: { type: String, default: '' },
    phone: { type: String, default: '' },
    is_primary: { type: mongoose.Schema.Types.Boolean, default: true },
});


const UserSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.String, default: uuid.v4 },
    first_name: { type: mongoose.Schema.Types.String, trim: true },
    last_name: { type: mongoose.Schema.Types.String, trim: true },
    email: { type: mongoose.Schema.Types.String, trim: true, lowercase: true, index: true },
    username: { type: mongoose.Schema.Types.String, trim: true, lowercase: true, index: true },
    contact: [UserContactSchema],
    theme_code: { type: mongoose.Schema.Types.String, default: "" },
    is_admin: { type: mongoose.Schema.Types.Boolean, default: false },
    avatar: { type: mongoose.Schema.Types.String, trim: true },
    secret_hash: { type: mongoose.Schema.Types.String },
    salt_key: { type: mongoose.Schema.Types.String },
    is_enabled: { type: mongoose.Schema.Types.Boolean },
    is_disabled: { type: mongoose.Schema.Types.Boolean, default: false },

}, {
    collection: "users",
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
});
UserSchema.virtual("id").get(function() {
    return String(this._id);
});
UserSchema.virtual("full_name").get(function() {
    return String(this.first_name + " " + this.last_name);
});

UserSchema.methods.setPassword = function (password) {
    this.salt_key = crypto.randomBytes(24).toString("hex");
    this.secret_hash = crypto
        .pbkdf2Sync(password, this.salt_key, 1000, 64, "sha512")
        .toString("hex");
}

UserSchema.methods.validatePassword = function (password) {
    const passwordHash = crypto
        .pbkdf2Sync(password, this.salt_key, 1000, 64, "sha512")
        .toString("hex");
    return (this.secret_hash === passwordHash);
};
exports.User = mongoose.model("User", UserSchema);