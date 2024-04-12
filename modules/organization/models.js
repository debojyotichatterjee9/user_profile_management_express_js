const mongoose = require('mongoose');
const uuid = require('uuid');

const LocationSchema = new mongoose.Schema(
  {
    latitude: { type: mongoose.Schema.Types.String, trim: true },
    longitude: { type: mongoose.Schema.Types.String, trim: true },
  },
  { _id: false, created_on: false, modified_on: false },
);

const TimezoneSchema = new mongoose.Schema(
  {
    offset: { type: mongoose.Schema.Types.String, trim: true },
    zone: { type: mongoose.Schema.Types.String, trim: true },
  },
  { _id: false, created_on: false, modified_on: false },
);

const AddressSchema = new mongoose.Schema(
  {
    type: { type: mongoose.Schema.Types.String, uppercase: true, trim: true },
    label: { type: mongoose.Schema.Types.String, trim: true },
    address: { type: mongoose.Schema.Types.Mixed },
    city: { type: mongoose.Schema.Types.String, trim: true, default: '' },
    state: { type: mongoose.Schema.Types.String, trim: true, default: '' },
    country: { type: mongoose.Schema.Types.String, trim: true, default: '' },
    country_code: {
      type: mongoose.Schema.Types.String,
      uppercase: true,
      trim: true,
      default: '',
    },
    zipcode: { type: mongoose.Schema.Types.String, trim: true, default: '' },
    location: LocationSchema,
    timezone: TimezoneSchema,
    is_default: { type: mongoose.Schema.Types.Boolean, default: false },
  },
  { _id: false, created_on: false, modified_on: false },
);

const ContactSchema = new mongoose.Schema(
  {
    type: { type: mongoose.Schema.Types.String, uppercase: true, trim: true },
    label: { type: mongoose.Schema.Types.String, trim: true },
    country_code: { type: mongoose.Schema.Types.String, trim: true },
    number: { type: mongoose.Schema.Types.String, trim: true },
    is_default: { type: mongoose.Schema.Types.Boolean, default: false },
  },
  { _id: false, created_on: false, modified_on: false },
);

const LogoSchema = new mongoose.Schema(
  {
    large: { type: mongoose.Schema.Types.String, trim: true },
    medium: { type: mongoose.Schema.Types.String, trim: true },
    small: { type: mongoose.Schema.Types.String, trim: true },
    thumbnail: { type: mongoose.Schema.Types.String, trim: true },
  },
  { _id: false, created_on: false, modified_on: false },
);

const MetaDataSchema = new mongoose.Schema(
  {
    is_super_org: { type: mongoose.Schema.Types.Boolean, default: false },
    is_enabled: { type: mongoose.Schema.Types.Boolean, default: false },
    is_deleted: { type: mongoose.Schema.Types.Boolean, default: false },
    enabled_on: { type: mongoose.Schema.Types.Date, default: new Date() },
    disabled_on: { type: mongoose.Schema.Types.Date, default: null },
    deleted_on: { type: mongoose.Schema.Types.Date, default: null },
  },
  { _id: false, created_on: false, modified_on: false },
);

const OrganizationSchema = new mongoose.Schema(
  {
    name: {
      type: mongoose.Schema.Types.String,
      trim: true,
      index: true,
      require: [true, 'Organization must have a name!'],
    },
    contact_email: {
      type: mongoose.Schema.Types.String,
      trim: true,
      lowercase: true,
      index: true,
      require: [true, 'Organization must have an unique email address!'],
    },
    organization_id: {
      type: mongoose.Schema.Types.String,
      default: uuid.v4,
      unique: true,
    },
    address: [AddressSchema],
    contact: [ContactSchema],
    logo: { type: LogoSchema, default: () => ({}) },
    meta_data: { type: MetaDataSchema, default: () => ({}) },
  },
  {
    collection: 'organization',
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  },
);

OrganizationSchema.virtual('id').get(function () {
  return String(this._id);
});
exports.Organization = mongoose.model('Organization', OrganizationSchema);
