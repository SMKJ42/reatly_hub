import type { ReactElement } from "react";
import PublicLayout from "../../components/layouts/PublicLayout";
import type { NextPageWithLayout } from "../_app";

const Home: NextPageWithLayout = () => {
  return <></>;
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <PublicLayout>{page}</PublicLayout>;
};

export default Home;
