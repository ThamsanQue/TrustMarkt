import { useCurrentUser } from "@/hooks/use-current-user";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { getStatus } from "@/actions/profile-verification";
import { useEffect, useState } from "react";
import { z } from "zod";

const StatusResponseSchema = z.array(
  z.object({
    status: z.string(),
  }),
);

export const Status = () => {
  const user = useCurrentUser();

  const [status, setStatus] = useState<string | null>(null);

  const getStatusAction = async () => {
    try {
      if (!user?.id) {
        console.error("User ID is undefined");
        return;
      }
      const response = await getStatus(user.id);

      const statusResponse = StatusResponseSchema.parse(response);

      if (statusResponse[0]?.status) {
        setStatus(statusResponse[0].status);
      } else {
        console.error("Unexpected response format or empty status");
        setStatus(null);
      }
    } catch (error) {
      console.error("Failed to fetch or parse status:", error);
      setStatus(null);
    }
  };

  useEffect(() => {
    if (user) {
      getStatusAction();
    }
  }, [user]);

  return (
    <>
      <Card
        x-chunk="dashboard-04-chunk-0"
        className="border border-gray-800 bg-gradient-to-b from-gray-950 to-black shadow-md md:w-[700px]"
      >
        <CardHeader>
          <CardTitle className="text-white/70">Status</CardTitle>
          <CardDescription className="text-white/70">
            Your status can change based on feedback from the community.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status ? (
            <h1
              className={`rounded-md border border-gray-800 p-4 ${status === "Verified" ? "text-green-500" : "text-yellow-500"}`}
            >
              {status} {status === "Verified" ? "✪" : "⁇"}
            </h1>
          ) : (
            <h1 className="rounded-md border border-gray-800 p-4 text-white/70">
              Status not found
            </h1>
          )}
        </CardContent>
      </Card>
    </>
  );
};
