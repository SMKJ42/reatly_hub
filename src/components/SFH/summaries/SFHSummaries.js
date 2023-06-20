import React from "react";
import { useDispatch, useSelector } from "react-redux";

const SFHSummaries = ({}) => {
  const dispatch = useDispatch();
  const SFH = useSelector((state) => state.SFH);
  return (
    <div>
      {/* <p className="roi">ROI: {ROI && ROE ? ROI : 0}</p> */}
      {/* <p className="roe">ROE: {ROE && ROE ? ROE : 0}</p> */}
      {/* <p className="cap-rate">Cap Rate: {capRate && capRate ? capRate : 0}</p> */}
    </div>
  );
};

export default SFHSummaries;
