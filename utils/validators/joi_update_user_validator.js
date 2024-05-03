const JOI = require('joi');

exports.payloadValidation = (payload) => {
  const JOISchema = JOI.object({
    name: JOI.object({
      name_prefix: JOI.string().empty(''),
      first_name: JOI.string(),
      last_name: JOI.string(),
      name_suffix: JOI.string().empty('')
    }),
    email: JOI.string().required().email(),
    username: JOI.string().empty(''),
    identification: JOI.array().items({
      type: JOI.string().empty(''),
      value: JOI.string().empty('')
    }),
    address: JOI.array().items({
      type: JOI.string().empty(''),
      label: JOI.string().empty(''),
      address: JOI.string().empty(''),
      city: JOI.string().empty(''),
      state: JOI.string().empty(''),
      country: JOI.string().empty(''),
      country_code: JOI.string().empty(''),
      zipcode: JOI.string().empty(''),
      location: JOI.object({
        latitude: JOI.string().empty(''),
        longitude: JOI.string().empty('')
      }),
      timezone: JOI.object({
        offset: JOI.string().empty(''),
        zone: JOI.string().empty('')
      }),
      is_default: JOI.boolean().empty('')
    }),
    contact: JOI.array().items({
      type: JOI.string().empty(''),
      label: JOI.string().empty(''),
      country_code: JOI.string().empty(''),
      number: JOI.string().empty(''),
      is_default: JOI.boolean().empty('')
    }),
    social_profiles: JOI.array().items({
      label: JOI.string().empty(''),
      link: JOI.string().empty('')
    }),
    avatar: JOI.object({
      large: JOI.string().empty(''),
      medium: JOI.string().empty(''),
      small: JOI.string().empty(''),
      thumbnail: JOI.string().empty('')
    }),
    meta_data: JOI.object({
      gender: JOI.string().empty(''),
      dob: JOI.string().empty(''),
      theme_code: JOI.string().empty(''),
      is_super_admin: JOI.boolean().empty('')
    })
  });
  const JOIValidateOptions = { abortEarly: false };
  return JOISchema.validate(payload, JOIValidateOptions);
};
