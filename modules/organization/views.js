const HTTP_ERRORS = require('../../errors/generic-codes.js');
const createOrgValidatorUtilObj = require('../../utils/validators/joi_create_organization_validator.js')

exports.createOrganization = async (request, response) => {
    const [payload] = [request.body];

    const validation = createOrgValidatorUtilObj.createOrganizationValidation(payload);
    if (validation.error) {
        return response.status(HTTP_ERRORS.BAD_REQUEST.statusCode).send({
            ref: HTTP_ERRORS.BAD_REQUEST.ref,
            message: HTTP_ERRORS.BAD_REQUEST.message,
            error: validation.error.details
        });
    } else {
        if (validation.value) {
            const organizationInfo = await userHelperObj.createOrganization(payload);
            if (organizationInfo.errorFlag) {
                return response.status(400).send({
                    ref: 'ORGANIZATION_CREATION_ERROR',
                    message: userInfo.errorMessage
                });
            }
            return response.status(201).send({
                ref: 'SUCCESS',
                data: {
                    user: {
                        id: organizationInfo.data.id
                    }
                }
            });
        } else {
            return response.status(400).send({
                type: 'error',
                message: 'Validation did not return a valid value.'
            });
        }
    }
};