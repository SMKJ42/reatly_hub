import type { ReactElement } from "react";
import PublicLayout from "../components/layouts/PublicLayout";
import type { NextPageWithLayout } from "./_app";

const Home: NextPageWithLayout = () => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-8 mt-4">
        <h1 className="text-3xl font-bold"> Realty-Hub </h1>
        <p className="italic">Our goal is to educate</p>
      </div>
      <section className="p-4">
        <h2 className="pb-2 text-xl font-bold">What We Are</h2>
        <ul className="text-lg [&>*]:pb-2">
          <li>
            <p>
              Our articles will give you some insight to smart real estate
              decisions.
            </p>
          </li>
          <li>
            <p>
              The single family home calculator will help you estimate key
              metrics.
            </p>
          </li>
        </ul>
      </section>
      {/* <section className="p-4">
        <h2 className="pb-2 text-xl font-bold">
          Check out our Education Center!
        </h2>
        <ul className="text-lg [&>*]:pb-2">
          <li></li>
        </ul>
      </section> */}
      <section className="flex flex-col items-center">
        <h2 className="pb-4 text-xl font-bold">
          How to Utilize our Calculators
        </h2>
        <ol className="flex w-2/3 flex-col items-start text-start text-lg [&>*]:pb-4">
          <li>
            <p>1. First, you need to create an account.</p>
          </li>
          <li>
            <p>
              2. Once you have an account, hover over the calculators tab as
              select a caculator!
            </p>
          </li>
          <li>
            <p>
              3. SFH is for single-family properties, MFH is for multi-family
              properties
            </p>
          </li>
          <li>
            <p>
              5. All of your reports can be saved, so you can utilize them
              later!
            </p>
          </li>
        </ol>
      </section>
    </div>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <PublicLayout>{page}</PublicLayout>;
};

export default Home;
