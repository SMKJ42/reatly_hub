import { type ReactElement } from "react";
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
  const { data, isLoading: loadingHistory } =
    api.singleFamily.getAll.useQuery();

  if (loadingHistory)
    return (
      <div className="loading-spinner-container flex h-full w-full items-center justify-center">
        <StandardLoadingSpinner size={88} />
      </div>
    );

  return (
    <div>
      <h1 className=""> History </h1>
      <div className="hiscoty-container grid grid-cols-2">
        {data?.map((pod) => {
          return <Pod key={pod.id} {...pod} />;
        })}
      </div>
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
    <div
      key={pod.id}
      className="pod-container mx-12 my-6 flex justify-center rounded-xl border-2 border-primary100 bg-primary200 p-4 text-white shadow-lg"
    >
      <div>
        {isDeleting ? <StandardLoadingSpinner /> : null}
        <h3 className="text-center">{pod.address}</h3>
        <p className="">Cash flow: ${pod.cashFlow}</p>
        <p className="">COC: {pod.capEx}%</p>
        <p className="">ROE: {pod.ROE}%</p>
        <p className="">ROI: {pod.ROI}%</p>
        <div className="mt-2 flex w-full justify-around rounded-md ">
          <button
            className="mr-4 rounded-md border-2 border-primary300 bg-primary100 px-3"
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
            className="rounded-md border-2 border-primary300 bg-primary100 px-3"
            onClick={() => {
              deletePod({ id: pod.id });
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <UserLayout>{page}</UserLayout>;
};

export default Dashboard;
