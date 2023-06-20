import React from "react";
import { strNumsInput } from "../../../app/homeBrews/numberDisplay";
import { useDispatch, useSelector } from "react-redux";
import { updateIncOther, updateRents } from "../../../app/store/SFHSlice";

const SFHIncomeInputs = () => {
  const dispatch = useDispatch();
  const SFH = useSelector((state) => state.SFH);

  return (
    <div className="incomes">
      <div className="rent-per input-container">
        <label>Rent per unit: </label>
        <input
          type="text"
          value={SFH.rents === "0" ? "" : SFH.rents}
          onChange={(e) => {
            dispatch(updateRents(strNumsInput(e.target.value, 2)));
          }}
        />
      </div>
      <div className="other input-container">
        <label>Other: </label>
        <input
          type="text"
          value={SFH.incOther === "0" ? "" : SFH.incOther}
          onChange={(e) => {
            dispatch(updateIncOther(strNumsInput(e.target.value, 2)));
          }}
        />
      </div>
    </div>
  );
};

export default SFHIncomeInputs;