import PublicLayout from "~/components/layouts/PublicLayout";
import type { NextPageWithLayout } from "../_app";
import Head from "next/head";

const termsOfService: NextPageWithLayout = () => {
  return <></>;
};

termsOfService.getLayout = function getLayout(page) {
  return (
    <PublicLayout>
      <Head>
        <title>Realty-hub Terms of Service</title>
        <meta name="description" content="Realty-hub Privacy Policy page" />
      </Head>
      {page}
    </PublicLayout>
  );
};

export default termsOfService;
