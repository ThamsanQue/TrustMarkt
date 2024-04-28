import { boolean, object, optional, string } from "zod";

export const LoginSchema = object({
  email: string().email({
    message: "Email is required",
  }),
  password: string().min(1, "Password is required"),
  code: optional(string()),
});

export const RegisterSchema = object({
  email: string().email(),
  password: string().min(6, "Minimum password length is 6"),
  name: string().min(1, "Name is required"),
});

export const ResetSchema = object({
  email: string().email({
    message: "Email is required",
  }),
});

export const NewPasswordSchema = object({
  password: string().min(6, {
    message: "Minimum of 6 characters required",
  }),
});

export const SettingsSchema = object({
  name: optional(string()),
  isTwoFactorEnabled: optional(boolean()),
  email: optional(string().email()),
  password: optional(string().min(6)),
  newPassword: optional(string().min(6)),
})
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: "New password is required!",
      path: ["newPassword"],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }

      return true;
    },
    {
      message: "Password is required!",
      path: ["password"],
    }
  );
