import React from "react";
import { useAppSelector } from "~/redux/hooks";

const SFHSummaries = ({}) => {
  const { ROI, ROE, capRate } = useAppSelector((state) => state.SFH);
  return (
    <div>
      <p className="roi">ROI: {ROI && ROE ? ROI : 0}</p>
      <p className="roe">ROE: {ROE && ROE ? ROE : 0}</p>
      <p className="cap-rate">Cap Rate: {capRate && capRate ? capRate : 0}</p>
    </div>
  );
};

export default SFHSummaries;
