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
    .set({
      verificationVideo,
      status: "Verified",
    })
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

export const addAddress = async (userId: string, address: string) => {
  return await db
    .update(profiles)
    .set({ address })
    .where(eq(profiles.userId, userId));
};

export const getAddress = async (userId: string) => {
  return await db
    .select({ address: profiles.address })
    .from(profiles)
    .where(eq(profiles.userId, userId));
};

export const getListings = async (userId: string) => {
  return await db
    .select({ listings: profiles.listings })
    .from(profiles)
    .where(eq(profiles.userId, userId))
    .limit(1);
};

export const getStatus = async (userId: string) => {
  return await db
    .select({ status: profiles.status })
    .from(profiles)
    .where(eq(profiles.userId, userId))
    .limit(1);
};
