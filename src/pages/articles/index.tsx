import type { ReactElement } from "react";
import { Articles } from "~/components/articles/Articles";
import PublicLayout from "~/components/layouts/PublicLayout";
import type { NextPageWithLayout } from "../_app";

const PublicArticles: NextPageWithLayout = () => {
  return <Articles />;
};

PublicArticles.getLayout = function getLayout(page: ReactElement) {
  return <PublicLayout>{page}</PublicLayout>;
};

export default PublicArticles;
