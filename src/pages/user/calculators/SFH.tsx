import type { ReactElement } from "react";
import UserLayout from "../../../components/layouts/UserLayout";
import type { NextPageWithLayout } from "../../_app";
import { useAppDispatch } from "~/redux/hooks";
import { resetSFH, updateAddress } from "~/redux/slice/SFHSlice";
import SFHAquisitionInputs from "~/components/calculators/sFH/aquisition/Inputs";
import SFHAquisitionOutputs from "~/components/calculators/sFH/aquisition/Outputs";
import SFHEXpensesInputs from "~/components/calculators/sFH/expenses/inputs";
import SFHExpensesOutputs from "~/components/calculators/sFH/expenses/outputs";
import SFHIncomeInputs from "~/components/calculators/sFH/incomes/inputs";
import SFHIncomeOutputs from "~/components/calculators/sFH/incomes/outputs";
import { useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";
import { getSFHSubmit } from "~/components/calculators/sFH/getSFHSubmit";

const Dashboard: NextPageWithLayout = () => {
  const dispatch = useAppDispatch();

  const ctx = api.useContext();

  const { mutate, isLoading: isSaving } = api.sFH.create.useMutation({
    onSuccess: () => {
      console.log("success");
      resetSFH();
      void ctx.sFH.getAll.invalidate();
    },
    onError: (error) => {
      console.log("failed");
    },
  });

  function handlePDF() {
    //TODO: do something
  }

  function handleReset() {
    dispatch(resetSFH());
  }

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className="deal-analysis">
          <div className="address">
            <label>Address:</label>
            <input
              type="text"
              onChange={(e) => {
                dispatch(updateAddress(e.target.value));
              }}
            />
          </div>
          <h2>Aquisition</h2>
          <div className="aquisition-container container grid grid-cols-2 justify-center gap-20">
            <SFHAquisitionInputs />
            <SFHAquisitionOutputs />
          </div>
          <h2>Expenses</h2>
          <div className="expenses-container container grid grid-cols-2 justify-center gap-20">
            <SFHEXpensesInputs />
            <SFHExpensesOutputs />
          </div>
          <h2>Incomes</h2>
          <div className="income-container container grid grid-cols-2 justify-center gap-20">
            <SFHIncomeInputs />
            <SFHIncomeOutputs />
          </div>
          <div className="button-container w-100 flex justify-center">
            <input
              type="button"
              value="save"
              className="SFH-submit-button"
              disabled={isSaving}
              onClick={() => {
                mutate({ ...getSFHSubmit() });
              }}
            />
            <input
              type="button"
              value="reset"
              className="SFH-submit-button"
              onClick={() => {
                handleReset();
              }}
            />
            <input
              type="button"
              value="PDF"
              className="PDF-download"
              onClick={(e) => {
                e.preventDefault();
                handlePDF();
              }}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <UserLayout>{page}</UserLayout>;
};

export default Dashboard;
