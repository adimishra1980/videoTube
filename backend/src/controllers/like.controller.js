import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: toggle like on video

  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Missing or Invalid video id");
  }

  const userID = req.user?._id;

  const existingLike = await Like.findById({
    video: videoId,
    likedBy: userID,
  });

  let liked;
  if (existingLike) {
    // unlike the video
    const deletedVideoLike = await existingLike.deleteOne();

    if (!deletedVideoLike) {
      throw new ApiError(500, "Failed to unlike the video");
    }
    liked = false;
  } else {
    // like the video

    const likedVideoLike = await Like.create({
      video: videoId,
      likedBy: userID,
    });

    if (!likedVideoLike) {
      throw new ApiError(500, "Failed to like the video");
    }

    liked = true;
  }

  const totalLikes = await Like.countDocuments({ video: videoId });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { videoId, liked, totalLikes },
        liked ? "Video liked successfully" : "Video unliked successfully"
      )
    );
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  //TODO: toggle like on comment

  if (!commentId || isValidObjectId(commentId)) {
    throw new ApiError(400, "Missing or Invalid comment id");
  }

  const userID = req.user?._id;

  const existingLike = await Like.findOne({
    comment: commentId,
    likedBy: userID,
  });

  let liked;
  if (existingLike) {
    //unlike the comment if already liked

    const deletedCommentLike = await existingLike.deleteOne();

    if (!deletedCommentLike) {
      throw new ApiError(500, "Failed to unlike the comment");
    }
    liked = false;
  } else {
    // like the comment

    const likedCommentLike = await Like.create({
      comment: commentId,
      likedBy: userID,
    });

    if (!likedCommentLike) {
      throw new ApiError(500, "Failed to like the comment");
    }
    liked = true;
  }

  const totalLikes = await Like.countDocuments({ comment: commentId });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { commentId, liked, totalLikes },
        liked ? "Comment liked successfully" : "Comment unliked successfully"
      )
    );
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  //TODO: toggle like on tweet

  if (!tweetId || isValidObjectId(tweetId)) {
    throw new ApiError(400, "Missing or Invalid tweet id");
  }

  const userID = req.user?._id;

  const existingLike = await Like.findById({
    tweet: tweetId,
    likedBy: userID,
  });

  let liked;
  if (existingLike) {
    //unlike the tweet if already liked
    const deleteTweetLike = await existingLike.deleteOne();

    if (!deleteTweetLike) {
      throw new ApiError(500, "Failed to unlike the tweet");
    }
    liked = false;
  } else {
    //like the tweet
    const likedTweetLike = await Like.create({
      tweet: tweetId,
      likedBy: userID,
    });

    if (!likedTweetLike) {
      throw new ApiError(500, "Failed to like the tweet");
    }
    liked = true;
  }

  const totalLikes = await Like.countDocuments({ tweet: tweetId });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { tweetId, liked, totalLikes },
        liked ? "Tweet liked successfully" : "Tweet unliked successfully"
      )
    );
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos

  const userID = req.user?._id;

  const likedVideos = await Like.aggregate([
    {
      $match: {
        likedBy: userID,
        video: {
          $exists: true,
          $ne: null,
        },
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "video",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
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
          {
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
          {
            $project: {
              videoFile: 1,
              thumbnail: 1,
              title: 1,
              duration: 1,
              views: 1,
              owner: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: {
        path: "$video",
      },
    },
    {
      $project: {
        video: 1,
        likedBy: 1,
      },
    },
  ]);

  if (!likedVideos) {
    throw new ApiError(400, "Failed to fetch liked videos");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, likedVideos, "Successfully fetech liked videos")
    );
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
