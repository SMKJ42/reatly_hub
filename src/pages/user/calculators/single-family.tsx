import { type ReactElement } from "react";
import UserLayout from "../../../components/layouts/UserLayout";
import type { NextPageWithLayout } from "../../_app";
import { useAppDispatch, useAppSelector } from "~/redux/hooks";
import { resetSFH, updateAddress } from "~/redux/slice/singleFamilySlice";
import SFHAquisitionInputs from "~/components/calculators/singleFamily/aquisition/Inputs";
import SFHAquisitionOutputs from "~/components/calculators/singleFamily/aquisition/Outputs";
import SFHEXpensesInputs from "~/components/calculators/singleFamily/expenses/inputs";
import SFHExpensesOutputs from "~/components/calculators/singleFamily/expenses/outputs";
import SFHIncomeInputs from "~/components/calculators/singleFamily/incomes/inputs";
import SFHIncomeOutputs from "~/components/calculators/singleFamily/incomes/outputs";
import { api } from "~/utils/api";
import { getSFHSubmit } from "~/components/calculators/singleFamily/getSFSubmit";

const SingleFamilyCalc: NextPageWithLayout = () => {
  const dispatch = useAppDispatch();

  const ctx = api.useContext();

  const id = useAppSelector((state) => state.singleFamily?.id);
  const address = useAppSelector((state) => state.singleFamily?.address);

  const { mutate: create, isLoading: isSaving } =
    api.singleFamily.create.useMutation({
      onSuccess: () => {
        console.log("success");
        resetSFH();
        void ctx.singleFamily.getAll.invalidate();
      },
      onError: (error) => {
        console.log(error);
      },
    });

  const { mutate: update, isLoading: isUpdating } =
    api.singleFamily.update.useMutation({
      onSuccess: () => {
        console.log("success");
        resetSFH();
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

SingleFamilyCalc.getLayout = function getLayout(page: ReactElement) {
  return <UserLayout>{page}</UserLayout>;
};

export default SingleFamilyCalc;
