import type { ReactElement } from "react";
import PublicLayout from "../components/layouts/PublicLayout";
import type { NextPageWithLayout } from "./_app";
import Image from "next/image";
import Head from "next/head";

const Home: NextPageWithLayout = () => {
  return (
    <div className="flex flex-col items-center text-center">
      <Head>
        <title>Realty-hub Home</title>
        <meta
          name="description"
          content="Realty-hub Home page and about information"
        />
      </Head>
      <div className="mb-8 mt-8">
        <h1 className="text-3xl font-bold"> Realty-Hub </h1>
        <p className="italic">Our goal is to educate</p>
      </div>
      <Image
        src="/stock_banner.JPG"
        alt="banner image"
        height={400}
        width={600}
        className="h-auto w-5/6 rounded-lg border-2 border-gray-400 p-4 sm:w-[550px] lg:w-[650px]"
        loading="eager"
      />
      <section className="mt-4 flex flex-col items-center p-4">
        <h2 className="pb-4 text-xl font-bold">What We Are</h2>
        <ul className="w-[275px] px-8 text-lg sm:w-[500px] [&>*]:pb-4">
          <li>
            <p>
              Our articles are community written for you and by you. We want
              your knowledge and experience to help others.
            </p>
          </li>
          <li>
            <p>
              Our free calculator will give you the informaiton you need to make
              an informed decision.
            </p>
          </li>
        </ul>
      </section>
    </div>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <PublicLayout>{page}</PublicLayout>;
};

export default Home;
