import { SignInButton, useUser } from "@clerk/nextjs";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useUser();

  const router = useRouter();
  const { isLoaded: userLoaded } = useUser();

  useEffect(() => {
    if (!userLoaded) return;
    if (user.isSignedIn) void router.push("/user/dashboard");
  });

  return (
    <>
      <Head>
        <title>Realty-Hub</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav className="flex">
        <div className="logo-container flex flex-none">
          <img className="logo"></img>
        </div>
        <div className="std-navigation flex flex-1 justify-around">
          <Link href="/about">home</Link>
          <Link href="blog">blog</Link>
        </div>
        <div className="account-manager flex-3 flex-inital flex w-32 justify-around">
          <SignInButton />
        </div>
      </nav>
      <main className="bg-slate">{children}</main>
      <footer></footer>
    </>
  );
}
