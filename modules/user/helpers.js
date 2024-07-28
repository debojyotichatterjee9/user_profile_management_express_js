const {
  DEFAULT_LIMIT,
  DEFAULT_PAGE,
} = require("../../constants/api-generic-constants");
const { User } = require("./models");

/**
 * SAVE USER
 * @param {Object} payload
 * @returns
 */
exports.saveUser = async (payload) => {
  try {
    const userInfo = new User();
    userInfo.name = payload.name;
    userInfo.email = payload.email;
    userInfo.username = payload.username;
    if (payload.organization_id) {
      userInfo.organization_id = payload.organization_id;
    }
    userInfo.identification = payload.identification;
    userInfo.address = payload.address;
    userInfo.contact = payload.contact;
    userInfo.social_profiles = payload.social_profiles;
    userInfo.avatar = payload.avatar;
    userInfo.meta_data = payload.meta_data;
    payload.authentication &&
    payload.authentication.password &&
    payload.authentication.password.length > 0
      ? userInfo.setPassword(payload.authentication.password)
      : userInfo.setPassword("Temporary@9999");
    await userInfo.save();
    return {
      errorFlag: false,
      userInfo,
    };
  } catch (error) {
    console.log(error.message);
    return {
      errorFlag: true,
      message: error.message,
    };
  }
};

exports.getUserList = async (queryParams) => {
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
      { $project: { authentication: 0 } },
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: limit,
      },
    ];

    if (name) {
      filter = {
        $or: [
          { "name.first_name": { $regex: name, $options: "i" } },
          { "name.middle_name": { $regex: name, $options: "i" } },
          { "name.last_name": { $regex: name, $options: "i" } },
        ],
      };
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
            user_count: { $sum: 1 },
            users: { $addToSet: "$$ROOT" },
          },
        },
        { $set: { group: `$_id` } },
        { $unset: "_id" }
      );
    }
    const userList = await User.aggregate(aggregationPipline);
    const countFilteredDocs = await User.aggregate([
      { $match: filter },
      { $count: "count" },
    ]);
    const totalFilteredDocsCount = countFilteredDocs[0].count;
    const totalUserRecords = await User.countDocuments();

    if (!userList) {
      return {
        errorFlag: true,
        message: "Could not fetch user list.",
      };
    }
    return {
      errorFlag: false,
      total_users: totalUserRecords,
      total_filtered_users: totalFilteredDocsCount ?? limit,
      page,
      limit,
      user_list: userList,
    };
  } catch (error) {
    return {
      errorFlag: true,
      message: error.message,
    };
  }
};

exports.getUserInfoById = async (userId) => {
  try {
    const userInfo = await User.findById(userId).select([
      "-salt_key",
      "-secret_hash",
      "-__v",
    ]);
    return userInfo ?? false;
  } catch (error) {
    return {
      errorFlag: true,
      message: error.message,
    };
  }
};

exports.updateUser = async (userId, payload) => {
  try {
    const userInfo = await User.findByIdAndUpdate(userId, payload, {
      new: true,
      fields: { "authentication.secret_hash": 0, "authentication.salt_key": 0 },
    });
    if (userInfo) {
      return {
        errorFlag: false,
        userInfo,
      };
    } else {
      return {
        errorFlag: true,
        message: "User update failed.",
      };
    }
  } catch (error) {
    return {
      errorFlag: true,
      message: error.message,
    };
  }
};

exports.deleteUser = async (userId) => {
  try {
    const userDeleteParams = {
      "meta_data.is_enabled": false,
      "meta_data.is_activated": false,
      "meta_data.is_deleted": true,
    };
    const userInfo = await User.findByIdAndUpdate(
      userId,
      userDeleteParams,
      {
        new: true,
        fields: {
          "authentication.secret_hash": 0,
          "authentication.salt_key": 0,
        },
      },
    );
    if (userInfo) {
      return {
        errorFlag: false,
        userInfo,
      };
    } else {
      return {
        errorFlag: true,
        message: "User deleteion failed.",
      };
    }
  } catch (error) {
    return {
      errorFlag: true,
      message: error.message,
    };
  }
};
