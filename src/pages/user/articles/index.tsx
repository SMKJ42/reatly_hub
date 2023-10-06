import type { ReactElement } from "react";
import UserLayout from "~/components/layouts/UserLayout";
import Articles from "~/pages/articles";

Articles.getLayout = function getLayout(page: ReactElement) {
  return <UserLayout>{page}</UserLayout>;
};

export default Articles;
