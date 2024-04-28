"use client";
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import FileUpload from "./file-upload";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import useMediaQuery from "@/hooks/useMediaQuery";

export default function Upload() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  return (
    <div className="flex gap-4">
      {isDesktop ? (
        <Dialog>
          <DialogTrigger asChild>
            <Button className="rounded-full shadow" variant="outline">
              File upload
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-center">
                Upload your files
              </DialogTitle>
              <DialogDescription className="text-center">
                The only file upload you will ever need
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <FileUpload />
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer>
          <DrawerTrigger asChild>
            <Button
              className="justify-center rounded-full shadow"
              variant="outline"
            >
              File upload
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Upload your files</DrawerTitle>
              <DrawerDescription>
                Upload your identity documents here.
              </DrawerDescription>
            </DrawerHeader>
            <div className="p-4">
              <FileUpload />
            </div>
            <DrawerFooter>
              <div className="flex-col-2 flex gap-4">
                <Button className="w-full">Submit</Button>
                <DrawerClose className="w-full">
                  <Button variant="outline" className="w-full">
                    Cancel
                  </Button>
                </DrawerClose>
              </div>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}
