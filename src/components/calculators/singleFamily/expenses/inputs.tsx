import React from "react";
import { strNumsInput } from "../../../../lib/numberDisplay";
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
    <div className="grid grid-cols-2 gap-x-4 md:grid-cols-1 md:gap-0">
      <div className="taxes input-container flex-col md:flex-row">
        <label className="flex items-center" htmlFor="taxes">
          Taxes:
        </label>
        <input
          name="taxes"
          type="text"
          className="!bg-red-200"
          value={singleFamily.taxes === "0" ? "" : singleFamily.taxes}
          onChange={(e) => {
            dispatch(updateTaxes(strNumsInput(e.target.value)));
          }}
        />
      </div>
      <div className="insurance input-container flex-col md:flex-row">
        <label className="flex items-center" htmlFor="insurance">
          Insurance
        </label>
        <input
          name="insurance"
          type="text"
          className="!bg-red-200"
          value={singleFamily.insurance === "0" ? "" : singleFamily.insurance}
          onChange={(e) => {
            dispatch(updateInsurance(strNumsInput(e.target.value)));
          }}
        />
      </div>
      <div className="hoa input-container flex-col md:flex-row">
        <label className="flex items-center" htmlFor="hoa">
          HOA:
        </label>
        <input
          name="hoa"
          type="text"
          className="!bg-red-200"
          value={singleFamily.hoa === "0" ? "" : singleFamily.hoa}
          onChange={(e) => {
            dispatch(updateHOA(strNumsInput(e.target.value)));
          }}
        />
      </div>
      <div className="vacancy input-container flex-col md:flex-row">
        <label className="flex items-center" htmlFor="vacancy">
          Vacancy:
        </label>
        <input
          name="vacancy"
          type="text"
          className="!bg-red-200"
          value={singleFamily.vacancy === "0" ? "" : singleFamily.vacancy}
          onChange={(e) => {
            dispatch(updateVacancy(strNumsInput(e.target.value)));
          }}
        />
      </div>
      <div className="cap-ex input-container flex-col md:flex-row">
        <label className="flex items-center" htmlFor="cap-ex">
          Cap-Ex:
        </label>
        <input
          name="cap-ex"
          type="text"
          className="!bg-red-200"
          value={singleFamily.capEx === "0" ? "" : singleFamily.capEx}
          onChange={(e) => {
            dispatch(updateCapex(strNumsInput(e.target.value)));
          }}
        />
      </div>
      <div className="management input-container flex-col md:flex-row">
        <label className="flex items-center" htmlFor="management">
          Management:
        </label>
        <input
          name="management"
          type="text"
          className="!bg-red-200"
          value={singleFamily.management === "0" ? "" : singleFamily.management}
          onChange={(e) => {
            dispatch(updateManagement(strNumsInput(e.target.value)));
          }}
        />
      </div>
      <div className="maintenance input-container flex-col md:flex-row">
        <label className="flex items-center" htmlFor="maintenance">
          Maintenance:
        </label>
        <input
          name="maintenance"
          type="text"
          className="!bg-red-200"
          value={
            singleFamily.maintenance === "0" ? "" : singleFamily.maintenance
          }
          onChange={(e) => {
            dispatch(updateMaintenance(strNumsInput(e.target.value)));
          }}
        />
      </div>
      <div className="other input-container flex-col md:flex-row">
        <label className="flex items-center" htmlFor="other">
          Other expenses:
        </label>
        <input
          name="other"
          type="text"
          className="!bg-red-200"
          value={singleFamily.expOther === "0" ? "" : singleFamily.expOther}
          onChange={(e) => {
            dispatch(updateExpOther(strNumsInput(e.target.value)));
          }}
        />
      </div>
    </div>
  );
};

export default SFHEXpensesInputs;
