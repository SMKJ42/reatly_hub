import PublicLayout from "~/components/layouts/PublicLayout";
import type { NextPageWithLayout } from "../../_app";
import Head from "next/head";

const privacyPolicy: NextPageWithLayout = () => {
  return <></>;
};

privacyPolicy.getLayout = function getLayout(page) {
  return (
    <PublicLayout>
      <Head>
        <title>Realty-hub Privacy Policy</title>
        <meta name="description" content="Realty-hub Privacy Policy page" />
      </Head>
      {page}
    </PublicLayout>
  );
};

export default privacyPolicy;
