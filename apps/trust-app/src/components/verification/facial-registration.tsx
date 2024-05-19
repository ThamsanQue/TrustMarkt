import { useCallback, useRef, useState } from "react";
import { useStepper } from "../ui/stepper";
import { useCurrentUser } from "@/hooks/use-current-user";
// import { z } from "zod";
// import { toast } from "sonner";
import { addFaceId } from "@/actions/profile-verification";
import axios from "axios";
import Webcam from "react-webcam";
import { Scan } from "lucide-react";
import { Button } from "../ui/button";
import { StepperFormActions } from "./stepperForm";
import { getUserByIdAction } from "@/actions/utils";
import { countdownTimer } from "@/lib/utils";

export const FacialRegistration = () => {
  const { nextStep } = useStepper();
  const [instructionText, setInstructionText] = useState("Please face forward");
  const [countdown, setCountdown] = useState(0);
  const user = useCurrentUser();

  const videoConstraints = {
    width: 720,
    height: 1280,
    facingMode: "user",
  };

  const webcamRef = useRef<Webcam | null>(null);
  const imageSrcs: string[] = [];

  const registerFace = useCallback(async () => {
    const captureImage = async (instructionText: string) => {
      setInstructionText(instructionText);
      await countdownTimer(5, setCountdown);
      const imageSrc = webcamRef.current && webcamRef.current.getScreenshot();
      imageSrc && imageSrcs.push(imageSrc);
    };

    await captureImage("Please face forward");
    await captureImage("Please face left");
    await captureImage("Please face right");
    setInstructionText("");

    try {
      const responses = await Promise.all(
        imageSrcs.map((imageSrc) => uploadImageToCloudinary(imageSrc)),
      );
      console.log("Images uploaded successfully: ", responses);
      const urls = responses.map((response) => response.data.url);
      const faceIds = await addFaceId(user?.id as string, urls);
      const userDetails = await getUserByIdAction(user?.id as string);
      const facialRecognitionPayload = {
        name: userDetails?.name,
        faceIds: faceIds[0]?.faceId,
      };
      console.log("Face IDs added successfully: ", facialRecognitionPayload);
    } catch (error) {
      console.error("Error uploading images: ", error);
    }
  }, [webcamRef]);

  const uploadImageToCloudinary = async (imageSrc: string) => {
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
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          videoConstraints={videoConstraints}
          className="mx-auto rounded-lg"
        />
        <h3 className="absolute left-1/2 top-0 mt-2 -translate-x-1/2 rounded-md bg-white p-2 text-xs font-semibold text-accent md:mt-6 md:text-xl">
          {instructionText}
        </h3>
        <div className="absolute left-1/2 top-1/2 flex h-48 w-48 -translate-x-1/2 -translate-y-1/2 transform items-center justify-center md:h-[500px] md:w-[500px]">
          <Scan
            className="absolute inset-0 h-full w-full text-accent"
            strokeWidth="0.5"
          />
          <h1 className="z-10 text-center text-xl font-semibold text-accent md:text-5xl">
            {countdown > 0 ? countdown : null}
          </h1>
        </div>
      </div>

      <div className="m-4 flex flex-col items-center justify-center ">
        <Button onClick={registerFace} className="m-4">
          Start Registration
        </Button>
        {/* <TextShine text={instructionText} /> */}
      </div>
      <StepperFormActions />
    </>
  );
};
