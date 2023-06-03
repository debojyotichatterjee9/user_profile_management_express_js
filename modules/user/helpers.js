const uuid = require("uuid");
const { User } = require("./models");

/**
 * SAVE USER
 * @param {Object} payload 
 * @returns 
 */
exports.saveUser = (payload) => {
  let [userInfo, userSaveResp] = [new User(), {}];
  userInfo.name = payload.name;
  userInfo.email = payload.email;
  userInfo.username = payload.username;
  userInfo.identification = payload.identification;
  userInfo.address = payload.address;
  userInfo.contact = payload.contact;
  userInfo.social_profiles = payload.social_profiles;
  userInfo.avatar = payload.avatar;
  userInfo.meta_data = payload.meta_data;
  /* userInfo.authentication.user_id = uuid.v4(); */
  try {
    payload.authentication.password && payload.authentication.password.length > 0 ? userInfo.setPassword(payload.authentication.password) : userInfo.setPassword("Temporary@9999");

  } catch (error) {
    console.log(`ERROR --> ${error.message}`);
    return {
      errorFlag: true,
      errorMessage: "User creation failed! The user password could not be saved."
    };
  }

  return userInfo.save().then(data => {
    return {
      errorFlag: false,
      data: data
    };
  }).catch(error => {
    return {
      errorFlag: true,
      errorMessage: error.message
    };
  });
}



exports.getUserInfoById = async (userId) => {
  try {
    let userInfo = await User.findById(userId).select([
      "-salt_key",
      "-secret_hash",
      "-__v",
      "-is_deleted"
    ]);
    if (!userInfo) {
      return false;
    }
    return userInfo;
  } catch (err) {
    return false;
  }
};


/**
 * UPDATE USER
 * @param {Object} payload 
 * @returns 
 */
exports.updateUser = async (userId, payload) => {

  let userInfo = await User.findById(userId);
  if (userInfo) {
    userInfo.first_name = payload.first_name;
    userInfo.last_name = payload.last_name;
    userInfo.email = payload.email;
    userInfo.username = payload.username;
    userInfo.address = payload.address;
    userInfo.contact = payload.contact;
    userInfo.social_profiles = payload.social_profiles;
    userInfo.theme_code = payload.theme_code;
    userInfo.is_admin = payload.is_admin;
    userInfo.avatar = payload.avatar;
  }
  else {
    return {
      type: "failed",
      message: "User not found."
    }
  }
  userInfo.save();
  return userInfo;
}
