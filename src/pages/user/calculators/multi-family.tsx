import type { ReactElement } from "react";
import UserLayout from "../../../components/layouts/UserLayout";
import type { NextPageWithLayout } from "../../_app";
import Head from "next/head";

const MultiFamily: NextPageWithLayout = () => {
  return (
    <div className="">
      <Head>
        <title>Realty-hub MFH Calculator</title>
      </Head>
      <h1 className=""> Coming Soon :)</h1>
      {/* <SFHContainer /> */}
    </div>
  );
};

MultiFamily.getLayout = function getLayout(page: ReactElement) {
  return <UserLayout>{page}</UserLayout>;
};

export default MultiFamily;
