const {
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
} = require("../../constants/api-generic-constants");
const { Organization } = require("./models");
const loggernaut = require("loggernaut");

/* The `exports.createOrganization` function is an asynchronous function that takes a `payload` as a
parameter. Inside the function: */
exports.createOrganization = async (payload) => {
  try {
    const organizationInfo = new Organization(payload);
    
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

/* The `exports.findOraganizationByOrganizationId` function is an asynchronous function that takes an
`organization_id` as a parameter. Inside the function, it attempts to find an organization in the
database based on the provided `organization_id` using the `Organization.findOne` method. If an
organization is found, it returns the organization information. If no organization is found, it
returns `false`. */
exports.findOraganizationByOrganizationId = async (organization_id) => {
  try {
    const organizationInfo = await Organization.findOne({ organization_id });
    return organizationInfo ?? false;
  } catch (error) {
    console.log(`ERROR --> ${error.message}`);
  }
};

exports.getOrganizationInfoById = async (organizationId) => {
  try {
    const organizationInfo = await Organization.findOne({
      $or: [{ _id: organizationId }, { organization_id: organizationId }],
    }).select(["-__v"]);
    return organizationInfo ?? false;
  } catch (error) {
    return {
      errorFlag: true,
      message: error.message,
    };
  }
};

exports.getOrganizationList = async (queryParams) => {
  try {
    const [page, limit, sortField, sortOrder, groupBy, name] = [
      queryParams.page ? parseInt(queryParams.page) : DEFAULT_PAGE,
      queryParams.limit ? parseInt(queryParams.limit) : DEFAULT_LIMIT,
      queryParams.sortBy,
      queryParams.sortOrder,
      queryParams.groupBy,
      queryParams.name,
    ];
    let filter = {};
    const aggregationPipline = [
      // { '$project': { 'authentication': 0 } },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: limit,
      },
    ];

    const finalProjectionQuery = {
      $project: {
        "organizations.__v": false,
        "organizations.meta_data": false,
      },
    };

    if (name) {
      filter = { name: { $regex: name, $options: "i" } };
      aggregationPipline.unshift({ $match: filter });
    }

    if (sortField) {
      aggregationPipline.push({
        $sort: { [sortField]: sortOrder },
      });
    }
    if (groupBy) {
      aggregationPipline.push(
        {
          $group: {
            _id: `$${groupBy}`,
            organizations_count: { $sum: 1 },
            organizations: { $addToSet: "$$ROOT" },
          },
        },
        { $set: { group: `$_id` } },
        { $unset: "_id" }
      );
    }

    aggregationPipline.push(finalProjectionQuery);
    const organizationList = await Organization.aggregate(aggregationPipline);
    const countFilteredDocs = await Organization.aggregate([
      { $match: filter },
      { $count: "count" },
    ]);
    const totalFilteredDocsCount = countFilteredDocs[0]?.count || 0;
    const totalOrganizationRecords = await Organization.countDocuments();

    if (!organizationList) {
      return {
        errorFlag: true,
        message: "Could not fetch organization list.",
      };
    }
    return {
      errorFlag: false,
      total_users: totalOrganizationRecords,
      total_filtered_organizations: totalFilteredDocsCount ?? limit,
      page,
      limit,
      organization_list: organizationList,
    };
  } catch (error) {
    return {
      errorFlag: true,
      message: error.message,
    };
  }
};

exports.updateOrganization = async (organizationId, payload) => {
  try {
    const organizationInfo = await Organization.findByIdAndUpdate(
      organizationId,
      payload,
      {
        new: true,
      }
    );
    if (organizationInfo) {
      return {
        errorFlag: false,
        organizationInfo,
      };
    } else {
      throw new Error(
        "Organization update failed. Please check the organization ID."
      );
    }
  } catch (error) {
    loggernaut.error(error.message);
    return {
      errorFlag: true,
      message: error.message,
    };
  }
};

exports.deleteOrganization = async (organizationId) => {
  try {
    const organizationDeleteParams = {
      "meta_data.is_deleted": true,
      "meta_data.deleted_on": new Date(),
    };
    const organizationInfo = await Organization.findByIdAndUpdate(
      organizationId,
      organizationDeleteParams,
      {
        new: true,
      }
    );
    if (organizationInfo) {
      return {
        errorFlag: false,
        organizationInfo,
      };
    } else {
      return {
        errorFlag: true,
        message: "Organization deleteion failed.",
      };
    }
  } catch (error) {
    return {
      errorFlag: true,
      message: error.message,
    };
  }
};
