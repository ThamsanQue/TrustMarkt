"use server";

import { db } from "@/server/db";
import { profiles } from "@/server/db/schema/profiles";
import { eq } from "drizzle-orm";

export const addFaceId = async (userId: string, faceId: string[]) => {
  // Convert arrays to JSON for storage
  const faceIdJson = JSON.stringify(faceId);

  return await db
    .insert(profiles)
    .values({
      userId,
      faceId: faceIdJson,
    })
    .returning({
      faceId: profiles.faceId,
    });
};

export const addVerificationVideo = async (
  userId: string,
  verificationVideo: string,
) => {
  return await db
    .update(profiles)
    .set({ verificationVideo })
    .where(eq(profiles.userId, userId));
};

export const addListings = async (userId: string, listings: string[]) => {
  // Convert arrays to JSON for storage
  const listingsJson = JSON.stringify(listings);
  return await db
    .update(profiles)
    .set({ listings: listingsJson })
    .where(eq(profiles.userId, userId));
};
