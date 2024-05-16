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
import Webcam from "react-webcam";
import { ScanFace, Home, Tags, Video, Scan } from "lucide-react";
import { cn } from "@/lib/utils";
import TextShine from "../textShine";
import { useCallback, useRef, useState } from "react";
import axios from "axios";

const steps = [
  { label: "Step 1", description: "Facial Registration", icon: ScanFace },
  { label: "Step 2", description: "Address", icon: Home },
  { label: "Step 2", description: "Listings", icon: Tags },
  { label: "Step 2", description: "Video Verification", icon: Video },
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
                <FirstStepForm />
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

const FirstFormSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
});

function FirstStepForm() {
  const { nextStep } = useStepper();
  const [instructionText, setInstructionText] = useState("Please face forward");

  const form = useForm<z.infer<typeof FirstFormSchema>>({
    resolver: zodResolver(FirstFormSchema),
    defaultValues: {
      username: "",
    },
  });

  function onSubmit(_data: z.infer<typeof FirstFormSchema>) {
    toast.success("First step submitted!");
    nextStep();
  }

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: "user",
  };

  const webcamRef = useRef(null);
  const captureMultiplePhotos = useCallback(async () => {
    const imageSrcs = [];

    // Capture the first image with the face forward orientation
    setInstructionText("Please face forward");
    await delay(5000); // Delay for 5 seconds
    let imageSrc = webcamRef.current.getScreenshot();
    imageSrcs.push(imageSrc);

    // Capture the second image with the face left orientation
    setInstructionText("Please face left");
    await delay(5000); // Delay for 5 seconds
    imageSrc = webcamRef.current.getScreenshot(); // Capture the image
    imageSrcs.push(imageSrc);

    // Capture the third image with the face right orientation
    setInstructionText("Please face right");
    await delay(5000); // Delay for 5 seconds
    imageSrc = webcamRef.current.getScreenshot(); // Capture the image
    imageSrcs.push(imageSrc);

    // Upload all captured images to Cloudinary
    try {
      const responses = await Promise.all(
        imageSrcs.map((imageSrc) => uploadImageToCloudinary(imageSrc)),
      );
      console.log("Images uploaded successfully: ", responses);
    } catch (error) {
      console.error("Error uploading images: ", error);
    }
  }, [webcamRef]);

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const uploadImageToCloudinary = async (imageSrc) => {
    const formData = new FormData();
    formData.append("file", imageSrc);

    return axios.post(
      `https://api.cloudinary.com/v1_1/dsb0rdt02/image/upload?upload_preset=wossdd8r`,
      formData,
    );
  };

  return (
    <>
      <div className="relative">
        <Webcam
          audio={false}
          height={720}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={1280}
          videoConstraints={videoConstraints}
          className="rounded-lg"
        />
        <div className="absolute left-1/2 top-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 transform md:h-[300px] md:w-[300px] ">
          <Scan className="h-full w-full text-accent" />
        </div>
      </div>
      <div className="m-4 flex flex-col items-center justify-center ">
        <Button onClick={captureMultiplePhotos} className="m-4">
          Start Registration
        </Button>
        <TextShine text={instructionText} />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <StepperFormActions />
        </form>
      </Form>
    </>
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

function StepperFormActions() {
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
