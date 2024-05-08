const HTTP_RESPONSE = require("../../constants/http-generic-codes.js");
const createOrgValidatorUtilObj = require("../../utils/validators/joi_create_organization_validator.js");
const organizationHelperObj = require("./helpers");

exports.createOrganization = async (request, response) => {
    try {
        const [payload] = [request.body];

        const validation =
            createOrgValidatorUtilObj.createOrganizationValidation(payload);
        console.log(payload)
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
                        message: createOrgResp.mesage,
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

exports.getOrganizationList = async (request, response) => {
    try {
        const queryParams = request.query;
        const organizationListResp = await organizationHelperObj.getOrganizationList(queryParams);
        if (organizationListResp.errorFlag) {
            return response.status(HTTP_RESPONSE.BAD_REQUEST.statusCode).send({
                ref: HTTP_RESPONSE.BAD_REQUEST.ref,
                error: HTTP_RESPONSE.BAD_REQUEST.error,
                message: HTTP_RESPONSE.BAD_REQUEST.message,
                info: organizationListResp?.message ?? 'Unable to fetch organization list.'
            });
        }
        return response.status(200).send({
            type: "SUCCESS",
            data: {
                total_organizations: organizationListResp.total_organizations,
                total_filtered_users: organizationListResp.total_filtered_organizations,
                page: organizationListResp.page,
                limit: organizationListResp.limit,
                user_list: organizationListResp.organization_list
            }
        });
    } catch (error) {
        return response
            .status(HTTP_RESPONSE.INTERNAL_SERVER_ERROR.statusCode)
            .send({
                ref: HTTP_RESPONSE.INTERNAL_SERVER_ERROR.ref,
                error: HTTP_RESPONSE.INTERNAL_SERVER_ERROR.error,
                message: HTTP_RESPONSE.INTERNAL_SERVER_ERROR.message,
                info: error.message
            });
    }
}
