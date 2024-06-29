"use client";

import { Step, Stepper, useStepper } from "@/components/ui/stepper";
import { Button } from "@/components/ui/button";
import { ScanFace, Home, Tags, Video, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { FacialRegistration } from "./facial-registration";
import { AddressVerification } from "./address-verification";
import { ListingsRegistration } from "./listings-registration";
import { VideoVerification } from "./video-verification";

const steps = [
  { label: "Facial Registration", icon: ScanFace },
  { label: "Address", icon: Home },
  { label: "Listings", icon: Tags },
  { label: "Video Verification", icon: Video },
];

export default function VerificationStepper() {
  return (
    <div className="flex w-full flex-col gap-4">
      <Stepper
        variant="circle-alt"
        initialStep={0}
        steps={steps}
        styles={{
          "step-button-container": cn(
            "text-accent",
            "data-[current=true]:border-accent data-[current=true]:bg-secondary",
            "data-[active=true]:bg-accent data-[active=true]:border-accent",
          ),
          "horizontal-step":
            "data-[completed=true]:[&:not(:last-child)]:after:bg-accent",
          "step-label": "text-secondary",
        }}
        variables={{
          "--step-icon-size": "50px",
          "--step-gap": "10px",
        }}
      >
        {steps.map((stepProps, index) => {
          switch (index) {
            case 0:
              return (
                <Step key={stepProps.label} {...stepProps}>
                  <FacialRegistration />
                </Step>
              );
            case 1:
              return (
                <Step key={stepProps.label} {...stepProps}>
                  <AddressVerification />
                </Step>
              );
            case 2:
              return (
                <Step key={stepProps.label} {...stepProps}>
                  <ListingsRegistration />
                </Step>
              );

            case 3:
              return (
                <Step key={stepProps.label} {...stepProps}>
                  <VideoVerification />
                </Step>
              );
              break;
            default:
              // Add your default case here
              break;
          }
        })}
        <MyStepperFooter />
      </Stepper>
    </div>
  );
}

export function StepperFormActions({ isLoading }: { isLoading: boolean }) {
  const {
    prevStep,
    resetSteps,
    isDisabledStep,
    hasCompletedAllSteps,
    isLastStep,
    isOptionalStep,
  } = useStepper();

  return (
    <div className="flex w-full justify-end gap-2">
      {hasCompletedAllSteps ? (
        <Button size="sm" onClick={resetSteps}>
          Reset
        </Button>
      ) : (
        <>
          <Button
            disabled={isDisabledStep}
            onClick={prevStep}
            size="sm"
            variant="secondary"
          >
            Prev
          </Button>
          <Button size="sm" className="flex items-center ">
            {isLastStep ? "Finish" : isOptionalStep ? "Skip" : "Next"}
            {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
          </Button>
        </>
      )}
    </div>
  );
}

function MyStepperFooter() {
  const { activeStep, resetSteps, steps } = useStepper();

  if (activeStep !== steps.length) {
    return null;
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <Button onClick={resetSteps}>Reset Stepper with Form</Button>
    </div>
  );
}
