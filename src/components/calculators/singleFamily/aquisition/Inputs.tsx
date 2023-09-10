import React, { useState } from "react";
import RennovationRadio from "./RennovationRadio";
import Rennovations from "./Rennovations";
import { convertToNum, strNumsInput } from "../../../../lib/numberDisplay";
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
import { monthNumToString } from "~/lib/dateFormatter/month";

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

  //this is for the display on the mortgage citation
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
    <div>
      <div className="price input-container">
        <label className="flex items-center">Purchase price: </label>
        <div className="flex items-center">
          <p className="rounded-l-sm bg-bg200 px-1 py-px text-black">$</p>
          <input
            type="text"
            value={singleFamily.price}
            onChange={(e) => {
              dispatch(updatePrice(strNumsInput(e.target.value)));
            }}
            className="rounded-l-none"
          />
        </div>
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
      <div className="down-payment mt-2 flex w-full items-center">
        <label className="mr-4 whitespace-nowrap">Down payment:</label>
        <div className="flex justify-between">
          <div className="flex">
            <p className="rounded-l-sm bg-bg200 px-1 py-px text-black">$</p>
            <input
              type="text"
              value={singleFamily.downPaymentDoll}
              className="w-[120%] rounded-l-none"
              onChange={(e) => {
                dispatch(updateDownPaymentDoll(strNumsInput(e.target.value)));
              }}
            />
          </div>
          <div className="flex justify-end">
            <input
              type="text"
              className="w-5/12 rounded-r-none"
              value={singleFamily.downPaymentPerc}
              onChange={(e) => {
                if (convertToNum(e.target.value) <= 100) {
                  dispatch(updateDownPaymentPerc(strNumsInput(e.target.value)));
                } else {
                  e.target.value = "100";
                }
              }}
            />
            <p className="w-fit rounded-r-sm bg-bg200 px-1 py-px text-black">
              %
            </p>
          </div>
        </div>
      </div>
      <div className="interest input-container">
        <label className="flex items-center">Interest:</label>
        <div className="flex items-center">
          <input
            type="text"
            value={singleFamily.interest}
            className="rounded-r-none"
            onChange={(e) => {
              dispatch(updateInterest(strNumsInput(e.target.value)));
            }}
          />
          <p className="rounded-r-sm bg-bg200 px-1 py-px text-black">%</p>
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

      <div className="closing-costs mt-2 flex w-full items-center">
        <label className="mr-4 whitespace-nowrap">Closing costs:</label>
        <div className="flex justify-between">
          <div className="flex">
            <p className="rounded-l-sm bg-bg200 px-1 py-px text-black">$</p>
            <input
              type="text"
              value={
                singleFamily.closingCostsDoll === "0"
                  ? ""
                  : singleFamily.closingCostsDoll
              }
              className="w-[120%] rounded-l-none"
              onChange={(e) => {
                dispatch(updateClosingCostsDoll(strNumsInput(e.target.value)));
              }}
            />
          </div>
          <div className="flex justify-end">
            <input
              type="text"
              value={
                singleFamily.closingCostsPerc === "0"
                  ? ""
                  : singleFamily.closingCostsPerc
              }
              className="w-5/12 rounded-r-none"
              onChange={(e) => {
                dispatch(updateClosingCostsPerc(strNumsInput(e.target.value)));
              }}
            />
            <p className="w-fit rounded-r-sm bg-bg200 px-1 py-px text-black">
              %
            </p>
          </div>
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
