import { useState, type ReactElement } from "react";
import UserLayout from "../../../components/layouts/UserLayout";
import type { NextPageWithLayout } from "../../_app";
import { useAppDispatch, useAppSelector } from "~/redux/hooks";
import {
  resetSFH,
  updateAddress,
  updateId,
} from "~/redux/slice/singleFamilySlice";
import SFHAquisitionInputs from "~/components/calculators/singleFamily/aquisition/Inputs";
import SFHAquisitionOutputs from "~/components/calculators/singleFamily/aquisition/Outputs";
import SFHEXpensesInputs from "~/components/calculators/singleFamily/expenses/inputs";
import SFHExpensesOutputs from "~/components/calculators/singleFamily/expenses/outputs";
import SFHIncomeInputs from "~/components/calculators/singleFamily/incomes/inputs";
import SFHIncomeOutputs from "~/components/calculators/singleFamily/incomes/outputs";
import { api } from "~/utils/api";
import { getSFHSubmit } from "~/components/calculators/singleFamily/getSFSubmit";
import { useRouter } from "next/router";

const SingleFamilyCalc: NextPageWithLayout = () => {
  const dispatch = useAppDispatch();
  const ctx = api.useContext();

  const id = useAppSelector((state) => state.singleFamily?.id);
  const address = useAppSelector((state) => state.singleFamily?.address);

  const [success, setSuccess] = useState(false);

  const { mutate: create, isLoading: isSaving } =
    api.singleFamily.create.useMutation({
      onSuccess: (opts) => {
        console.log(opts);
        dispatch(resetSFH());
        dispatch(updateId(opts.id));
        setSuccess(true);
      },
      onError: (error) => {
        console.log(error);
      },
    });

  const { mutate: update, isLoading: isUpdating } =
    api.singleFamily.update.useMutation({
      onSuccess: () => {
        dispatch(resetSFH());
        setSuccess(true);
        void ctx.singleFamily.getAll.invalidate();
      },
      onError: (error) => {
        console.log(error);
      },
    });

  function handlePDF() {
    //TODO: do something
  }

  return (
    <div>
      {success && <Success setSuccess={setSuccess} />}
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className="deal-analysis">
          <div className="address flex justify-center py-2">
            <label className="mx-4">Address:</label>
            <input
              value={address}
              type="text"
              className="mx-4"
              onChange={(e) => {
                dispatch(updateAddress(e.target.value));
              }}
            />
          </div>
          <div className="aquisition-container container grid grid-cols-2 justify-center gap-20">
            <SFHAquisitionInputs />
            <SFHAquisitionOutputs />
          </div>
          <div className="expenses-container container grid grid-cols-2 justify-center gap-20">
            <SFHEXpensesInputs />
            <SFHExpensesOutputs />
          </div>
          <div className="income-container container grid grid-cols-2 justify-center gap-20">
            <SFHIncomeInputs />
            <SFHIncomeOutputs />
          </div>
          <div className="button-container w-100 flex justify-center">
            <input
              type="button"
              value={id ? "update" : "save"}
              className="SFH-submit-button"
              disabled={isSaving || isUpdating}
              onClick={() => {
                console.log("firing click");
                if (isSaving || isUpdating) return;
                if (!id) {
                  console.log("creating");
                  create({ ...getSFHSubmit() });
                } else if (typeof id === "string") {
                  console.log("updating");
                  update({ ...getSFHSubmit(), id });
                }
              }}
            />
            <input
              type="button"
              value="reset"
              className="SFH-submit-button"
              onClick={() => {
                dispatch(resetSFH());
              }}
            />
            <input
              type="button"
              value="PDF"
              className="PDF-download"
              onClick={() => {
                handlePDF();
              }}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

type SuccessProps = {
  setSuccess: (boolean: boolean) => void;
};

function Success(props: SuccessProps) {
  const { setSuccess } = props;
  const router = useRouter();
  return (
    <div className="absolute flex h-full w-full items-center justify-center">
      <div className="flex h-auto flex-col justify-center rounded-lg bg-primary200 p-8">
        <h1 className="text-center">Success!</h1>
        <h2 className="text-center">Your deal has been saved</h2>
        <div className="mt-4 flex justify-center">
          <input
            type="button"
            value="History"
            className="mr-4 rounded-md px-3"
            onClick={() => {
              void router.push("/user/calculators/history");
            }}
          />
          <input
            type="button"
            value="Dismiss"
            className="rounded-md px-3"
            onClick={() => {
              setSuccess(false);
            }}
          />
        </div>
      </div>
    </div>
  );
}

SingleFamilyCalc.getLayout = function getLayout(page: ReactElement) {
  return <UserLayout>{page}</UserLayout>;
};

export default SingleFamilyCalc;
