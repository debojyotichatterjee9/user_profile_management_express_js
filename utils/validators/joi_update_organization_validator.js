const JOI = require("joi");

exports.payloadValidation = (payload) => {
    const JOISchema = JOI.object({
        name: JOI.string().optional().optional(),
        contact_email: JOI.string().optional().optional().email(),
        address: JOI.array().optional().items({
            type: JOI.string().optional().optional().empty(""),
            label: JOI.string().optional().optional().empty(""),
            address: JOI.string().optional().optional().empty(""),
            city: JOI.string().optional().empty(""),
            state: JOI.string().optional().empty(""),
            country: JOI.string().optional().empty(""),
            country_code: JOI.string().optional().empty(""),
            zipcode: JOI.string().optional().empty(""),
            location: JOI.object({
                latitude: JOI.string().optional().empty(""),
                longitude: JOI.string().optional().empty(""),
            }),
            timezone: JOI.object({
                offset: JOI.string().optional().empty(""),
                zone: JOI.string().optional().empty(""),
            }),
            is_default: JOI.boolean().optional(),
        }),
        contact: JOI.array().items({
            type: JOI.string().optional().empty(""),
            label: JOI.string().optional().empty(""),
            country_code: JOI.string().optional().empty(""),
            number: JOI.string().optional().empty(""),
            is_default: JOI.boolean().optional(),
        }),
        logo: JOI.object({
            large: JOI.string().optional().empty(""),
            medium: JOI.string().optional().empty(""),
            small: JOI.string().optional().empty(""),
            thumbnail: JOI.string().optional().empty(""),
        }),
        meta_data: JOI.object({
            is_super_org: JOI.string().optional().empty(""),
            is_enabled: JOI.string().optional().empty(""),
            is_deleted: JOI.string().optional().empty(""),
            enabled_on: JOI.string().optional().empty(""),
            disabled_on: JOI.string().optional().empty(""),
            deleted_on: JOI.string().optional().empty(""),
        }),
    });
    const JOIValidateOptions = { abortEarly: false };
    return JOISchema.validate(payload, JOIValidateOptions);
};
