const JOI = require("joi");

exports.createOrganizationValidation = (payload) => {
    const JOISchema = JOI.object({
        name: JOI.string().required(),
        contact_email: JOI.string().required().email(),
        organization_id: JOI.string(),
        address: JOI.array().items({
            type: JOI.string().empty(""),
            label: JOI.string().empty(""),
            address: JOI.string().empty(""),
            city: JOI.string().empty(""),
            state: JOI.string().empty(""),
            country: JOI.string().empty(""),
            country_code: JOI.string().empty(""),
            zipcode: JOI.string().empty(""),
            location: JOI.object({
                latitude: JOI.string().empty(""),
                longitude: JOI.string().empty(""),
            }),
            timezone: JOI.object({
                offset: JOI.string().empty(""),
                zone: JOI.string().empty(""),
            }),
            is_default: JOI.boolean().empty(""),
        }),
        contact: JOI.array().items({
            type: JOI.string().empty(""),
            label: JOI.string().empty(""),
            country_code: JOI.string().empty(""),
            number: JOI.string().empty(""),
            is_default: JOI.boolean().empty(""),
        }),
        logo: JOI.object({
            large: JOI.string().empty(""),
            medium: JOI.string().empty(""),
            small: JOI.string().empty(""),
            thumbnail: JOI.string().empty(""),
        }),
        meta_data: JOI.object({
            is_super_org: JOI.string().empty(""),
            is_enabled: JOI.string().empty(""),
            is_deleted: JOI.string().empty(""),
            enabled_on: JOI.string().empty(""),
            disabled_on: JOI.string().empty(""),
            deleted_on: JOI.string().empty(""),
        }),
    });
    const JOIValidateOptions = { abortEarly: false };
    return JOISchema.validate(payload, JOIValidateOptions);
};
