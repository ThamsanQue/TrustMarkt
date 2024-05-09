"use client";

import { CardWrapper } from "./card-wrapper";
import { BeatLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { newVerfication } from "@/actions/new-verification";
import { toast } from "sonner";

export const NewVerificationForm = () => {
  const [error, setError] = useState<boolean | undefined>();
  const [success, setSuccess] = useState<boolean | undefined>();

  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    if (success || error) return;
    if (!token) {
      setError(true);
      toast.error("Missing token");
      return;
    }
    newVerfication(token)
      .then((data) => {
        setSuccess(data.success && data.success.length > 0 ? true : false);
        setError(data.error && data.error.length > 0 ? true : false);
        toast.success(data.success);
        toast.error(data.error);
      })
      .catch((err) => {
        setError(true);
        toast.error("Something went wrong", err);
      });
  }, [token, success, error]);
  useEffect(() => {
    onSubmit();
  }, [onSubmit]);
  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backBtnLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <div className="flex w-full items-center  justify-center">
        {!success && !error && <BeatLoader size={10} color="#000000" />}
      </div>
    </CardWrapper>
  );
};
