"use client";

import { useForm } from "react-hook-form";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addListings } from "@/actions/profile-verification";
import { toast } from "sonner";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useStepper } from "../ui/stepper";
import { createElement, useState } from "react";
import { MinusIcon } from "lucide-react";
import { Button } from "../ui/button";
import { FaInstagram, FaWhatsapp, FaFacebook } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createSchema } from "@/lib/schemas";

const availablePlatforms = [
  {
    label: "Facebook Marketplace",
    value: "FacebookMarketplace",
    icon: FaFacebook,
  },
  { label: "WhatsApp Business", value: "WhatsAppBusiness", icon: FaWhatsapp },
  { label: "Instagram", value: "Instagram", icon: FaInstagram },
];

export const ListingsRegistration = () => {
  const { nextStep } = useStepper();
  const user = useCurrentUser();
  const [platforms, setPlatforms] = useState([
    {
      label: "Facebook Marketplace",
      name: "FacebookMarketplace",
      placeholder: "Enter text",
      icon: FaFacebook,
    },
  ]);

  const listingRegistrationSchema = createSchema(platforms);

  const addPlatform = (value: string) => {
    const platform = availablePlatforms.find((P) => P.value === value);
    if (platform && !platforms.find((P) => P.name === platform.value)) {
      setPlatforms([
        ...platforms,
        {
          label: platform.label,
          placeholder: "Enter text",
          name: platform.value,
          icon: platform.icon,
        },
      ]);
    }
  };
  const removePlatform = (index: number) => {
    const newPlatforms = [...platforms];
    newPlatforms.splice(index, 1);
    setPlatforms(newPlatforms);
  };

  const form = useForm<z.infer<typeof listingRegistrationSchema>>({
    resolver: zodResolver(listingRegistrationSchema),
    defaultValues: {
      FacebookMarketplace: "",
      WhatsappBusiness: "",
      Instagram: "",
    },
  });

  const filteredAvailablePlatforms = availablePlatforms.filter(
    (platform) => !platforms.some((P) => P.name === platform.value),
  );

  const onSubmit = async (_data: z.infer<typeof listingRegistrationSchema>) => {
    try {
      console.log(_data);
      const listings = Object.values(_data).filter(Boolean) as string[];
      await addListings(user?.id as string, listings);
      toast.success("Listings registered!");
      nextStep();
    } catch (error) {
      toast.error("Error registering listings");
    }
  };
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {platforms.map((platform, index) => (
            <FormField
              key={platform.name}
              control={form.control}
              name={`${platform.name}`}
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-2">
                    <FormLabel className="text-muted-foreground">
                      {platform.label}
                    </FormLabel>
                    {platform.icon &&
                      createElement(platform.icon, {
                        className: "h-5 w-5 text-accent",
                      })}
                  </div>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input type="text" {...field} />
                    </FormControl>
                    {platforms.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => {
                          form.resetField(platform.name);
                          removePlatform(index);
                        }}
                        variant="default"
                        className="flex h-10 w-10 items-center justify-center rounded-md bg-red-500/15 text-red-300 hover:bg-red-100/20"
                      >
                        <MinusIcon className="h-5 w-5" />
                      </Button>
                    )}
                  </div>
                  <FormDescription>
                    Enter the link to your {`${platform.label}`} listings
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="default">Add Platform</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="mt-2 w-56 border border-gray-800 bg-gradient-to-b from-gray-950 to-black text-muted-foreground shadow-md md:ml-24">
                <DropdownMenuRadioGroup onValueChange={addPlatform}>
                  {filteredAvailablePlatforms.map((platform) => (
                    <DropdownMenuRadioItem
                      key={platform.value}
                      value={platform.value}
                    >
                      {platform.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <StepperFormActions isLoading={form.formState.isSubmitting} />
        </form>
      </Form>
    </div>
  );
};
