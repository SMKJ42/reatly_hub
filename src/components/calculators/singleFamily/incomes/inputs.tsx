import React from "react";
import { strNumsInput } from "../../../../lib/numberDisplay";
import {
  updateIncOther,
  updateRents,
} from "../../../../redux/slice/singleFamilySlice";
import { useAppDispatch, useAppSelector } from "~/redux/hooks";

const SFHIncomeInputs = () => {
  const dispatch = useAppDispatch();
  const singleFamily = useAppSelector((state) => state.singleFamily);

  return (
    <div className="grid grid-cols-2 gap-x-4 md:grid-cols-1 md:gap-0">
      <div className="rent-per input-container flex-col md:flex-row">
        <label className="flex items-center">Rent per unit: </label>
        <input
          type="text"
          className="max-w-xs !bg-green-200"
          value={singleFamily.rents === "0" ? "" : singleFamily.rents}
          onChange={(e) => {
            dispatch(updateRents(strNumsInput(e.target.value)));
          }}
        />
      </div>
      <div className="other input-container flex-col md:flex-row">
        <label className="flex items-center">Other income: </label>
        <input
          type="text"
          className="max-w-xs !bg-green-200"
          value={singleFamily.incOther === "0" ? "" : singleFamily.incOther}
          onChange={(e) => {
            dispatch(updateIncOther(strNumsInput(e.target.value)));
          }}
        />
      </div>
    </div>
  );
};

export default SFHIncomeInputs;
