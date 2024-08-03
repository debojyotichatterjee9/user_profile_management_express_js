const {Project} = require('./models')
exports.createProject = async (payload) => {
  try {
    const projectInfo = new Project();
    projectInfo.name = payload.name;
    projectInfo.project_code = payload.contact_email;
    projectInfo.description = payload.address;
    projectInfo.organization = payload.contact;
    await projectInfo.save();
    return {
      errorFlag: false,
      projectInfo,
    };
  } catch (error) {
    console.log('>> $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ <<');
    console.log(error)
    console.log('>> $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$ <<');
    return {
      errorFlag: true,
      message: error.message,
    };
  }
};