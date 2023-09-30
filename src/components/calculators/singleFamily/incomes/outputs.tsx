import React from "react";
import { useAppSelector } from "~/redux/hooks";

const SFHIncomeOutputs = () => {
  const singleFamily = useAppSelector((state) => state.singleFamily);

  const len_cashFlow = singleFamily.cashFlow.length;

  return (
    <div>
      <p className="mb-1">
        <span className="mr-1 font-bold">Cash Flow:</span>
        {singleFamily.cashFlow[0] === "-"
          ? "-$" + singleFamily.cashFlow.slice(1)
          : "$" + singleFamily.cashFlow}
      </p>
      <p className="mb-1">
        <span className="mr-1 font-bold">Cap rate:</span>
        {singleFamily.capRate}%
      </p>
      <p className="mb-1">
        <span className="mr-1 font-bold">ROE:</span>
        {singleFamily.ROE}%
      </p>
      <p className="mb-1">
        <span className="mr-1 font-bold">ROI:</span>
        {singleFamily.ROI}%
      </p>
    </div>
  );
};

export default SFHIncomeOutputs;
