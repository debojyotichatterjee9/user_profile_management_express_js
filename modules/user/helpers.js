const { User } = require('./models');

/**
 * SAVE USER
 * @param {Object} payload
 * @returns
 */
exports.saveUser = (payload) => {
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
  try {
    payload.authentication.password && payload.authentication.password.length > 0 ? userInfo.setPassword(payload.authentication.password) : userInfo.setPassword('Temporary@9999');
  } catch (error) {
    console.log(`ERROR --> ${error.message}`);
    return {
      errorFlag: true,
      errorMessage: 'User creation failed! The user password could not be saved.'
    };
  }

  return userInfo.save().then(data => {
    return {
      errorFlag: false,
      data
    };
  }).catch(error => {
    return {
      errorFlag: true,
      errorMessage: error.message
    };
  });
};

exports.getUserInfoById = async (userId) => {
  try {
    const userInfo = await User.findById(userId).select([
      '-salt_key',
      '-secret_hash',
      '-__v',
      '-is_deleted'
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
  const userInfo = await User.findById(userId);
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
  } else {
    return {
      type: 'failed',
      message: 'User not found.'
    };
  }
  userInfo.save();
  return userInfo;
};
