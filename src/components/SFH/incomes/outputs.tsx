import React from "react";
import { useAppSelector } from "~/redux/hooks";

const SFHIncomeOutputs = () => {
  const SFH = useAppSelector((state) => state.SFH);

  console.log(SFH.cashFlow);

  return (
    <div>
      <p>Cash Flow: {SFH.cashFlow}</p>
      <p>Cap rate: {SFH.capRate} %</p>
      <p>ROE: {SFH.ROE} %</p>
      <p>ROI: {SFH.ROI} %</p>
    </div>
  );
};

export default SFHIncomeOutputs;
