import React from "react";
import { convertToNum, strNumsInput } from "../../../homeBrews/numberDisplay";
import { useAppSelector } from "~/redux/hooks";

const SFHExpensesOutputs = () => {
  const SFH = useAppSelector((state) => state.SFH);

  return (
    <div className="expenses summary">
      <div>Mortgage Payment: ${SFH.mortgagePayment}</div>
      <div>
        Operating Expenses: $
        {strNumsInput(
          convertToNum(SFH.expenses) -
            convertToNum(SFH.monthlyPayment) -
            convertToNum(SFH.capEx)
        )}
      </div>
      <br />
      <div>Fixed Costs: ${SFH.fixed}</div>
      <div>Variable Costs: ${SFH.variable}</div>
      <br />
      <div>Total Projected Expenses: ${SFH.expenses}</div>
    </div>
  );
};

export default SFHExpensesOutputs;
