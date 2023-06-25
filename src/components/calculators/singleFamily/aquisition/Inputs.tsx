import React from "react";
import RennovationRadio from "./RennovationRadio";
import Rennovations from "./Rennovations";
import {
  convertToNum,
  strNumsInput,
} from "../../../../homeBrews/numberDisplay";
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
} from "../../../../redux/slice/singleFamilySlice";
import type { singleFamilyInterface } from "../../../../redux/slice/singleFamilySlice";
import { useAppDispatch, useAppSelector } from "../../../../redux/hooks";

const SFHAquisitionInputs = () => {
  const dispatch = useAppDispatch();
  const singleFamily: singleFamilyInterface = useAppSelector(
    (state) => state.singleFamily
  );

  const loanProducts = ["conventional", "fha", "va"];

  return (
    <div className="aquisition">
      <div className="price input-container">
        <label className="flex items-center">Purchase price: </label>
        <input
          type="text"
          value={singleFamily.price}
          onChange={(e) => {
            dispatch(updatePrice(strNumsInput(e.target.value, 2)));
          }}
        />
      </div>

      <div className="loan-type input-container ">
        <label className="flex w-full justify-between">
          Loan Type:
          {/* TODO: turn into drop-down modal */}
          <select
            value={singleFamily.loanType}
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
          <label className="flex w-full items-center justify-between">
            Down payment: $
            <input
              type="text"
              value={singleFamily.downPaymentDoll}
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
              value={singleFamily.downPaymentPerc}
              onChange={(e) => {
                if (convertToNum(e.target.value) <= 100) {
                  dispatch(
                    updateDownPaymentPerc(strNumsInput(e.target.value, 3))
                  );
                } else {
                  e.target.value = "100";
                }
              }}
            />
            %
          </label>
        </div>
      </div>
      <div className="interest input-container">
        <label className="flex items-center">Interest: </label>
        <div>
          <input
            type="text"
            value={singleFamily.interest}
            onChange={(e) => {
              dispatch(updateInterest(strNumsInput(e.target.value, 2)));
            }}
          />
          %
        </div>
      </div>
      <div className="loan-term input-container">
        <label className="flex items-center">Term: </label>
        <input
          type="text"
          value={singleFamily.loanTerm}
          onChange={(e) => {
            dispatch(updateLoanTerm(strNumsInput(e.target.value, 2)));
          }}
        />
      </div>

      <div className="closing-costs input-container">
        <div className="closing-costs-inputs">
          <label className="flex w-full items-center justify-between">
            Closing costs: $
            <input
              type="text"
              value={
                singleFamily.closingCostsDoll === "0"
                  ? ""
                  : singleFamily.closingCostsDoll
              }
              className="dollar"
              onChange={(e) => {
                dispatch(updateClosingCostsDoll(strNumsInput(e.target.value)));
              }}
            />
            <input
              type="text"
              value={
                singleFamily.closingCostsPerc === "0"
                  ? ""
                  : singleFamily.closingCostsPerc
              }
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
        <label className="flex items-center">Repairs: </label>
        <input
          type="text"
          value={singleFamily.repairs === "0" ? "" : singleFamily.repairs}
          onChange={(e) => {
            dispatch(updateRepairs(strNumsInput(e.target.value, 2)));
          }}
        />
      </div>

      <RennovationRadio />
      {singleFamily.rennovationsRadio && <Rennovations />}
    </div>
  );
};

export default SFHAquisitionInputs;
