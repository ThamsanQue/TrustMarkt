"use client";

import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { Button } from "../ui/button";
import { Loader2, StopCircle, Video } from "lucide-react";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/use-current-user";
import { addVerificationVideo } from "@/actions/profile-verification";
import { useRouter } from "next/navigation";

export const VideoVerification = () => {
  const webcamRef = useRef<Webcam>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [capturing, setCapturing] = useState<boolean>(false);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  const recordingTime: number = 5 * 60 * 1000;
  const [loading, setLoading] = useState<boolean>(false);
  const user = useCurrentUser();
  const route = useRouter();

  const videoConstraints = {
    width: 720,
    height: 1280,
    facingMode: "user",
  };
  const handleDataAvailable = useCallback(
    ({ data }: { data: BlobPart }) => {
      if (data instanceof Blob && data.size > 0) {
        setRecordedChunks((prev: Blob[]) => prev.concat(data));
      } else if (typeof data === "string") {
        // Handle string data if necessary
        console.log("Received string data:", data);
      }
    },
    [setRecordedChunks],
  );

  const startRecording = useCallback(() => {
    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(
      webcamRef.current?.stream as MediaStream,
      {
        mimeType: "video/webm",
      },
    );
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable,
    );
    mediaRecorderRef.current.start();

    setTimeout(() => {
      stopRecording();
    }, recordingTime);
  }, [webcamRef, handleDataAvailable]);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && capturing) {
      mediaRecorderRef.current.stop();
      setCapturing(false);
    }
  }, [mediaRecorderRef, capturing]);

  const handleUploadToCloudinary = async (blob: Blob) => {
    const formData = new FormData();
    formData.append("file", blob);
    try {
      setLoading(true);
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dsb0rdt02/video/upload?upload_preset=wossdd8r",
        formData,
      );
      console.log("Cloudinary Upload Response:", response.data);
      await addVerificationVideo(user?.id as string, response.data.url);
      toast.success("Video uploaded successfully!");
      setLoading(false);
      route.push("/success");
    } catch (error) {
      setLoading(false);
      console.error("Error uploading video:", error);
      toast.error("Failed to upload video");
    }
  };

  const handleStopAndUpload = useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm",
      });
      handleUploadToCloudinary(blob);
      setRecordedChunks([]);
    }
  }, [recordedChunks]);

  useEffect(() => {
    if (!capturing && recordedChunks.length > 0) {
      handleStopAndUpload();
    }
  }, [capturing, recordedChunks, handleStopAndUpload]);

  return (
    <>
      <Webcam
        audio={true}
        ref={webcamRef}
        videoConstraints={videoConstraints}
        className="mx-auto rounded-lg"
      />
      {!capturing && !loading ? (
        <Button onClick={startRecording} className="mx-auto mt-2 w-40">
          Start Recording <Video size={20} className="ml-2 mt-1 items-center" />
        </Button>
      ) : loading ? (
        <Loader2 className="mx-auto mt-2 w-40 animate-spin text-accent" />
      ) : (
        <Button onClick={stopRecording} className="mx-auto mt-2 w-40">
          Stop Recording{" "}
          <StopCircle size={20} className="ml-2 mt-1 items-center" />
        </Button>
      )}
    </>
  );
};
