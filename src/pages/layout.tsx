import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const user = useUser();

  useEffect(() => {
    if (!user.isSignedIn) void router.push("/public/home");
    else void router.push("/user/dashboard");
  }, []);

  return <>{children}</>;
}
