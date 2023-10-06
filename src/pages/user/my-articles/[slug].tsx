import type { ReactElement } from "react";
import type { NextPageWithLayout } from "~/pages/_app";
import UserLayout from "~/components/layouts/UserLayout";

const MySpecificArticle: NextPageWithLayout = () => {
  return (
    <div>
      <h1>My Articles</h1>
    </div>
  );
};

MySpecificArticle.getLayout = function getLayout(page: ReactElement) {
  return <UserLayout>{page}</UserLayout>;
};

export default MySpecificArticle;
