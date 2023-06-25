import type { ReactElement } from "react";
import UserLayout from "../../../components/layouts/UserLayout";
import type { NextPageWithLayout } from "../../_app";
import { useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";
import { LoadingSpinner } from "~/components/shared/LoadingSpinner";

const Dashboard: NextPageWithLayout = () => {
  const user = useUser();

  const { data, isLoading: historyLoading } =
    api.singleFamily.getAll.useQuery();

  if (historyLoading) return <LoadingSpinner />;

  console.log(data);

  return (
    <div className="">
      <h1 className=""> History </h1>
      {data?.map((pod) => {
        return (
          <div key={pod.id} className="pod-container">
            <h3 className="">{pod.address}</h3>
            <p className="">Monthly cash flow: ${pod.cashFlow}</p>
            <p className="">COC: {pod.cashOnCash}%</p>
            <p className="">ROE: {pod.ROE}%</p>
            <p className="">ROI: {pod.ROI}%</p>
          </div>
        );
      })}
    </div>
  );
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <UserLayout>{page}</UserLayout>;
};

export default Dashboard;
