import { unstable_noStore as noStore } from "next/cache";
import Head from "next/head";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  noStore();
  return (
    <>
      <Head>
        <title>TrustMarkt</title>
        <meta
          name="description"
          content="Securing Online Commerce Through Verified Seller Identities."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className=" flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <div className="relative mx-auto flex max-w-2xl flex-col items-center">
            <h2 className="text-center text-3xl font-bold text-gray-50 sm:text-6xl">
              Safe & Trusted{" "}
              <span className="animate-text-gradient inline-flex bg-gradient-to-r from-neutral-900 via-slate-500 to-neutral-500 bg-[200%_auto] bg-clip-text leading-tight text-transparent dark:from-neutral-100 dark:via-slate-400 dark:to-neutral-400">
                Online Shopping
              </span>
            </h2>
            <p className="mt-6 text-center text-lg leading-6 text-white/60">
              Shop smarter online!{" "}
              <span className="cursor-wait font-semibold text-accent">
                TrustMarkt{" "}
              </span>{" "}
              verifies sellers and their items, working hard to keep scams at
              bay. Stay safer while buying and selling online.{" "}
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <div className="flex max-w-xs flex-col gap-4 rounded-xl border border-gray-800 bg-gradient-to-b from-gray-950 to-black p-4 text-white">
              <h3 className="text-center text-2xl font-bold">
                Verified Sellers for Safer Transactions
              </h3>
              <div className="text-center text-lg text-white/60">
                TrustMarkt uses facial recognition to check that sellers are who
                they say they are. This helps you shop with confidence, knowing
                you're dealing with real people, not scammers. We're all about
                making online buying safer and more reliable for you!
              </div>
            </div>
            <div className="flex max-w-xs flex-col gap-4 rounded-xl border border-gray-800 bg-gradient-to-b from-gray-950 to-black p-4 text-white">
              <h3 className="text-center text-2xl font-bold">
                Safeguarding Every Step for Buyers and Sellers
              </h3>
              <div className="text-center text-lg text-white/60">
                For buyers, TrustMarkt means confidence from browsing to buying.
                Look for our{" "}
                <span className="cursor-wait font-semibold text-accent">
                  TrustMark
                </span>{" "}
                to shop securely. Sellers{" "}
                <span className="cursor-wait font-semibold text-accent">
                  Gain Credibility and Attract More Buyers
                </span>{" "}
                with our TrustMark on your profile. Our security measures ensure
                smooth transactions, benefiting everyone involved
              </div>
            </div>
          </div>
          <Link href={"/auth/login"}>
            <Button variant="cta" size="lg" className="mb-8 text-accent">
              Get Verified Now
            </Button>
          </Link>
        </div>
      </main>
    </>
  );
}
