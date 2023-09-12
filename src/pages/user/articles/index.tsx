import type { ReactElement } from "react";
import UserLayout from "../../../components/layouts/UserLayout";
import type { NextPageWithLayout } from "../../_app";
import Link from "next/link";

const Articles: NextPageWithLayout = () => {
  return (
    <>
      <Link href="/user/articles/write-article">Create Article</Link>
      <h1 className=""> User Blog :) </h1>
    </>
  );
};

Articles.getLayout = function getLayout(page: ReactElement) {
  return <UserLayout>{page}</UserLayout>;
};

export default Articles;
