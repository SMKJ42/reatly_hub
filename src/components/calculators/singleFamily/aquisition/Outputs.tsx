import React from "react";
import { rennovationReturn } from "../../../../homeBrews/calculations";
import { convertToNum } from "../../../../homeBrews/numberDisplay";
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
        Aquisition costs: ${aquisitionCosts}
      </div>
      <div className="equity">Equity: ${equity} </div>
      <div className="loan-balance">Loan Balance: ${loanBalance}</div>
      <div className="mortgage">
        Mortgage P&I: $
        {mortgagePayment !== "0" && convertToNum(mortgagePayment)
          ? `${mortgagePayment}`
          : "0"}
      </div>
      <div className="ltv">LTV : {isNaN(convertToNum(LTV)) ? 0 : LTV}</div>
      {rennovationsRadio ? (
        <>
          <div className="rennovations-radio">
            Post Renno LTV:
            {convertToNum(singleFamily.rennovations) > 0 ? "0" : LTV}
          </div>
          <div className="rennovation-return">
            Rennovation Return: $
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
