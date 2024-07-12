"use client";

import { useCurrentUser } from "@/hooks/use-current-user";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { getAddress } from "@/actions/profile-verification";
import { useEffect, useState } from "react";

export const Address = () => {
  const user = useCurrentUser();
  const [address, setAddress] = useState<string | null>(null);

  const getListings = async () => {
    const address = await getAddress(user?.id as string);
    if (!address) return;
    setAddress(address[0]!.address);
  };

  useEffect(() => {
    getListings();
  }, [user]);
  return (
    <>
      <Card
        x-chunk="dashboard-04-chunk-0"
        className="border border-gray-800 bg-gradient-to-b from-gray-950 to-black shadow-md md:w-[700px]"
      >
        <CardHeader>
          <CardTitle className="text-white/70">Address</CardTitle>
          <CardDescription className="text-white/70">
            You can update your address after a 6-month period from the last
            update.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <h1 className="rounded-md border border-gray-800 p-4 text-white/70">
            {address || "Address not found"}
          </h1>
        </CardContent>
      </Card>
    </>
  );
};
