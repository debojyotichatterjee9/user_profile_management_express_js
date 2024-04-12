const { Organization } = require('./models');


exports.createOrganization = (payload) => {
    const organizationInfo = new Organization();
    organizationInfo.name = payload.name;
    
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