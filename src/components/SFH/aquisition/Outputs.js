import React from "react";
import { useContext } from "react";
import { rennovationReturn } from "../../../app/homeBrews/calculations";
import { useDispatch, useSelector } from "react-redux";
import { convertToNum } from "../../../app/homeBrews/numberDisplay";

const SFHAquisitionOutputs = () => {
  const dispatch = useDispatch();
  const SFH = useSelector((state) => state.SFH);

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
  } = SFH;

  return (
    <div className="aquisition-metrics">
      <div className="aquisition-costs">
        Aquisition costs: ${aquisitionCosts}
      </div>
      <div className="equity">Equity: ${equity} </div>
      <div className="loan-balance">Loan Balance: ${loanBalance}</div>
      <div className="mortgage">
        Mortgage P&I:
        {console.log(mortgagePayment)}
        {mortgagePayment !== "0" && isFinite(convertToNum(mortgagePayment))
          ? `$${mortgagePayment}`
          : "Too much -- trust me bro"}
      </div>
      <div className="ltv">LTV : {isNaN(LTV) ? 0 : LTV}</div>
      {SFH.rennovationsRadio ? (
        <>
          <div className="rennovations-radio">
            Post Renno LTV: {SFH.rennovations > 0 ? "hi" : LTV}
          </div>
          <div className="rennovation-return">
            Rennovation Return: $
            {rennovationReturn(ARV, price, repairs, rennovations, closingCosts)}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default SFHAquisitionOutputs;
