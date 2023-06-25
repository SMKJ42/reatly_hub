import { isValidElement, type ReactElement } from "react";
import UserLayout from "../../../components/layouts/UserLayout";
import type { NextPageWithLayout } from "../../_app";
import { api } from "~/utils/api";
import { StandardLoadingSpinner } from "~/components/shared/StandardLoadingSpinner";
import { useRouter } from "next/router";
import {
  HydrateSingleFamily,
  type singleFamilyInterface,
} from "~/redux/slice/singleFamilySlice";
import { useAppDispatch } from "~/redux/hooks";

const Dashboard: NextPageWithLayout = () => {
  const { data, isLoading: historyLoading } =
    api.singleFamily.getAll.useQuery();

  if (historyLoading) return <StandardLoadingSpinner />;

  return (
    <div className="">
      <h1 className=""> History </h1>

      {data?.map((pod) => {
        return <Pod key={pod.id} {...pod} />;
      })}
    </div>
  );
};

interface PodInterface extends singleFamilyInterface {
  id: string;
  authorId: string;
  loanTypeOptions?: string[];
  rennovationsRadio?: boolean;
  speculation?: boolean;
  variable?: string;
}

const Pod = (pod: PodInterface) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const ctx = api.useContext();

  const { mutate: deletePod, isLoading: isDeleting } =
    api.singleFamily.delete.useMutation({
      onSuccess: () => {
        void ctx.singleFamily.getAll.invalidate();
      },
      onError: (error) => {
        console.log(error);
      },
    });

  return (
    <div key={pod.id} className="pod-container">
      {isDeleting ? <StandardLoadingSpinner /> : null}
      <h3 className="">{pod.address}</h3>
      <p className="">Monthly cash flow: ${pod.cashFlow}</p>
      <p className="">COC: {pod.cashOnCash}%</p>
      <p className="">ROE: {pod.ROE}%</p>
      <p className="">ROI: {pod.ROI}%</p>
      <button
        className=""
        onClick={() => {
          dispatch(
            HydrateSingleFamily({
              ...pod,
              loanTypeOptions: ["conventional", "FHA", "VA", "USDA"],
              rennovationsRadio: false,
              speculation: false,
              variable: "0",
            })
          );
          void router.push("/user/calculators/single-family");
        }}
      >
        Edit
      </button>
      <button
        onClick={() => {
          deletePod({ id: pod.id });
        }}
      >
        Delete
      </button>
    </div>
  );
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <UserLayout>{page}</UserLayout>;
};

export default Dashboard;
