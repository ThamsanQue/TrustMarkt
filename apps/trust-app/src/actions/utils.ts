"use server";

import { getUserById } from "@/data/user";

export const getUserByIdAction = async (id: string) => {
  const dbUser = await getUserById(id);
  return dbUser;
};
