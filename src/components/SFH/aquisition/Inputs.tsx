import React from "react";
import RennovationRadio from "./RennovationRadio";
import Rennovations from "./Rennovations";
import { strNumsInput } from "../../../homeBrews/numberDisplay";
import {
  updateClosingCostsDoll,
  updateClosingCostsPerc,
  updateDownPaymentDoll,
  updateDownPaymentPerc,
  updateInterest,
  updateLoanTerm,
  updateLoanType,
  updatePrice,
  updateRepairs,
} from "../../../redux/SFHSlice";
import type { SFHInterface } from "../../../redux/SFHSlice";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";

const SFHAquisitionInputs = () => {
  const dispatch = useAppDispatch();
  const SFH: SFHInterface = useAppSelector((state) => state.SFH);

  const loanProducts = ["conventional", "fha", "va"];

  return (
    <div className="aquisition">
      <div className="price input-container">
        <label>Price: </label>
        <input
          type="text"
          value={SFH.price}
          onChange={(e) => {
            dispatch(updatePrice(strNumsInput(e.target.value, 2)));
          }}
        />
      </div>

      <div className="loan-type input-container">
        <label>
          Loan Type:
          {/* TODO: turn into drop-down modal */}
          <select
            value={SFH.loanType}
            onChange={(e) => {
              dispatch(updateLoanType(e.target.value));
            }}
          >
            {loanProducts.map((product, index) => (
              <option value={product} key={index}>
                {product}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="down-payment input-container">
        <div className="down-payment-inputs">
          <label>
            Down-Payment: $
            <input
              type="text"
              value={SFH.downPaymentDoll}
              className="dollar"
              onChange={(e) => {
                dispatch(
                  updateDownPaymentDoll(strNumsInput(e.target.value, 2))
                );
              }}
            />
            <input
              type="text"
              className="percent"
              value={SFH.downPaymentPerc}
              onChange={(e) => {
                dispatch(
                  updateDownPaymentPerc(strNumsInput(e.target.value, 3))
                );
              }}
            />
            %
          </label>
        </div>
      </div>
      <div className="interest input-container">
        <label>Interest: </label>
        <div>
          <input
            type="text"
            value={SFH.interest}
            onChange={(e) => {
              dispatch(updateInterest(strNumsInput(e.target.value, 2)));
            }}
          />
          %
        </div>
      </div>
      <div className="loan-term input-container">
        <label>Term: </label>
        <input
          type="text"
          value={SFH.loanTerm}
          onChange={(e) => {
            dispatch(updateLoanTerm(strNumsInput(e.target.value, 2)));
          }}
        />
      </div>

      <div className="closing-costs input-container">
        <div className="closing-costs-inputs">
          <label>
            Closing Costs: $
            <input
              type="text"
              value={SFH.closingCostsDoll === "0" ? "" : SFH.closingCostsDoll}
              className="dollar"
              onChange={(e) => {
                dispatch(updateClosingCostsDoll(strNumsInput(e.target.value)));
              }}
            />
            <input
              type="text"
              value={SFH.closingCostsPerc === "0" ? "" : SFH.closingCostsPerc}
              className="percent"
              onChange={(e) => {
                dispatch(updateClosingCostsPerc(strNumsInput(e.target.value)));
              }}
            />
            %
          </label>
        </div>
      </div>

      <div className="repairs input-container">
        <label>Repairs: </label>
        <input
          type="text"
          value={SFH.repairs === "0" ? "" : SFH.repairs}
          onChange={(e) => {
            dispatch(updateRepairs(strNumsInput(e.target.value, 2)));
          }}
        />
      </div>
      <RennovationRadio />
      {SFH.rennovationsRadio && <Rennovations />}
    </div>
  );
};

export default SFHAquisitionInputs;
