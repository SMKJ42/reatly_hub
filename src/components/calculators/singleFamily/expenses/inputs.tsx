import React from "react";
import { strNumsInput } from "../../../../homeBrews/numberDisplay";
import {
  updateCapex,
  updateExpOther,
  updateHOA,
  updateInsurance,
  updateMaintenance,
  updateManagement,
  updateTaxes,
  updateVacancy,
} from "../../../../redux/slice/singleFamilySlice";
import { useAppDispatch, useAppSelector } from "~/redux/hooks";

const SFHEXpensesInputs = () => {
  const dispatch = useAppDispatch();
  const singleFamily = useAppSelector((state) => state.singleFamily);

  return (
    <div className="expenses">
      <div className="taxes input-container">
        <label className="flex items-center">Taxes: </label>
        <input
          type="text"
          value={singleFamily.taxes === "0" ? "" : singleFamily.taxes}
          onChange={(e) => {
            dispatch(updateTaxes(strNumsInput(e.target.value, 2)));
          }}
        />
      </div>
      <div className="insurance input-container">
        <label className="flex items-center">Insurance</label>
        <input
          type="text"
          value={singleFamily.insurance === "0" ? "" : singleFamily.insurance}
          onChange={(e) => {
            dispatch(updateInsurance(strNumsInput(e.target.value, 2)));
          }}
        />
      </div>
      <div className="hoa input-container">
        <label className="flex items-center">HOA: </label>
        <input
          type="text"
          value={singleFamily.hoa === "0" ? "" : singleFamily.hoa}
          onChange={(e) => {
            dispatch(updateHOA(strNumsInput(e.target.value, 2)));
          }}
        />
      </div>
      <div className="vacancy input-container">
        <label className="flex items-center">Vacancy: </label>
        <input
          type="text"
          value={singleFamily.vacancy === "0" ? "" : singleFamily.vacancy}
          onChange={(e) => {
            dispatch(updateVacancy(strNumsInput(e.target.value, 2)));
          }}
        />
      </div>
      <div className="cap-ex input-container">
        <label className="flex items-center">Cap-Ex: </label>
        <input
          type="text"
          value={singleFamily.capEx === "0" ? "" : singleFamily.capEx}
          onChange={(e) => {
            dispatch(updateCapex(strNumsInput(e.target.value, 2)));
          }}
        />
      </div>
      <div className="management input-container">
        <label className="flex items-center">Management: </label>
        <input
          type="text"
          value={singleFamily.management === "0" ? "" : singleFamily.management}
          onChange={(e) => {
            dispatch(updateManagement(strNumsInput(e.target.value, 2)));
          }}
        />
      </div>
      <div className="maintenance input-container">
        <label className="flex items-center">Maintenance: </label>
        <input
          type="text"
          value={
            singleFamily.maintenance === "0" ? "" : singleFamily.maintenance
          }
          onChange={(e) => {
            dispatch(updateMaintenance(strNumsInput(e.target.value, 2)));
          }}
        />
      </div>
      <div className="other input-container">
        <label className="flex items-center">Other expenses: </label>
        <input
          type="text"
          value={singleFamily.expOther === "0" ? "" : singleFamily.expOther}
          onChange={(e) => {
            dispatch(updateExpOther(strNumsInput(e.target.value, 2)));
          }}
        />
      </div>
    </div>
  );
};

export default SFHEXpensesInputs;
