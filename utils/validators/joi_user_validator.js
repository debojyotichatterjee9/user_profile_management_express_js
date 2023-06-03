const { options } = require("joi");
const JOI = require("joi");


exports.userValidation = (payload) => {
  const JOISchema = JOI.object({
    name: JOI.object({
      name_prefix: JOI.string(),
      first_name: JOI.string(),
      last_name: JOI.string(),
      name_suffix: JOI.string()
    }),
    email: JOI.string(),
    username: JOI.string(),
    authentication: JOI.object({
      user_id: JOI.string(),
      secret_hash: JOI.string(),
      salt_key: JOI.string()
    }),
    identification: JOI.array().items({
      type: JOI.string(),
      value: JOI.string()
    }),
    address: JOI.array().items({
      label: JOI.string(),
      address: JOI.string(),
      city: JOI.string(),
      state: JOI.string(),
      country: JOI.string(),
      country_code: JOI.string(),
      zipcode: JOI.string(),
      location: JOI.string(),
      timezone: JOI.string(),
      is_default: JOI.boolean()
    }),
    contact: JOI.array().items({
      label: JOI.string(),
      country_code: JOI.string(),
      number: JOI.string(),
      is_default: JOI.boolean()
    }),
    social_profiles: JOI.array().items({
      label: JOI.string(),
      link: JOI.string(),
    }),
    avatar: JOI.object({
      large: JOI.string(),
      medium: JOI.string(),
      small: JOI.string(),
      thumbnail: JOI.string(),
    }),
    meta_data: JOI.object({
      gender: JOI.string(),
      dob: JOI.string(),
      theme_code: JOI.string(),
      is_super_admin: JOI.boolean(),
      is_enabled: JOI.boolean(),
      is_activated: JOI.boolean(),
      is_deleted: JOI.boolean(),
      enabled_on: JOI.string(),
      disabled_on: JOI.string(),
      activated_on: JOI.string(),
      deleted_on: JOI.string()
    })
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
  const JOIValidateOptions = { abortEarly: false }
  return JOISchema.validate(payload, JOIValidateOptions)
}
