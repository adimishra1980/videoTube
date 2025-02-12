import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;
  const { page = 1, limit = 10 } = req.query;

  if (!videoId || isValidObjectId(videoId)) {
    return new ApiError(400, "Missing or Invalid video ID");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(400, "No such video found");
  }

  const comments = await Comment.aggregate([
    // match the comments of the video
    {
      $match: {
        video: mongoose.Types.ObjectId(videoId),
      },
    },
    // populate the user details to it
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "createdBy",
        pipeline: [
          {
            $project: {
              username: 1,
              fullname: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    // convert the createdBy array to object
    {
      $addFields: {
        createdBy: {
          $first: "$createdBy",
        },
      },
    },
    {
      $unwind: "$createdBy",
    },
    // project the final output
    {
      $project: {
        content: 1,
        createdBy: 1,
      },
    },
    //pagination
    {
      $skip: (page - 1) * limit,
    },
    {
      $limit: parseInt(limit),
    },
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, comments, "Comments fetched"));
});

const addComment = asyncHandler(async (req, res) => {
  // TODO: add a comment to a video

  const { videoId } = req.params;
  const { content } = req.body;

  const userID = req.user.id;

  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Missing or Invalid video ID");
  }

  if (!content) {
    throw new ApiError(400, "Please write something for comment");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(400, "Video does not found");
  }

  const comment = await Comment.create({
    content,
    video: videoId,
    owner: userID,
  });

  if (!comment) {
    throw new ApiError(400, "Failed to creating a comment");
  }

  return res.status(200).json(new ApiResponse(200, comment, "Comment added"));
});

const updateComment = asyncHandler(async (req, res) => {
  // TODO: update a comment

  const { commentId } = req.params;

  if (!commentId || !isValidObjectId(commentId)) {
    throw new ApiError(400, "Missing or Invalid comment Id");
  }

  const { content } = req.body;

  if (!content) {
    throw new ApiError(400, "Provide a content for comment");
  }

  const userID = req.user._id;

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(400, "Comment not found");
  }

  if (!comment.owner.equals(userID)) {
    throw new ApiError(403, "You are not allowed to update this comment");
  }

  const updatedComment = await Comment.findByIdAndUpdate(
    commentId,
    {
      $set: {
        content,
      },
    },
    { new: true }
  );

  if (!updatedComment) {
    throw new ApiError(400, "Failed to update the comment");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, updatedComment, "Comment updated"));
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment

  const { commentId } = req.params;

  if (!commentId || !isValidObjectId(commentId)) {
    throw new ApiError(400, "Missing or Invalid comment Id");
  }

  const userID = req.user._id;

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(400, "Comment not found");
  }

  if (!comment.owner.equals(userID)) {
    throw new ApiError(403, "You are not allowed to delete this comment");
  }

  const deletedComment = await Comment.findByIdAndDelete(commentId);

  if (!deletedComment) {
    throw new ApiError(400, "Failed to delete the comment");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, deleteComment, "Comment deleted"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
