import React from "react";
import { rennovationReturn } from "../../../../lib/calculations";
import { convertToNum } from "../../../../lib/numberDisplay";
import { useAppSelector } from "~/redux/hooks";

const SFHAquisitionOutputs = () => {
  const singleFamily = useAppSelector((state) => state.singleFamily);

  const {
    aquisitionCosts,
    equity,
    loanBalance,
    LTV,
    ARV,
    price,
    repairs,
    rennovations,
    closingCosts,
    mortgagePayment,
    rennovationsRadio,
  } = singleFamily;
  return (
    <div className="aquisition-metrics">
      <div className="aquisition-costs">
        <span className="mr-1 font-bold">Aquisition costs:</span>$
        {aquisitionCosts}
      </div>
      <div className="equity">
        <span className="mr-1 font-bold">Equity:</span>${equity}{" "}
      </div>
      <div className="loan-balance">
        <span className="mr-1 font-bold">Loan Balance:</span>${loanBalance}
      </div>
      <div className="mortgage">
        <span className="mr-1 font-bold">Mortgage P&I:</span>$
        {mortgagePayment !== "0" && convertToNum(mortgagePayment)
          ? `${mortgagePayment}`
          : "0"}
      </div>
      <div className="ltv">
        <span className="mr-1 font-bold">LTV:</span>
        {isNaN(convertToNum(LTV)) ? 0 : LTV}
      </div>
      {rennovationsRadio ? (
        <>
          <div className="rennovations-radio">
            <span className="mr-1 font-bold">Post Renno LTV:</span>
            {convertToNum(singleFamily.rennovations) > 0 ? "0" : LTV}
          </div>
          <div className="rennovation-return">
            <span className="mr-1 font-bold">Rennovation Return:</span>$
            {rennovationReturn(
              convertToNum(ARV),
              convertToNum(price),
              convertToNum(repairs),
              convertToNum(rennovations),
              convertToNum(closingCosts)
            )}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default SFHAquisitionOutputs;
