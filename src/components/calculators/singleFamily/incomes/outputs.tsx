import React from "react";
import { useAppSelector } from "~/redux/hooks";

const SFHIncomeOutputs = () => {
  const singleFamily = useAppSelector((state) => state.singleFamily);

  return (
    <div>
      <p>Cash Flow: ${singleFamily.cashFlow}</p>
      <p>Cap rate: {singleFamily.capRate}%</p>
      <p>ROE: {singleFamily.ROE}%</p>
      <p>ROI: {singleFamily.ROI}%</p>
    </div>
  );
};

export default SFHIncomeOutputs;
