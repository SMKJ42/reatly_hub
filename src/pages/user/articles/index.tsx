import type { ReactElement } from "react";
import UserLayout from "~/components/layouts/UserLayout";
import type { NextPageWithLayout } from "~/pages/_app";
import Articles from "~/pages/articles";

const UserArticles: NextPageWithLayout = () => {
  return <Articles />;
};

UserArticles.getLayout = function getLayout(page: ReactElement) {
  return <UserLayout>{page}</UserLayout>;
};

export default UserArticles;
