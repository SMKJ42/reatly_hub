import type { ReactElement } from "react";
import UserLayout from "../../components/layouts/UserLayout";
import type { NextPageWithLayout } from "../_app";
import { useUser } from "@clerk/nextjs";
import { StandardLoadingSpinner } from "~/components/shared/StandardLoadingSpinner";
import Image from "next/image";
import Link from "next/link";

const UserAccount: NextPageWithLayout = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  const name = user?.firstName
    ? user.firstName
    : user?.username
    ? user.username
    : "user";

  if (!isLoaded) return <StandardLoadingSpinner />;
  if (!isSignedIn)
    return (
      <p>
        <Link href="sign-in">Sign in</Link> to view your account
      </p>
    );

  return (
    <>
      <h1 className="">Account</h1>
      <Image
        src={user?.profileImageUrl ? user.profileImageUrl : ""}
        alt={`${name}'s profile image`}
        width={80}
        height={80}
      ></Image>
      <p>{name}</p>
      <p>Want to be a blog contributor?</p>
      <button>Apply</button>
    </>
  );
};

UserAccount.getLayout = function getLayout(page: ReactElement) {
  return <UserLayout>{page}</UserLayout>;
};

export default UserAccount;
