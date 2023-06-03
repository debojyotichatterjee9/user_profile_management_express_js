const JOI = require("joi");


exports.userValidation = (payload) => {
  const JOISchema = JOI.object({
    name: JOI.object({
      name_prefix:
      first_name:
      last_name:
      name_suffix:
    }),
    email: JOI.string(),
    username: JOI.string(),
    authentication: JOI.object({
      user_id:
      secret_hash:
      salt_key:
    }),
    identification: JOI.array().items({
      type:
      value:
    }),
    address: JOI.array().items({
      label:
      address:
      city:
      state:
      country:
      country_code:
      zip_code:
      location:
      timezone:
      is_default:
    }),
    contact:
    social_profiles:
    avatar:
    meta_data:
    // username: JOI.string()
    //   .min(5)
    //   .max(30)
    //   .required(),

    // email: JOI.string()
    //   .email()
    //   .min(5)
    //   .max(50)
    //   .optional()
  });
  return JOISchema.validate(payload);
}
