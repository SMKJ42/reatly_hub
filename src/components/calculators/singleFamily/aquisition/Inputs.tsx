import React, { useState } from "react";
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
import { type mortgageRates } from "@prisma/client";
import { mortgageCitation } from "public/Citation";
import { monthNumToString } from "~/homeBrews/dateFormatter/month";

const SFHAquisitionInputs = (props: {
  loanProducts: mortgageRates[] | undefined;
}) => {
  const dispatch = useAppDispatch();
  const singleFamily: singleFamilyInterface = useAppSelector(
    (state) => state.singleFamily
  );

  const { loanProducts } = props;

  type nullishString = string | null;

  const [mortgageObject, setMortgageObject] = useState({
    name: null as nullishString,
    code: null as nullishString,
    updatedAt: null as nullishString,
  });

  function getMortgageObject() {
    const selectedType = loanProducts?.find(
      (product) => product.name === singleFamily.loanType
    );
    if (selectedType) {
      const day = selectedType.updatedAt.getDate();
      const month = monthNumToString(selectedType.updatedAt.getMonth());
      const year = selectedType.updatedAt.getFullYear();
      setMortgageObject({
        name: selectedType.name,
        code: selectedType.code,
        updatedAt: `${month} ${day}, ${year}`,
      });
    }
  }

  return (
    <div className="aquisition">
      <div className="price input-container">
        <label className="flex items-center">Purchase price: </label>
        <input
          type="text"
          value={singleFamily.price}
          onChange={(e) => {
            dispatch(updatePrice(strNumsInput(e.target.value)));
          }}
        />
      </div>

      <div className="loan-type input-container ">
        <label
          className="flex w-full justify-between"
          onMouseLeave={() =>
            setMortgageObject({ code: null, name: null, updatedAt: null })
          }
        >
          Loan Type:
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-4 w-4 shrink-0"
            onMouseEnter={() => getMortgageObject()}
          >
            <path
              fillRule="evenodd"
              d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
              clipRule="evenodd"
            />
          </svg>
          {mortgageObject.code !== null && (
            <div className="mortgage-citation absolute m-6 w-3/5 bg-bg100 text-black">
              <p className="whitespace-normal">
                {mortgageCitation(
                  mortgageObject.name ?? "",
                  mortgageObject.code ?? "",
                  mortgageObject.updatedAt ?? ""
                )}
              </p>
            </div>
          )}
          <select
            value={singleFamily.loanType}
            className="flex w-3/5"
            onChange={(e) => {
              dispatch(updateLoanType(e.target.value));
              const interest = loanProducts?.find(
                (product) => product.name === e.target.value
              )?.rate as number;
              const term = e.target.value.includes("15") ? "15" : "30";
              dispatch(updateLoanTerm(term));
              dispatch(updateInterest(strNumsInput(interest)));
            }}
          >
            {loanProducts?.map((product) => (
              <option key={product.code} value={product.name}>
                {product.name}
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
                dispatch(updateDownPaymentDoll(strNumsInput(e.target.value)));
              }}
            />
            <input
              type="text"
              className="percent"
              value={singleFamily.downPaymentPerc}
              onChange={(e) => {
                if (convertToNum(e.target.value) <= 100) {
                  dispatch(updateDownPaymentPerc(strNumsInput(e.target.value)));
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
        <label className="flex items-center">Interest:</label>
        <div>
          <input
            type="text"
            value={singleFamily.interest}
            onChange={(e) => {
              dispatch(updateInterest(strNumsInput(e.target.value)));
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
            dispatch(updateLoanTerm(strNumsInput(e.target.value)));
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
            dispatch(updateRepairs(strNumsInput(e.target.value)));
          }}
        />
      </div>

      <RennovationRadio />
      {singleFamily.rennovationsRadio && <Rennovations />}
    </div>
  );
};

export default SFHAquisitionInputs;
