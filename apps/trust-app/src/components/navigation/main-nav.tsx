"use client";
import { GitHubLogoIcon, TwitterLogoIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const Header = () => {
  const pathname = usePathname();
  const isRoot = pathname === "/";

  return (
    <>
      {isRoot ? (
        <div className="absolute left-0 right-0 top-0 -z-10 h-52" />
      ) : null}

      <header className="container mx-auto flex max-w-5xl items-center justify-between px-4 py-8">
        <Link href="/">
          <div className="text-xl font-extrabold text-accent">TrustMarkt</div>
        </Link>
        <nav className="flex gap-6">
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex"
          >
            <TwitterLogoIcon className="h-6 w-6 text-gray-50 transition-colors hover:text-gray-400" />
          </a>
          <a
            href="https://github.com/ThamsanQue/TrustMarkt"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex"
          >
            <GitHubLogoIcon className="h-6 w-6 text-gray-50 transition-colors hover:text-gray-400" />
          </a>
        </nav>
      </header>
    </>
  );
};
