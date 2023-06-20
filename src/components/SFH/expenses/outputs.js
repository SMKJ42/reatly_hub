import React from "react";

import { useDispatch, useSelector } from "react-redux";
import {
  convertToNum,
  strNumsInput,
} from "../../../app/homeBrews/numberDisplay";

const SFHExpensesOutputs = () => {
  const SFH = useSelector((state) => state.SFH);

  return (
    <div className="expenses summary">
      <div>Mortgage Payment: ${SFH.monthlyPayment}</div>
      <div>
        Operating Expenses: $
        {strNumsInput(
          convertToNum(SFH.expenses) -
            convertToNum(SFH.monthlyPayment) -
            convertToNum(SFH.capEx)
        )}
      </div>
      <div>Total Projected Expenses: ${SFH.expenses}</div>
    </div>
  );
};

export default SFHExpensesOutputs;
