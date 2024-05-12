"use client";

import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import { BackBtn } from "./back-btn";
import { Header } from "./header";
import { Social } from "./social";

interface CardWrapperProps {
  children: React.ReactNode;
  headerLabel: string;
  backBtnLabel: string;
  backButtonHref: string;
  showSocial?: boolean;
}

export const CardWrapper = ({
  children,
  headerLabel,
  backBtnLabel,
  backButtonHref,
  showSocial,
}: CardWrapperProps) => {
  return (
    <Card className=" relative w-[400px] border border-gray-800 bg-gradient-to-b from-gray-950 to-black shadow-md">
      <div className="absolute left-1/2 top-0 flex w-full -translate-x-1/2 transform justify-center">
        <div className="animate-border-width h-[1px] rounded-full bg-gradient-to-r from-[rgba(17,17,17,0)] via-white to-[rgba(17,17,17,0)] transition-all duration-1000" />
      </div>
      <CardHeader className="text-white/70">
        <Header label={headerLabel} />
      </CardHeader>
      <CardContent>{children}</CardContent>
      {showSocial && (
        <CardFooter>
          <Social />
        </CardFooter>
      )}
      <CardFooter>
        <BackBtn label={backBtnLabel} href={backButtonHref} />
      </CardFooter>
    </Card>
  );
};
