"use client";

import { logout } from "@/actions/logout";
import { Address } from "@/components/settings/address";
import { Listings } from "@/components/settings/listings";
import { Profile } from "@/components/settings/profile";
import { Status } from "@/components/settings/status";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Settings = () => {
  const onClick = () => {
    logout();
  };
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <main className="mx-auto flex max-w-[90%] flex-col gap-6 px-4 md:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-center">
          <div className="w-full sm:w-auto">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="mb-4 flex w-full justify-center border border-gray-800 bg-gradient-to-b from-gray-950 to-black shadow-md">
                <TabsTrigger value="profile" className="w-full sm:w-auto">
                  Profile
                </TabsTrigger>
                <TabsTrigger value="address" className="w-full sm:w-auto">
                  Address
                </TabsTrigger>
                <TabsTrigger value="listings" className="w-full sm:w-auto">
                  Listings
                </TabsTrigger>
                <TabsTrigger value="status" className="w-full sm:w-auto">
                  Status
                </TabsTrigger>
              </TabsList>
              <TabsContent value="profile">
                <Profile />
              </TabsContent>
              <TabsContent value="address">
                <Address />
              </TabsContent>
              <TabsContent value="listings">
                <Listings />
              </TabsContent>
              <TabsContent value="status">
                <Status />
              </TabsContent>
            </Tabs>
          </div>
        </div>
        <Button className="mb-4 w-full sm:w-auto" onClick={onClick}>
          Logout
        </Button>
      </main>
    </div>
  );
};
export default Settings;
