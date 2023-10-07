import type { ReactElement } from "react";
import PublicLayout from "../components/layouts/PublicLayout";
import type { NextPageWithLayout } from "./_app";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import { SignUpButton } from "@clerk/nextjs";

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
        className="h-auto w-5/6 rounded-lg border-2 border-gray-400 bg-black p-[12px] sm:w-[450px] lg:w-[550px]"
        loading="eager"
      />
      <div className="flex flex-col items-center justify-center">
        <div className="h-4 w-[18px] bg-gray-400"></div>
        <div className="flex w-full translate-y-[-2px] justify-center">
          <div className="h-2 w-12 rotate-[-6deg] bg-gray-400"></div>
          <div className="h-2 w-12 rotate-6 bg-gray-400"></div>
        </div>
      </div>
      <div className="h-[8px] w-24 translate-y-[-7px] bg-gray-400"></div>
      <section className="mt-2 flex flex-col items-center p-4 text-lg">
        <h2 className="pb-4 text-2xl font-bold">What We Are</h2>
        <div className="w-[250px] pb-12 sm:w-[400px]">
          <p className="pb-6">
            Our articles are community written for the community by the
            community. We want your knowledge and experience to help others.
          </p>
          <Link
            href="articles"
            className="rounded-lg bg-darkBg300 px-4 py-2 text-white dark:bg-white dark:text-black"
          >
            Articles
          </Link>
          <div className="flex w-full justify-center pt-8">
            <div className="h-1 w-[150px] bg-darkBg300 dark:bg-white"></div>
          </div>

          <p className="py-6">
            Our free calculator will give you the informaiton you need to make
            an informed decision.
          </p>
          <Link
            href="public/calculator"
            className="rounded-lg bg-darkBg300 px-4 py-2 text-white dark:bg-white dark:text-black"
          >
            Calculator
          </Link>

          <div className="flex w-full justify-center pt-8">
            <div className="h-1 w-[150px] bg-darkBg300 dark:bg-white"></div>
          </div>
          <p className="py-6">
            Create an account today and save your property analysis!
          </p>
          <SignUpButton />
        </div>
      </section>
    </div>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <PublicLayout>{page}</PublicLayout>;
};

export default Home;
