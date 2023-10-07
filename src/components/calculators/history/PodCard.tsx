import { useRouter } from "next/router";
import { useState } from "react";
import { StandardLoadingSpinner } from "~/components/shared/StandardLoadingSpinner";
import { useAppDispatch } from "~/redux/hooks";
import { HydrateSingleFamily } from "~/redux/slice/singleFamilySlice";
import type { PodInterface } from "~/server/lib/types/client";
import { api } from "~/utils/api";

export const SFHPodCard = (pod: PodInterface) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="flex flex-col items-center">
      {confirmDelete && (
        <ConfirmDelete setConfirmDelete={setConfirmDelete} pod={pod} />
      )}
      <div>
        <h3 className="text-center">{pod.address}</h3>
        <div>
          <p className="">Cash flow: ${pod.cashFlow}</p>
          <p className="">CapEx: {pod.capEx}%</p>
          <p className="">ROE: {pod.ROE}%</p>
          <p className="">ROI: {pod.ROI}%</p>
        </div>
        <div className="mt-2 flex w-full justify-around rounded-md ">
          <button
            className="rounded-md bg-darkBg300 px-3 text-white dark:bg-white dark:text-black"
            onClick={() => {
              dispatch(
                HydrateSingleFamily({
                  ...pod,
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
            className="rounded-md bg-darkBg300 px-3 text-white dark:bg-white dark:text-black"
            onClick={() => {
              setConfirmDelete(true);
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

function ConfirmDelete(props: {
  setConfirmDelete: (boolean: boolean) => void;
  pod: PodInterface;
}) {
  const ctx = api.useContext();

  const { pod, setConfirmDelete } = props;

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
    <div className="absolute flex h-full w-full items-center justify-center">
      {isDeleting ? <StandardLoadingSpinner /> : null}

      <div className="flex h-auto flex-col justify-center rounded-lg bg-primary200 p-8">
        <h1 className="text-center">Are you sure?</h1>
        <h2 className="text-center">This action cannot be undone</h2>
        <div className="mt-4 flex justify-center">
          <input
            type="button"
            value="Confirm"
            className="mr-4 rounded-md px-3"
            onClick={() => {
              deletePod({ id: pod.id });
              setConfirmDelete(false);
            }}
          />
          <input
            type="button"
            value="Cancel"
            className="rounded-md px-3"
            onClick={() => {
              setConfirmDelete(false);
            }}
          />
        </div>
      </div>
    </div>
  );
}
