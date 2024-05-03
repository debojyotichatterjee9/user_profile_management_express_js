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
      // TODO: need to add a check if the organization exists
      userInfo.organization_id = payload.organization_id;
    }
    userInfo.identification = payload.identification;
    userInfo.address = payload.address;
    userInfo.contact = payload.contact;
    userInfo.social_profiles = payload.social_profiles;
    userInfo.avatar = payload.avatar;
    userInfo.meta_data = payload.meta_data;
    (payload.authentication && payload.authentication.password &&
      payload.authentication.password.length > 0)
      ? userInfo.setPassword(payload.authentication.password)
      : userInfo.setPassword("Temporary@9999");
    await userInfo.save();
    return {
      errorFlag: false,
      userInfo,
    };
  } catch (error) {
    console.log(error.message)
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
      "-is_deleted",
    ]);
    if (!userInfo) {
      return false;
    }
    return userInfo;
  } catch (error) {
    return {
      errorFlag: true,
      message: error.message,
    };
  }
};

/**
 * UPDATE USER
 * @param {Object} payload
 * @returns
 */
exports.updateUser = async (userId, payload) => {
  try {
    const userInfo = await User.findByIdAndUpdate(userId, payload, {new: true});
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
  }
  catch (error) {
    return {
      errorFlag: true,
      message: error.message,
    };
  };
};
