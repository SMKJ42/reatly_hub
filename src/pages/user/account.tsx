import type { ReactElement } from "react";
import UserLayout from "../../components/layouts/UserLayout";
import type { NextPageWithLayout } from "../_app";
import { useUser } from "@clerk/nextjs";
import { StandardLoadingSpinner } from "~/components/shared/StandardLoadingSpinner";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";

const UserAccount: NextPageWithLayout = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  const name = user?.firstName
    ? user.firstName
    : user?.username
    ? user.username
    : "user";

  const role = (user?.publicMetadata?.role as string) || "";

  if (!isLoaded) return <StandardLoadingSpinner />;
  if (!isSignedIn)
    return (
      <p>
        <Link href="sign-in">Sign in</Link> to view your account
      </p>
    );

  return (
    <div className="p-4">
      <Head>
        <title>Realty-Hub Account</title>
      </Head>
      <div className="pb-4">
        <div className="border-gray w-fit rounded-xl border px-4 py-2 text-center">
          <p className="pb-2 text-lg">{name}</p>
          <div className="flex w-full justify-center">
            <Image
              src={user?.profileImageUrl ? user.profileImageUrl : ""}
              alt={`${name}'s profile image`}
              className="rounded-xl"
              width={80}
              height={80}
            ></Image>
          </div>
          {user && <p className="mt-2">Role: {role || ""}</p>}
          <button className="mb-1 mt-2 rounded-lg bg-white px-4 py-1 text-black">
            Edit Image
          </button>
        </div>
      </div>
    </div>
  );
};

UserAccount.getLayout = function getLayout(page: ReactElement) {
  return <UserLayout>{page}</UserLayout>;
};

export default UserAccount;
