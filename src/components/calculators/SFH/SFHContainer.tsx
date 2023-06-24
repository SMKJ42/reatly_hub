import React from "react";
import SFHAquisitionInputs from "./aquisition/Inputs";
import SFHAquisitionOutputs from "./aquisition/Outputs";
import SFHEXpensesInputs from "./expenses/inputs";
import SFHExpensesOutputs from "./expenses/outputs";
import SFHIncomeInputs from "./incomes/inputs";
import SFHIncomeOutputs from "./incomes/outputs";
import { resetSFH, updateAddress } from "../../../redux/slice/SFHSlice";
import { useAppDispatch } from "~/redux/hooks";

const SFHContainer = () => {
  const dispatch = useAppDispatch();

  function handleSave() {
    //TODO: do something
  }

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
              onClick={() => {
                handleSave();
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

export default SFHContainer;
