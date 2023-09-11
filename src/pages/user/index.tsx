import { type ReactElement } from "react";
import UserLayout from "../../components/layouts/UserLayout";
import type { NextPageWithLayout } from "../_app";

const Dashboard: NextPageWithLayout = () => {
  return (
    <>
      <Counter />
      <h1 className=""> User Dashboard :) </h1>
    </>
  );
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <UserLayout>{page}</UserLayout>;
};

const Counter = () => {
  return <div className="">Dashboard</div>;
};

export default Dashboard;
