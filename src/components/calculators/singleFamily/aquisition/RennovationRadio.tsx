import React from "react";
import { updateRennovationsRadio } from "~/redux/slice/singleFamilySlice";
import { useAppDispatch } from "~/redux/hooks";

const RennovationRadio = () => {
  const dispatch = useAppDispatch();

  return (
    <div className="rennovation-radios-container">
      <label htmlFor="" className="rennovations">
        Rennovations?
      </label>
      <div className="rennovation-radios input-container">
        <div>
          <input
            type="radio"
            id="rennovation-yes"
            name="rennovations"
            onChange={() => {
              dispatch(updateRennovationsRadio(true));
            }}
          />
          <label htmlFor="rennovation-yes">yes</label>
        </div>

        <div>
          <input
            type="radio"
            id="rennovation-no"
            name="rennovations"
            defaultChecked
            onChange={() => {
              dispatch(updateRennovationsRadio(false));
            }}
          />
          <label htmlFor="rennovation-no">no</label>
        </div>
      </div>
    </div>
  );
};

export default RennovationRadio;
