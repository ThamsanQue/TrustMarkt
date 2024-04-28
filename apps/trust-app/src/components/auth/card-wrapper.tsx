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
    <Card className="w-[400px] shadow-md">
      <CardHeader>
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
