import React from "react";
import { useAppSelector } from "~/redux/hooks";

const SFHExpensesOutputs = () => {
  const singleFamily = useAppSelector((state) => state.singleFamily);

  return (
    <div className="expenses summary">
      <div>Mortgage payment: ${singleFamily.mortgagePayment}</div>
      <div>Inlcuding escrow: ${singleFamily.monthlyPayment}</div>
      <br />
      <div>Total projected expenses: ${singleFamily.expenses}</div>
    </div>
  );
};

export default SFHExpensesOutputs;
