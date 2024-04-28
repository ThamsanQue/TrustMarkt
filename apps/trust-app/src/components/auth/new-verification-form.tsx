"use client";

import { CardWrapper } from "./card-wrapper";
import { BeatLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { newVerfication } from "@/actions/new-verification";
import { FormSuccess } from "@/components/form-success";
import { FormError } from "@/components/form-error";

export const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    if (success || error) return;
    if (!token) {
      setError("Missing token");
      return;
    }
    newVerfication(token)
      .then((data) => {
        setSuccess(data.success);
        setError(data.error);
      })
      .catch(() => {
        setError("Something went wrong");
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
      <div className="flex items-center w-full  justify-center">
        {!success && !error && <BeatLoader size={10} color="#000000" />}
        <FormSuccess message={success} />
        {!success && <FormError message={error} />}
      </div>
    </CardWrapper>
  );
};
