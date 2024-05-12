import Image from "next/image";
import logo from "@/assets/Logo.svg";

interface HeaderProps {
  label: string;
}

export const Header = ({ label }: HeaderProps) => {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-y-4">
      <Image src={logo} alt="TrustMarkt Logo" className="h-20 w-20" />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
};
