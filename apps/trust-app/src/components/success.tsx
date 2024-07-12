"use client";

import { Clipboard } from "lucide-react";
import { CardWrapper } from "./auth/card-wrapper";
import { Button } from "./ui/button";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

export const SuccessComp = () => {
  const [copy, setCopy] = useState(false);

  const onCopy = () => {
    navigator.clipboard.writeText("✪");
    toast.success("TrustMark copied to clipboard");
    setCopy(true);
  };
  return (
    <CardWrapper
      headerLabel="Congratulations!"
      backBtnLabel=""
      backButtonHref=""
    >
      <div className="items-center justify-center text-muted-foreground">
        <p className="text-center">
          Thank you for being a trustee and responsible online citizen!
        </p>
        <div className="mt-4 rounded-md border  border-gray-800 p-4">
          <div className="flex flex-col items-center justify-center">
            <p className="text-center">
              Add TrustMark to your social media bio/about
            </p>
            <span className=" mt-4 cursor-pointer rounded-lg border border-gray-800 p-1 text-4xl">
              ✪
            </span>
          </div>
          {copy ? (
            <Link href="/settings">
              <Button className="mt-4 w-full">Continue To Dashboard</Button>
            </Link>
          ) : (
            <Button className="mt-4 w-full" onClick={onCopy}>
              Copy To Clipboard <Clipboard className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </CardWrapper>
  );
};
