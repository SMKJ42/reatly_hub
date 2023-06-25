import React from "react";
import { strNumsInput } from "../../../../homeBrews/numberDisplay";
import {
  updateIncOther,
  updateRents,
} from "../../../../redux/slice/singleFamilySlice";
import { useAppDispatch, useAppSelector } from "~/redux/hooks";

const SFHIncomeInputs = () => {
  const dispatch = useAppDispatch();
  const singleFamily = useAppSelector((state) => state.singleFamily);

  return (
    <div className="incomes">
      <div className="rent-per input-container">
        <label className="flex items-center">Rent per unit: </label>
        <input
          type="text"
          value={singleFamily.rents === "0" ? "" : singleFamily.rents}
          onChange={(e) => {
            dispatch(updateRents(strNumsInput(e.target.value, 2)));
          }}
        />
      </div>
      <div className="other input-container">
        <label className="flex items-center">Other income: </label>
        <input
          type="text"
          value={singleFamily.incOther === "0" ? "" : singleFamily.incOther}
          onChange={(e) => {
            dispatch(updateIncOther(strNumsInput(e.target.value, 2)));
          }}
        />
      </div>
    </div>
  );
};

export default SFHIncomeInputs;
