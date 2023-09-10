import type { ReactElement } from "react";
import UserLayout from "../../../components/layouts/UserLayout";
import type { NextPageWithLayout } from "../../_app";

const MultiFamily: NextPageWithLayout = () => {
  return (
    <div className="">
      <h1 className=""> Coming Soon :)</h1>
      {/* <SFHContainer /> */}
    </div>
  );
};

MultiFamily.getLayout = function getLayout(page: ReactElement) {
  return <UserLayout>{page}</UserLayout>;
};

export default MultiFamily;
