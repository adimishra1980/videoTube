import mongoose, { isValidObjectId } from "mongoose";
import { User } from "../models/user.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  // TODO: toggle subscription

  if (!channelId || !isValidObjectId(channelId)) {
    throw new ApiError(400, "Missing or Invalid channel ID");
  }

  const userID = req.user._id;

  const subscribed = await Subscription.findById({
    channel: channelId,
    subscriber: userID,
  });

  if (!subscribed) {
    //subscirbe the user to the channel

    const subscirbe = await Subscription.create({
      channel: channelId,
      subscriber: userID,
    });

    if (!subscirbe) {
      throw new ApiError(500, "Error while subscribing to the channel");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, subscirbe, "Channel Subscribed"));
  }

  //unsubscribe the channel
  const unsubscribe = await Subscription.deleteOne(subscribed._id);

  if (!unsubscribe) {
    throw new ApiError(500, "Error while unsubscribing from the channel");
  }

  return res.status(200).json(new ApiResponse(200, {}, "Channel Unsubscribed"));
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!channelId || !isValidObjectId(channelId)) {
    throw new ApiError(400, "Missing or Invalid channel ID");
  }

  const userID = req.user._id;

  const subscribersList = await Subscription.aggregate([
    {
      $match: {
        channel: mongoose.Types.ObjectId(channelId),
      },
    },
    {
      $group: {
        _id: "$channel",
        subscribersCount: {
          $sum: 1,
        },
      },
    },
    {
      $project: {
        subscribersCount: 1,
        channel: 1,
      },
    },
  ]);

  const subscriberCount = subscribersList.length > 0 ? subscribersList[0] : 0;

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { subscriberCount },
        "Subscribers fetched successfully"
      )
    );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;

  if (!channelId || !isValidObjectId(channelId)) {
    throw new ApiError(400, "Missing or Invalid channel ID");
  }

  const userID = req.user._id;

  const totalCount = await Subscription.countDocuments({
    subscriber: mongoose.Types.ObjectId(subscriberId),
  });

  const subscribedChannels = await Subscription.aggregate([
    {
      $match: {
        subscriber: mongoose.Types.ObjectId(subscriberId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "channel",
        foreignField: "_id",
        as: "channelDetails",
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
        channelDetails: {
          $first: "$channelDetails",
        },
      },
    },
    {
      $project: {
        channelDetails: 1,
      },
    },
  ]);

  if (!subscribedChannels?.length) {
    throw new ApiError(404, "No subscribers yet");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { totalCount, channels: channelDetails },
        "Subscribed channels fetched successfully"
      )
    );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
