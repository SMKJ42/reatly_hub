import { type ReactElement } from "react";
import UserLayout from "../../../components/layouts/UserLayout";
import type { NextPageWithLayout } from "../../_app";
import { api } from "~/utils/api";
import { StandardLoadingSpinner } from "~/components/shared/StandardLoadingSpinner";
import { SFHPodCard } from "~/components/calculators/history/PodCard";
import Link from "next/link";

const Dashboard: NextPageWithLayout = () => {
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
      <div className="history-container grid grid-cols-2">
        {podData?.map((pod) => {
          return (
            <div
              key={pod.id}
              className="pod-container mx-12 my-6 flex justify-center rounded-xl border-2 border-primary100 bg-primary200 p-4 text-white shadow-lg"
            >
              <SFHPodCard {...pod} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <UserLayout>{page}</UserLayout>;
};

export default Dashboard;
