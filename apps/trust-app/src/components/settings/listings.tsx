import { useCurrentUser } from "@/hooks/use-current-user";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useEffect, useState } from "react";
import { getListings } from "@/actions/profile-verification";
import { z } from "zod";
import { truncateLink } from "@/lib/utils";

const ListingResponseSchema = z.array(
  z.object({
    listings: z.string(),
  }),
);

type ListingResponse = z.infer<typeof ListingResponseSchema>;

export const Listings = () => {
  const user = useCurrentUser();
  const [listings, setListings] = useState<string[]>([]);

  const getListingsAction = async () => {
    try {
      if (!user?.id) {
        console.error("User ID is undefined");
        return;
      }
      const response = await getListings(user.id);

      const listingsResponse = ListingResponseSchema.parse(response);

      if (listingsResponse[0]?.listings) {
        const parsedListings = JSON.parse(
          listingsResponse[0].listings,
        ) as string[];
        setListings(parsedListings || []);
      } else {
        console.error("Unexpected response format or empty listings");
        setListings([]);
      }
    } catch (error) {
      console.error("Failed to fetch or parse listings:", error);
      setListings([]);
    }
  };

  useEffect(() => {
    if (user) {
      getListingsAction();
    }
  }, [user]);

  return (
    <>
      <Card
        x-chunk="dashboard-04-chunk-0"
        className="border border-gray-800 bg-gradient-to-b from-gray-950 to-black shadow-md md:w-[700px]"
      >
        <CardHeader>
          <CardTitle className="text-white/70">Listings</CardTitle>
          <CardDescription className="text-white/70">
            You can update your listings after a 6-month period from the last
            update.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 ">
          {listings.length > 0 ? (
            listings.map((listing, index) => (
              <div key={index} className="col-span-1 mb-4">
                <a
                  href={listing}
                  target="_blank"
                  rel="noreferrer"
                  className=" text-white/70"
                >
                  <span className="block rounded-md border border-gray-800 p-4 md:hidden">
                    {truncateLink(listing, 30)}
                  </span>

                  <span className="hidden rounded-md border border-gray-800 p-4 md:block">
                    {listing}
                  </span>
                </a>
              </div>
            ))
          ) : (
            <p className="col-span-1 text-white/70">No listings found</p>
          )}
        </CardContent>
      </Card>
    </>
  );
};
