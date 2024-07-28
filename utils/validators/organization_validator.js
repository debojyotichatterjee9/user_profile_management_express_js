const { Organization } = require("../../modules/organization/models");

exports.checkValidOrganizationId = async (id) => {
  const organizationInfo = await Organization.findOne({ organization_id: id })
  return organizationInfo ? true : false;
};

exports.PayloadValidation = class PayloadValidation {
  payload
  messages = []

  constructor (payload) {
    this.payload = payload
  }

  async isValidPayload () {
    if (!this.payload.name) {
      this.messages.push({
        field: 'name',
        message: 'required field is missing'
      })
    }

    if (!this.payload.contact_email) {
      this.messages.push({
        field: 'contact_email',
        message: 'required field is missing'
      })
    }

    return {
      messages: this.messages,
      status: !(this.messages.length > 0)
    }
  }

  }
