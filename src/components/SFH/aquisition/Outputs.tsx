import React, { useEffect } from "react";
import { rennovationReturn } from "../../../homeBrews/calculations";
import { convertToNum } from "../../../homeBrews/numberDisplay";
import { useAppSelector } from "~/redux/hooks";

const SFHAquisitionOutputs = () => {
  const SFH = useAppSelector((state) => state.SFH);

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
  } = SFH;

  console.log(rennovationsRadio);

  return (
    <div className="aquisition-metrics">
      <div className="aquisition-costs">
        Aquisition costs: ${aquisitionCosts}
      </div>
      <div className="equity">Equity: ${equity} </div>
      <div className="loan-balance">Loan Balance: ${loanBalance}</div>
      <div className="mortgage">
        Mortgage P&I:
        {mortgagePayment !== "0" && convertToNum(mortgagePayment)
          ? `$${mortgagePayment}`
          : "0"}
      </div>
      <div className="ltv">LTV : {isNaN(parseInt(LTV)) ? 0 : LTV}</div>
      {rennovationsRadio ? (
        <>
          <div className="rennovations-radio">
            Post Renno LTV: {parseInt(SFH.rennovations) > 0 ? "0" : LTV}
          </div>
          <div className="rennovation-return">
            Rennovation Return: $
            {rennovationReturn(
              parseInt(ARV),
              parseInt(price),
              parseInt(repairs),
              parseInt(rennovations),
              parseInt(closingCosts)
            )}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default SFHAquisitionOutputs;
