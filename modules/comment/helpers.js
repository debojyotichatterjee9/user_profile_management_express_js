const { Comment } = require("./models");
const {
  DEFAULT_PAGE,
  DEFAULT_LIMIT,
} = require("../../constants/api-generic-constants");

exports.createComment = async (payload) => {
  try {
    const commentInfo = new Comment();
    commentInfo.comment = payload.comment;
    commentInfo.attachments = payload.attachments;
    commentInfo.organization_id = payload.organization_id;
    commentInfo.project_id = payload.project_id;
    commentInfo.commented_by = payload.commented_by;
    commentInfo.commented_at = payload.commented_at;
    commentInfo.meta_data = payload.meta_data;
    await commentInfo.save(payload);
    return {
      errorFlag: false,
      commentInfo,
    };
  } catch (error) {
    // throw new Error(error.message)
    return {
      errorFlag: true,
      message: error.message,
    };
  }
};

exports.getCommentList = async (queryParams) => {
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
            comments_count: { $sum: 1 },
            comments: { $addToSet: "$$ROOT" },
          },
        },
        { $set: { group: `$_id` } },
        { $unset: "_id" }
      );
    }
    const commentList = await Comment.aggregate(aggregationPipline);
    const countFilteredDocs = await Comment.aggregate([
      { $match: filter },
      { $count: "count" },
    ]);
    const totalFilteredDocsCount = countFilteredDocs[0].count;
    const totalMilestoneRecords = await Comment.countDocuments();

    if (!commentList) {
      return {
        errorFlag: true,
        message: "Could not fetch organization list.",
      };
    }
    return {
      errorFlag: false,
      total_comments: totalMilestoneRecords,
      total_filtered_comments: totalFilteredDocsCount ?? limit,
      page,
      limit,
      comment_list: commentList,
    };
  } catch (error) {
    return {
      errorFlag: true,
      message: error.message,
    };
  }
};


exports.updateComment = async (commentId, payload) => {
  try {
    const commentInfo = await Comment.findByIdAndUpdate(commentId, payload, {
      new: true,
    });
    if (commentInfo) {
      return {
        errorFlag: false,
        commentInfo,
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

exports.deleteComment = async (commentId) => {
  try {
    const commentDeleteParams = {
      "meta_data.is_deleted": true,
      "meta_data.deleted_on": Date.now()
    };
    const commentInfo = await Comment.findByIdAndUpdate(
      commentId,
      commentDeleteParams,
      {
        new: true,
        },
    );
    if (commentInfo) {
      return {
        errorFlag: false,
        commentInfo,
      };
    } else {
      return {
        errorFlag: true,
        message: "Comment deleteion failed.",
      };
    }
  } catch (error) {
    return {
      errorFlag: true,
      message: error.message,
    };
  }
};