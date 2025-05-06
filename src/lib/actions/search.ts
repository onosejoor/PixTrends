"use server";

import { User } from "../models";

export async function search(query: string) {
  try {
    const getPeople = await User.aggregate([
      { $sample: { size: 5 } },
      {
        $match: {
          $or: [
            { username: { $regex: query, $options: "i" } },
            { name: { $regex: query, $options: "i" } },
          ],
        },
      },

      {
        $addFields: {
          followersCount: { $size: "$followers" },
        },
      },
      { $sort: { followersCount: -1 } },
      { $limit: 5 },
      {
        $project: {
          _id: 1,
          username: 1,
          name: 1,
          avatar: 1,
        },
      },
    ]);

    return { success: true, people: JSON.stringify(getPeople) };
  } catch (error) {
    console.log("[SEARCH_ACTION_ERROR]: ", error);
    return { success: false, message: "Something went wrong!" };
  }
}
