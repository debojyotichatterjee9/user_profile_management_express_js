const { Organization } = require("./models");

exports.createOrganization = async (payload) => {
    try {
        const organizationInfo = new Organization();
        organizationInfo.name = payload.name;
        organizationInfo.contact_email = payload.contact_email;
        organizationInfo.address = payload.address;
        organizationInfo.contact = payload.contact;
        organizationInfo.logo = payload.logo;
        await organizationInfo.save();
        return {
            errorFlag: false,
            organizationInfo,
        };
    } catch (error) {
        return {
            errorFlag: true,
            message: error.message,
        };
    }
};
