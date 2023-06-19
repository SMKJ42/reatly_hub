import type { ReactElement } from "react";
import PublicLayout from "../../components/layouts/PublicLayout";
import type { NextPageWithLayout } from "../_app";

const Home: NextPageWithLayout = () => {
  return <h1 className="bg-white"> hello </h1>;
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <PublicLayout>{page}</PublicLayout>;
};

export default Home;
