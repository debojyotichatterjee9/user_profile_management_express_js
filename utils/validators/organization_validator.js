const { Organization } = require("../../modules/organization/models");

exports.checkValidOrganizationId = async (id) => {
  const organizationInfo = await Organization.findOne({ organization_id: id })
  return organizationInfo ? true : false;
};
