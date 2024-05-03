const HTTP_RESPONSE = require("../../errors/generic-codes.js");
const createOrgValidatorUtilObj = require("../../utils/validators/joi_create_organization_validator.js");
const organizationHelperObj = require("./helpers");

exports.createOrganization = async (request, response) => {
    try {
        const [payload] = [request.body];

        const validation =
            createOrgValidatorUtilObj.createOrganizationValidation(payload);
        if (validation.error) {
            return response.status(HTTP_ERRORS.BAD_REQUEST.statusCode).send({
                ref: HTTP_ERRORS.BAD_REQUEST.ref,
                message: HTTP_ERRORS.BAD_REQUEST.message,
                error: validation.error.details,
            });
        } else {
            if (validation.value) {
                const createOrgResp = await organizationHelperObj.createOrganization(
                    payload
                );
                if (createOrgResp.errorFlag) {
                    return response.status(HTTP_RESPONSE.BAD_REQUEST.statusCode).send({
                        ref: HTTP_RESPONSE.BAD_REQUEST.ref,
                        error: HTTP_RESPONSE.BAD_REQUEST.error,
                        message: createOrgResp.errorMessage,
                    });
                }
                return response.status(201).send({
                    ref: "SUCCESS",
                    data: {
                        organization: {
                            id: createOrgResp.organizationInfo.organization_id,
                        },
                    },
                });
            } else {
                return response.status(HTTP_RESPONSE.BAD_REQUEST.statusCode).send({
                    ref: HTTP_RESPONSE.BAD_REQUEST.ref,
                    error: HTTP_RESPONSE.BAD_REQUEST.error,
                    message: "Validation did not return a valid value.",
                });
            }
        }
    } catch (error) {
        return response
            .status(HTTP_RESPONSE.INTERNAL_SERVER_ERROR.statusCode)
            .send({
                ref: HTTP_RESPONSE.INTERNAL_SERVER_ERROR.ref,
                error: HTTP_RESPONSE.INTERNAL_SERVER_ERROR.error,
                message: error.message,
            });
    }
};
