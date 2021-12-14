const mongoose = require("mongoose")
const uuid = require("uuid");
const crypto = require("crypto");



const AddressSchema = new mongoose.Schema({
    label: { type: mongoose.Schema.Types.String, uppercase: true, trim: true },
    address: { type: mongoose.Schema.Types.Mixed },
    city: { type: mongoose.Schema.Types.String, trim: true, default: '' },
    state: { type: mongoose.Schema.Types.String, trim: true, default: '' },
    country: { type: mongoose.Schema.Types.String, trim: true, default: '' },
    country_code: { type: mongoose.Schema.Types.String, uppercase:true, trim: true, default: '' },
    zipcode: { type: mongoose.Schema.Types.String, trim: true, default: '' },
    is_default: { type: mongoose.Schema.Types.Boolean, default: false },
}, { _id : false, created_on: false, modified_on: false });

const ContactSchema = new mongoose.Schema({
    label: { type: mongoose.Schema.Types.String, uppercase: true, trim: true },
    country_code: { type: mongoose.Schema.Types.String, trim: true },
    number: { type: mongoose.Schema.Types.String, trim: true },
    is_default: { type: mongoose.Schema.Types.Boolean, default: false },
}, { _id : false, created_on: false, modified_on: false });

const SocialProfilesSchema = new mongoose.Schema({
    label: { type: mongoose.Schema.Types.String, lowercase: true, trim: true, default: null },
    link: { type: mongoose.Schema.Types.String, trim: true, default: null }
}, { _id : false, created_on: false, modified_on: false });


const UserSchema = new mongoose.Schema({
    _id: { type: mongoose.Schema.Types.String, default: uuid.v4 },
    first_name: { type: mongoose.Schema.Types.String, trim: true },
    last_name: { type: mongoose.Schema.Types.String, trim: true },
    email: { type: mongoose.Schema.Types.String, trim: true, lowercase: true, index: true, require:[true, "User must have an email address!"] },
    username: { type: mongoose.Schema.Types.String, trim: true, lowercase: true, index: true },
    address: [AddressSchema],
    contact: [ContactSchema],
    social_profiles: [SocialProfilesSchema],
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