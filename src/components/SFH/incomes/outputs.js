import React, { useContext, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

const SFHIncomeOutputs = () => {
  const dispatch = useDispatch();
  const SFH = useSelector((state) => state.SFH);

  return (
    <div>
      <p>Cash Flow: {SFH.cashFlow}</p>
      <p>Cap rate:* {SFH.capRate} %</p>
      <p>ROE:* {SFH.ROE}</p>
      <p>ROI:* {SFH.ROI}</p>
    </div>
  );
};

export default SFHIncomeOutputs;
