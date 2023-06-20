import React from "react";
import { strNumsInput } from "../../../homeBrews/numberDisplay";
import {
  updateCapex,
  updateExpOther,
  updateHOA,
  updateInsurance,
  updateMaintenance,
  updateManagement,
  updateTaxes,
  updateVacancy,
} from "../../../redux/SFHSlice";
import { useAppDispatch, useAppSelector } from "~/redux/hooks";

const SFHEXpensesInputs = () => {
  const dispatch = useAppDispatch();
  const SFH = useAppSelector((state) => state.SFH);

  return (
    <div className="expenses">
      <div className="taxes input-container">
        <label>Taxes: </label>
        <input
          type="text"
          value={SFH.taxes === "0" ? "" : SFH.taxes}
          onChange={(e) => {
            dispatch(updateTaxes(strNumsInput(e.target.value, 2)));
          }}
        />
      </div>
      <div className="insurance input-container">
        <label>Insurance</label>
        <input
          type="text"
          value={SFH.insurance === "0" ? "" : SFH.insurance}
          onChange={(e) => {
            dispatch(updateInsurance(strNumsInput(e.target.value, 2)));
          }}
        />
      </div>
      <div className="hoa input-container">
        <label>HOA: </label>
        <input
          type="text"
          value={SFH.hoa === "0" ? "" : SFH.hoa}
          onChange={(e) => {
            dispatch(updateHOA(strNumsInput(e.target.value, 2)));
          }}
        />
      </div>
      <div className="vacancy input-container">
        <label>Vacancy: </label>
        <input
          type="text"
          value={SFH.vacancy === "0" ? "" : SFH.vacancy}
          onChange={(e) => {
            dispatch(updateVacancy(strNumsInput(e.target.value, 2)));
          }}
        />
      </div>
      <div className="cap-ex input-container">
        <label>Cap-Ex: </label>
        <input
          type="text"
          value={SFH.capEx === "0" ? "" : SFH.capEx}
          onChange={(e) => {
            dispatch(updateCapex(strNumsInput(e.target.value, 2)));
          }}
        />
      </div>
      <div className="management input-container">
        <label>Management: </label>
        <input
          type="text"
          value={SFH.management === "0" ? "" : SFH.management}
          onChange={(e) => {
            dispatch(updateManagement(strNumsInput(e.target.value, 2)));
          }}
        />
      </div>
      <div className="maintenance input-container">
        <label>Maintenance: </label>
        <input
          type="text"
          value={SFH.maintenance === "0" ? "" : SFH.maintenance}
          onChange={(e) => {
            dispatch(updateMaintenance(strNumsInput(e.target.value, 2)));
          }}
        />
      </div>
      <div className="other input-container">
        <label>Other: </label>
        <input
          type="text"
          value={SFH.expOther === "0" ? "" : SFH.expOther}
          onChange={(e) => {
            dispatch(updateExpOther(strNumsInput(e.target.value, 2)));
          }}
        />
      </div>
    </div>
  );
};

export default SFHEXpensesInputs;
