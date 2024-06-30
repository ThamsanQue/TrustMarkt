"use client";

import { useForm } from "react-hook-form";
import { useStepper } from "../ui/stepper";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { StepperFormActions } from "./verificationStepper";
import { z } from "zod";
import {
  getCoordinatesFromAddress,
  getDeviceCoordinates,
  getDistanceFromLatLonInKm,
} from "@/lib/utils";
import { useCurrentUser } from "@/hooks/use-current-user";
import { addAddress } from "@/actions/profile-verification";
import { CoordinatesSchema, addressVerificationSchema } from "@/lib/schemas";

export const AddressVerification = () => {
  const { nextStep } = useStepper();
  const user = useCurrentUser();

  const form = useForm<z.infer<typeof addressVerificationSchema>>({
    resolver: zodResolver(addressVerificationSchema),
    defaultValues: {
      address: "",
    },
  });

  const onSubmit = async (_data: z.infer<typeof addressVerificationSchema>) => {
    try {
      const coords = await getCoordinatesFromAddress(_data.address);

      const deviceCoords = await getDeviceCoordinates();

      // Verify coordinates using local variables to ensure they are not null
      if (!coords || !deviceCoords) {
        throw new Error("Coordinates not found");
      }
      const validatedCoords = CoordinatesSchema.parse(coords);
      const validatedDeviceCoords = CoordinatesSchema.parse(deviceCoords);
      const distance = getDistanceFromLatLonInKm(
        validatedDeviceCoords.lat,
        validatedDeviceCoords.lon,
        validatedCoords.lat,
        validatedCoords.lon,
      );

      if (distance < 1) {
        await addAddress(user?.id as string, _data.address);
        toast.success("Address verified!");
        nextStep();
      } else {
        toast.info("Address does not match your current location.");
      }
    } catch (error) {
      toast.error("Error getting coordinates");
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-muted-foreground">Address</FormLabel>
              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormDescription>
                Please be at this address during verification.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <StepperFormActions isLoading={form.formState.isSubmitting} />
      </form>
    </Form>
  );
};
