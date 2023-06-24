import type { ReactElement } from "react";
import UserLayout from "../../../components/layouts/UserLayout";
import type { NextPageWithLayout } from "../../_app";
import { useUser } from "@clerk/nextjs";

const Dashboard: NextPageWithLayout = () => {
  const user = useUser();

  return (
    <div className="">
      <h1 className=""> History </h1>
    </div>
  );
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <UserLayout>{page}</UserLayout>;
};

export default Dashboard;
