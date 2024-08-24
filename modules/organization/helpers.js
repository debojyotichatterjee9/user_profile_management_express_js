const {
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
} = require("../../constants/api-generic-constants");
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
      $or: [{ _id: organizationId }, { organization_id }],
    }).select(["-salt_key", "-secret_hash", "-__v", "-is_deleted"]);
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
    const organizationList = await Organization.aggregate(aggregationPipline);
    const countFilteredDocs = await Organization.aggregate([
      { $match: filter },
      { $count: "count" },
    ]);
    const totalFilteredDocsCount = countFilteredDocs[0].count;
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
    const organizationInfo = await Organization.findByIdAndUpdate(organizationId, payload, {
      new: true,
    });
    if (organizationInfo) {
      return {
        errorFlag: false,
        organizationInfo,
      };
    } else {
      return {
        errorFlag: true,
        message: "Organization update failed.",
      };
    }
  } catch (error) {
    return {
      errorFlag: true,
      message: error.message,
    };
  }
};

exports.deleteOrganization = async (organizationId) => {
    try {
      const organizationDeleteParams = {
        "meta_data.is_enabled": false,
        "meta_data.is_deleted": true,
      };
      const organizationInfo = await Organization.findByIdAndUpdate(
        organizationId,
        organizationDeleteParams,
        {
          new: true,
          },
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