import React from "react";
// import { rennovationReturn } from "../../../../lib/calculations";
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
    <div className="aquisition-metrics mt-2">
      <p className="my-1 md:mt-0">
        <span className="mr-1 font-bold">Aquisition costs:</span>$
        {aquisitionCosts}
      </p>
      <p className="mb-1">
        <span className="mr-1 font-bold">Equity:</span>${equity}{" "}
      </p>
      <p className="mb-1">
        <span className="mr-1 font-bold">Loan Balance:</span>${loanBalance}
      </p>
      <p className="mb-1">
        <span className="mr-1 font-bold">Mortgage P&I:</span>$
        {mortgagePayment !== "0" && convertToNum(mortgagePayment)
          ? `${mortgagePayment}`
          : "0"}
      </p>
      <p className="mb-1">
        <span className="mr-1 font-bold">LTV:</span>
        {isNaN(convertToNum(LTV)) ? 0 : LTV}
      </p>
      {rennovationsRadio ? (
        <>
          <p className="mb-1">
            <span className="mr-1 font-bold">Post Renno LTV:</span>
            {convertToNum(singleFamily.rennovations) > 0 ? "0" : LTV}
          </p>
          <p className="mb-1">
            <span className="mr-1 font-bold">Rennovation Return:</span>$
            {/* {rennovationReturn(
              convertToNum(ARV),
              convertToNum(price),
              convertToNum(repairs),
              convertToNum(rennovations),
              convertToNum(closingCosts)
            )} */}
          </p>
        </>
      ) : null}
    </div>
  );
};

export default SFHAquisitionOutputs;
