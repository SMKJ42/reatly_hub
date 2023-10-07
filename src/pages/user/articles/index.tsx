import Head from "next/head";
import type { ReactElement } from "react";
import UserLayout from "~/components/layouts/UserLayout";
import type { NextPageWithLayout } from "~/pages/_app";
import { Articles } from "~/components/articles/Articles";

const UserArticles: NextPageWithLayout = () => {
  return (
    <div>
      <Head>
        <title>Realty-hub Articles</title>
      </Head>
      <Articles />
    </div>
  );
};

UserArticles.getLayout = function getLayout(page: ReactElement) {
  return <UserLayout>{page}</UserLayout>;
};

export default UserArticles;
