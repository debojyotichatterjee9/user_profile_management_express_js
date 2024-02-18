const mongoose = require('mongoose');
const uuid = require('uuid');
const crypto = require('crypto');

const NameSchema = new mongoose.Schema({
  name_prefix: { type: mongoose.Schema.Types.String, trim: true },
  first_name: { type: mongoose.Schema.Types.String, trim: true },
  last_name: { type: mongoose.Schema.Types.String, trim: true },
  name_suffix: { type: mongoose.Schema.Types.String, trim: true }

}, { _id: false, created_on: false, modified_on: false });

const AuthenticationSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.String, default: uuid.v4, unique: true },
  secret_hash: { type: mongoose.Schema.Types.String, default: null },
  salt_key: { type: mongoose.Schema.Types.String, default: null }
}, { _id: false, created_on: false, modified_on: false });

const IdentificationSchema = new mongoose.Schema({
  type: { type: mongoose.Schema.Types.String, default: null },
  value: { type: mongoose.Schema.Types.String, unique: true, trim: true }
}, { _id: false, created_on: false, modified_on: false });

const LocationSchema = new mongoose.Schema({
  latitude: { type: mongoose.Schema.Types.String, trim: true },
  longitude: { type: mongoose.Schema.Types.String, trim: true }
}, { _id: false, created_on: false, modified_on: false });

const TimezoneSchema = new mongoose.Schema({
  offset: { type: mongoose.Schema.Types.String, trim: true },
  zone: { type: mongoose.Schema.Types.String, trim: true }
}, { _id: false, created_on: false, modified_on: false });

const AddressSchema = new mongoose.Schema({
  type: { type: mongoose.Schema.Types.String, uppercase: true, trim: true },
  label: { type: mongoose.Schema.Types.String, trim: true },
  address: { type: mongoose.Schema.Types.Mixed },
  city: { type: mongoose.Schema.Types.String, trim: true, default: '' },
  state: { type: mongoose.Schema.Types.String, trim: true, default: '' },
  country: { type: mongoose.Schema.Types.String, trim: true, default: '' },
  country_code: { type: mongoose.Schema.Types.String, uppercase: true, trim: true, default: '' },
  zipcode: { type: mongoose.Schema.Types.String, trim: true, default: '' },
  location: LocationSchema,
  timezone: TimezoneSchema,
  is_default: { type: mongoose.Schema.Types.Boolean, default: false }
}, { _id: false, created_on: false, modified_on: false });

const ContactSchema = new mongoose.Schema({
  type: { type: mongoose.Schema.Types.String, uppercase: true, trim: true },
  label: { type: mongoose.Schema.Types.String, trim: true },
  country_code: { type: mongoose.Schema.Types.String, trim: true },
  number: { type: mongoose.Schema.Types.String, trim: true },
  is_default: { type: mongoose.Schema.Types.Boolean, default: false }
}, { _id: false, created_on: false, modified_on: false });

const SocialProfilesSchema = new mongoose.Schema({
  label: { type: mongoose.Schema.Types.String, lowercase: true, trim: true, default: null },
  link: { type: mongoose.Schema.Types.String, trim: true, default: null }
}, { _id: false, created_on: false, modified_on: false });

const AvatarSchema = new mongoose.Schema({
  large: { type: mongoose.Schema.Types.String, trim: true },
  medium: { type: mongoose.Schema.Types.String, trim: true },
  small: { type: mongoose.Schema.Types.String, trim: true },
  thumbnail: { type: mongoose.Schema.Types.String, trim: true }
}, { _id: false, created_on: false, modified_on: false });

const MetaDataSchema = new mongoose.Schema({
  gender: { type: mongoose.Schema.Types.String, trim: true },
  dob: { type: mongoose.Schema.Types.Date },
  theme_code: { type: mongoose.Schema.Types.String, default: null },
  is_super_admin: { type: mongoose.Schema.Types.Boolean, default: false },
  is_enabled: { type: mongoose.Schema.Types.Boolean, default: false },
  is_activated: { type: mongoose.Schema.Types.Boolean, default: false },
  is_deleted: { type: mongoose.Schema.Types.Boolean, default: false },
  enabled_on: { type: mongoose.Schema.Types.Date, default: new Date() },
  disabled_on: { type: mongoose.Schema.Types.Date, default: null },
  activated_on: { type: mongoose.Schema.Types.Date, default: null },
  deleted_on: { type: mongoose.Schema.Types.Date, default: null }
}, { _id: false, created_on: false, modified_on: false });

const UserSchema = new mongoose.Schema({
  name: { type: NameSchema, default: () => ({}) },
  email: { type: mongoose.Schema.Types.String, trim: true, lowercase: true, index: true, require: [true, 'User must have an unique email address!'] },
  username: { type: mongoose.Schema.Types.String, trim: true, lowercase: true, index: true },
  organization_id: { type: mongoose.Schema.Types.String, default: uuid.NIL },
  authentication: { type: AuthenticationSchema, default: () => ({}) },
  identification: [IdentificationSchema],
  address: [AddressSchema],
  contact: [ContactSchema],
  social_profiles: [SocialProfilesSchema],
  avatar: { type: AvatarSchema, default: () => ({}) },
  meta_data: { type: MetaDataSchema, default: () => ({}) }

}, {
  collection: 'users',
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});
UserSchema.virtual('id').get(function () {
  return String(this._id);
});
UserSchema.virtual('full_name').get(function () {
  return String(this.first_name + ' ' + this.last_name);
});

UserSchema.methods.setPassword = function (password) {
  try {
    this.authentication.salt_key = crypto.randomBytes(24).toString('hex');
    this.authentication.secret_hash = crypto
      .pbkdf2Sync(password, this.authentication.salt_key, 1000, 64, 'sha512')
      .toString('hex');
  } catch (error) {
    console.log(`ERROR --> ${error.message}`);
    throw new Error(error.message);
  }
};

UserSchema.methods.validatePassword = function (password) {
  const passwordHash = crypto
    .pbkdf2Sync(password, this.salt_key, 1000, 64, 'sha512')
    .toString('hex');
  return (this.secret_hash === passwordHash);
};
exports.User = mongoose.model('User', UserSchema);
