import type { ReactElement } from "react";
import UserLayout from "../../../components/layouts/UserLayout";
import type { NextPageWithLayout } from "../../_app";

const Dashboard: NextPageWithLayout = () => {
  return (
    <div className="">
      <h1 className=""> mFH calculator :)</h1>
      {/* <SFHContainer /> */}
    </div>
  );
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <UserLayout>{page}</UserLayout>;
};

export default Dashboard;
