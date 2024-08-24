const { Project } = require("./models");
const {
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
} = require("../../constants/api-generic-constants");

exports.createProject = async (payload) => {
  try {
    const projectInfo = new Project();
    projectInfo.name = payload.name;
    projectInfo.project_code = payload.project_code;
    projectInfo.description = payload.description;
    projectInfo.organization_id = payload.organization_id;
    projectInfo.start_date = payload.start_date;
    projectInfo.end_date = payload.end_date;
    projectInfo.created_by = payload.created_by;
    projectInfo.status = payload.status;
    projectInfo.budget = payload.budget;
    projectInfo.actual_cost = payload.actual_cost;
    projectInfo.tags = payload.tags;
    projectInfo.priority = payload.priority;
    projectInfo.milestones = payload.milestones;
    projectInfo.files = payload.files;
    projectInfo.meta_data = payload.meta_data;
    await projectInfo.save(payload);
    return {
      errorFlag: false,
      projectInfo,
    };
  } catch (error) {
    // throw new Error(error.message)
    return {
      errorFlag: true,
      message: error.message,
    };
  }
};

exports.getProjectList = async (queryParams) => {
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
    const projectList = await Project.aggregate(aggregationPipline);
    const countFilteredDocs = await Project.aggregate([
      { $match: filter },
      { $count: "count" },
    ]);
    const totalFilteredDocsCount = countFilteredDocs[0].count;
    const totalProjectRecords = await Project.countDocuments();

    if (!projectList) {
      return {
        errorFlag: true,
        message: "Could not fetch organization list.",
      };
    }
    return {
      errorFlag: false,
      total_projects: totalProjectRecords,
      total_filtered_projects: totalFilteredDocsCount ?? limit,
      page,
      limit,
      project_list: projectList,
    };
  } catch (error) {
    return {
      errorFlag: true,
      message: error.message,
    };
  }
};

exports.getProjectInfoById = async (projectId) => {
  try {
    const projectInfo = await Project.findOne({
      $or: [{ _id: projectId }, { project_code: projectId }],
    }).select(["-salt_key", "-secret_hash", "-__v", "-is_deleted"]);
    return projectInfo ?? false;
  } catch (error) {
    return {
      errorFlag: true,
      message: error.message,
    };
  }
};

exports.updateProject = async (projectId, payload) => {
  try {
    const projectInfo = await Project.findByIdAndUpdate(projectId, payload, {
      new: true,
    });
    if (projectInfo) {
      return {
        errorFlag: false,
        projectInfo,
      };
    } else {
      return {
        errorFlag: true,
        message: "Project update failed.",
      };
    }
  } catch (error) {
    return {
      errorFlag: true,
      message: error.message,
    };
  }
};

exports.deleteProject = async (organizationId) => {
  try {
    const projectDeleteParams = {
      "meta_data.is_enabled": false,
      "meta_data.is_deleted": true,
    };
    const projectInfo = await Project.findByIdAndUpdate(
      organizationId,
      projectDeleteParams,
      {
        new: true,
        },
    );
    if (projectInfo) {
      return {
        errorFlag: false,
        projectInfo,
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