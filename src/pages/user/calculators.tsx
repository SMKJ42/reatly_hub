import type { ReactElement } from "react";
import UserLayout from "../../components/layouts/UserLayout";
import type { NextPageWithLayout } from "../_app";

const Dashboard: NextPageWithLayout = () => {
  return <h1 className="bg-white"> User Calculators :) </h1>;
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <UserLayout>{page}</UserLayout>;
};

export default Dashboard;
