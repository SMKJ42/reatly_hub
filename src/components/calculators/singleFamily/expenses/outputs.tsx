import React from "react";
import { useAppSelector } from "~/redux/hooks";

const SFHExpensesOutputs = () => {
  const singleFamily = useAppSelector((state) => state.singleFamily);

  return (
    <div className="expenses summary">
      <div>
        <span className="mr-1 font-bold">Monthly payment:</span>$
        {singleFamily.monthlyPayment}
      </div>

      <div>
        <span className="mr-1 font-bold">Total monthly expenses:</span>$
        {singleFamily.expenses}
      </div>
    </div>
  );
};

export default SFHExpensesOutputs;
