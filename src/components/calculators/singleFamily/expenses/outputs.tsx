import React from "react";
import { useAppSelector } from "~/redux/hooks";

const SFHExpensesOutputs = () => {
  const singleFamily = useAppSelector((state) => state.singleFamily);

  return (
    <div className="expenses summary">
      <div>Monthly payment: ${singleFamily.monthlyPayment}</div>
      <div>Total monthly expenses: ${singleFamily.expenses}</div>
    </div>
  );
};

export default SFHExpensesOutputs;
