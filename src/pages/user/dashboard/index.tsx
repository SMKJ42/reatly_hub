import { type ReactElement } from "react";
import UserLayout from "~/components/layouts/UserLayout";
import type { NextPageWithLayout } from "../../_app";
import { AccountArticles } from "~/components/dashboard/articles/AccountAuthor";
import { AccountAdmin } from "~/components/dashboard/admin/AccountAdmin";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { StandardLoadingSpinner } from "~/components/shared/StandardLoadingSpinner";
import { AccountSFH } from "~/components/dashboard/pod/AccountSFH";
import Head from "next/head";
import { AdminRoles, AuthorRoles } from "~/utils/priviledges";

const Dashboard: NextPageWithLayout = () => {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) return <StandardLoadingSpinner />;
  if (!isSignedIn)
    return (
      <p>
        <Link href="sign-in">Sign in</Link> to view your account
      </p>
    );

  return (
    <div className="p-8 pt-4 [&>*]:my-4">
      <Head>
        <title>Realty-hub Dashboard</title>
      </Head>
      {AdminRoles.includes(user.publicMetadata.role as string) && (
        <AccountAdmin />
      )}
      {AuthorRoles.includes(user.publicMetadata.role as string) ? (
        <AccountArticles />
      ) : (
        <>
          <p>Want to be a blog contributor?</p>
          <button>Apply</button>
        </>
      )}
      <AccountSFH />
    </div>
  );
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <UserLayout>{page}</UserLayout>;
};

export default Dashboard;
