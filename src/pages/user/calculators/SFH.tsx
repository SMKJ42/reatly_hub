import type { ReactElement } from "react";
import UserLayout from "../../../components/layouts/UserLayout";
import type { NextPageWithLayout } from "../../_app";
import SFHContainer from "~/components/SFH/SFHContainer";

const Dashboard: NextPageWithLayout = () => {
  return (
    <div className="">
      <h1 className=""> User Calculators :)</h1>
      <SFHContainer />
    </div>
  );
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <UserLayout>{page}</UserLayout>;
};

export default Dashboard;
