import React from "react";
import {
  convertToNum,
  strNumsInput,
} from "../../../../homeBrews/numberDisplay";
import { useAppSelector } from "~/redux/hooks";

const SFHExpensesOutputs = () => {
  const SFH = useAppSelector((state) => state.SFH);

  return (
    <div className="expenses summary">
      <div>Mortgage payment: ${SFH.mortgagePayment}</div>
      <div>Inlcuding escrow: ${SFH.monthlyPayment}</div>
      <br />
      <div>Total projected expenses: ${SFH.expenses}</div>
    </div>
  );
};

export default SFHExpensesOutputs;
