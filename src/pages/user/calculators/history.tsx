import { type ReactElement } from "react";
import UserLayout from "../../../components/layouts/UserLayout";
import type { NextPageWithLayout } from "../../_app";
import { api } from "~/utils/api";
import { StandardLoadingSpinner } from "~/components/shared/StandardLoadingSpinner";
import { SFHPodCard } from "~/components/calculators/history/PodCard";
import Link from "next/link";
import Head from "next/head";

const History: NextPageWithLayout = () => {
  const { data: podData, isLoading: loadingHistory } =
    api.singleFamily.getAll.useQuery();

  if (loadingHistory)
    return (
      <div className="loading-spinner-container flex h-full w-full items-center justify-center">
        <StandardLoadingSpinner size={88} />
      </div>
    );

  if (podData && podData.length === 0) {
    return (
      <div className="mt-8 flex h-full w-full items-center justify-center px-12">
        <h1 className="text-center md:text-2xl">
          You have no history.&nbsp;
          <Link href="/user/calculators/single-family" className="underline">
            Go to the calculator
          </Link>
          &nbsp;to get started.
        </h1>
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>Realty-hub History</title>
      </Head>
      <div className="history-container mx-8 grid grid-cols-2">
        {podData?.map((pod) => {
          return (
            <div
              key={pod.id}
              className="pod-container my-6 flex justify-center rounded-xl border-2 border-gray-300 p-4 text-white shadow-lg"
            >
              <SFHPodCard {...pod} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

History.getLayout = function getLayout(page: ReactElement) {
  return <UserLayout>{page}</UserLayout>;
};

export default History;
