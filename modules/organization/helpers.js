const { Organization } = require('./models');


exports.createOrganization = (payload) => {
    const organizationInfo = new Organization();
    organizationInfo.name = payload.name;
    organizationInfo.contact_email = payload.contact_email;
    organizationInfo.address = payload.address;
    organizationInfo.contact = payload.contact;
    organizationInfo.logo = payload.logo;
    
    return organizationInfo.save().then(data => {
        return {
            errorFlag: false,
            data
        };
    }).catch(error => {
        return {
            errorFlag: true,
            errorMessage: error.message
        };
    });
};