import type { ReactElement } from "react";
import { Articles } from "~/components/articles/Articles";
import PublicLayout from "~/components/layouts/PublicLayout";
import type { NextPageWithLayout } from "../_app";
import Head from "next/head";

const PublicArticles: NextPageWithLayout = () => {
  return (
    <div>
      <Head>
        <title>Realty-hub Articles</title>
      </Head>
      <Articles />
    </div>
  );
};

PublicArticles.getLayout = function getLayout(page: ReactElement) {
  return <PublicLayout>{page}</PublicLayout>;
};

export default PublicArticles;
