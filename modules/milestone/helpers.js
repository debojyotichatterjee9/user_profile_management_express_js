const { Milestone } = require("./models");
const {
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
} = require("../../constants/api-generic-constants");

exports.createMilestone = async (payload) => {
  try {
    const milestoneInfo = new Milestone();
    milestoneInfo.name = payload.name;
    milestoneInfo.project_code = payload.project_code;
    milestoneInfo.description = payload.description;
    milestoneInfo.organization_id = payload.organization_id;
    milestoneInfo.start_date = payload.start_date;
    milestoneInfo.end_date = payload.end_date;
    milestoneInfo.created_by = payload.created_by;
    milestoneInfo.status = payload.status;
    milestoneInfo.budget = payload.budget;
    milestoneInfo.actual_cost = payload.actual_cost;
    milestoneInfo.tags = payload.tags;
    milestoneInfo.priority = payload.priority;
    milestoneInfo.milestones = payload.milestones;
    milestoneInfo.files = payload.files;
    milestoneInfo.meta_data = payload.meta_data;
    await milestoneInfo.save(payload);
    return {
      errorFlag: false,
      milestoneInfo,
    };
  } catch (error) {
    // throw new Error(error.message)
    return {
      errorFlag: true,
      message: error.message,
    };
  }
};

exports.getMilestoneList = async (queryParams) => {
  try {
    const [page, limit, sortField, sortOrder, groupBy, title] = [
      queryParams.page ? parseInt(queryParams.page) : DEFAULT_PAGE,
      queryParams.limit ? parseInt(queryParams.limit) : DEFAULT_LIMIT,
      queryParams.sortBy,
      queryParams.sortOrder,
      queryParams.groupBy,
      queryParams.title,
    ];
    let filter = {};
    const aggregationPipline = [
      {
        $skip: (page - 1) * limit,
      },
      {
        $limit: limit,
      },
    ];

    if (title) {
      filter = { title: { $regex: title, $options: "i" } };
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
    const milestoneList = await Milestone.aggregate(aggregationPipline);
    const countFilteredDocs = await Milestone.aggregate([
      { $match: filter },
      { $count: "count" },
    ]);
    const totalFilteredDocsCount = countFilteredDocs[0].count;
    const totalMilestoneRecords = await Milestone.countDocuments();

    if (!milestoneList) {
      return {
        errorFlag: true,
        message: "Could not fetch organization list.",
      };
    }
    return {
      errorFlag: false,
      total_projects: totalMilestoneRecords,
      total_filtered_projects: totalFilteredDocsCount ?? limit,
      page,
      limit,
      project_list: milestoneList,
    };
  } catch (error) {
    return {
      errorFlag: true,
      message: error.message,
    };
  }
};

exports.getMilestoneInfoById = async (projectId) => {
  try {
    const milestoneInfo = await Milestone.findOne({
      $or: [{ _id: projectId }, { project_code: projectId }],
    }).select(["-salt_key", "-secret_hash", "-__v", "-is_deleted"]);
    return milestoneInfo ?? false;
  } catch (error) {
    return {
      errorFlag: true,
      message: error.message,
    };
  }
};

exports.updateMilestone = async (projectId, payload) => {
  try {
    const milestoneInfo = await Milestone.findByIdAndUpdate(projectId, payload, {
      new: true,
    });
    if (milestoneInfo) {
      return {
        errorFlag: false,
        milestoneInfo,
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

exports.deleteMilestone = async (milestoneId) => {
  try {
    const milestoneDeleteParams = {
      "meta_data.is_enabled": false,
      "meta_data.is_deleted": true,
    };
    const milestoneInfo = await Milestone.findByIdAndUpdate(
      milestoneId,
      milestoneDeleteParams,
      {
        new: true,
        },
    );
    if (milestoneInfo) {
      return {
        errorFlag: false,
        milestoneInfo,
      };
    } else {
      return {
        errorFlag: true,
        message: "Milestone deleteion failed.",
      };
    }
  } catch (error) {
    return {
      errorFlag: true,
      message: error.message,
    };
  }
};