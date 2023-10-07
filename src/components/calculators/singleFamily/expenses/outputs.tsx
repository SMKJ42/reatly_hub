import React from "react";
import { useAppSelector } from "~/redux/hooks";

const SFHExpensesOutputs = () => {
  const singleFamily = useAppSelector((state) => state.singleFamily);

  return (
    <div className="expenses summary mt-2">
      <p className="my-1 md:mt-0">
        <span className="mr-1 font-bold">Monthly payment:</span>$
        {singleFamily.monthlyPayment}
      </p>

      <p className="mb-1">
        <span className="mr-1 font-bold">Total monthly expenses:</span>$
        {singleFamily.expenses}
      </p>
    </div>
  );
};

export default SFHExpensesOutputs;
