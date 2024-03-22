import { unstable_noStore as noStore } from "next/cache";
// import Link from "next/link";

import { CreatePost } from "@/app/_components/create-post";
import { getServerAuthSession } from "@/server/auth";
import { api } from "@/trpc/server";
import Head from "next/head";
import Upload from "@/components/upload/upload";

export default async function Home() {
  noStore();
  const hello = await api.post.hello.query({ text: "from tRPC" });

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
      <main className=" flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-primary to-secondary-foreground">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Trust <span className="text-[hsl(210,100%,12%)]">Mark</span>t
          </h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <div className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
              <h3 className="text-2xl font-bold">
                TrustMarkt: Securing Online Commerce Through Verified Seller
                Identities.
              </h3>
              <div className="text-lg">
                TrustMarkt: Verifying sellers&apos; identities with advanced
                facial recognition for secure online transactions. Rigorous
                identity validation enhances customer confidence, safeguards
                against fraud, creating a trusted environment for reliable
                e-commerce.
              </div>
            </div>
            <div className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
              <h3 className="text-2xl font-bold">
                Essential Imperatives: Ensuring Security in Online Commerce
              </h3>
              <div className="text-lg">
                Securing online commerce is crucial to protect user data,
                prevent fraud, and build trust. Robust security measures
                safeguard financial transactions, mitigate identity theft risks,
                and enhance the overall reliability of digital marketplaces,
                fostering sustained customer confidence and business reputation.
              </div>
            </div>
          </div>
          <Upload />
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl text-white">
              {hello ? hello.greeting : "Loading tRPC query..."}
            </p>
            <CrudShowcase />
          </div>
        </div>
      </main>
    </>
  );
}

async function CrudShowcase() {
  const session = await getServerAuthSession();
  if (!session?.user) return null;

  const latestPost = await api.post.getLatest.query();

  return (
    <div className="w-full max-w-xs">
      {latestPost ? (
        <p className="truncate">Your most recent post: {latestPost.name}</p>
      ) : (
        <p>You have no posts yet.</p>
      )}

      <CreatePost />
    </div>
  );
}
