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
      password: JOI.string().required()
    }),
    identification: JOI.array().items({
      type: JOI.string(),
      value: JOI.string()
    }),
    address: JOI.array().items({
      type: JOI.string(),
      label: JOI.string(),
      address: JOI.string(),
      city: JOI.string(),
      state: JOI.string(),
      country: JOI.string(),
      country_code: JOI.string(),
      zipcode: JOI.string(),
      location: JOI.object({
        latitude: JOI.string(),
        longitude: JOI.string()
      }),
      timezone: JOI.object({
        offset: JOI.string(),
        zone: JOI.string()
      }),
      is_default: JOI.boolean()
    }),
    contact: JOI.array().items({
      type: JOI.string(),
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
    })
  });
  const JOIValidateOptions = { abortEarly: false }
  return JOISchema.validate(payload, JOIValidateOptions)
}
