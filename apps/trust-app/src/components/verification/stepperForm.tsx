"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Step, Stepper, useStepper } from "@/components/ui/stepper";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ScanFace, Home, Tags, Video, Scan } from "lucide-react";
import { cn } from "@/lib/utils";
// import TextShine from "../textShine";
import { FacialRegistration } from "./facial-registration";
// import { getUserById } from "@/data/user";

const steps = [
  { label: "Facial Registration", icon: ScanFace },
  { label: "Address", icon: Home },
  { label: "Listings", icon: Tags },
  { label: "Video Verification", icon: Video },
];

export default function StepperForm() {
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
          if (index === 0) {
            return (
              <Step key={stepProps.label} {...stepProps}>
                <FacialRegistration />
              </Step>
            );
          }
          return (
            <Step key={stepProps.label} {...stepProps}>
              <SecondStepForm />
            </Step>
          );
        })}
        <MyStepperFooter />
      </Stepper>
    </div>
  );
}

const SecondFormSchema = z.object({
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

function SecondStepForm() {
  const { nextStep } = useStepper();

  const form = useForm<z.infer<typeof SecondFormSchema>>({
    resolver: zodResolver(SecondFormSchema),
    defaultValues: {
      password: "",
    },
  });

  function onSubmit(_data: z.infer<typeof SecondFormSchema>) {
    nextStep();
    toast("Second step submitted!");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormDescription>This is your private password.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <StepperFormActions />
      </form>
    </Form>
  );
}

export function StepperFormActions() {
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
          <Button size="sm">
            {isLastStep ? "Finish" : isOptionalStep ? "Skip" : "Next"}
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
