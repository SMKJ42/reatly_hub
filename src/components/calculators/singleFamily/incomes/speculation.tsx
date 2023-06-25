import React from "react";
import { useAppDispatch, useAppSelector } from "~/redux/hooks";

const RennovationRadio = () => {
  const dispatch = useAppDispatch();
  const singleFamily = useAppSelector((state) => state.singleFamily);

  return (
    <div className="rennovation-radios-container">
      <label htmlFor="" className="rennovations">
        Rennovations?
      </label>
      <div className="rennovation-radios input-container">
        <input
          type="radio"
          id="rennovation-yes"
          name="rennovations"
          onChange={() => {
            singleFamily.rennovationsRadio
              ? dispatch({ type: "UPDATE_RENNOVATIONS_RADIO", payload: false })
              : dispatch({ type: "UPDATE_RENNOVATIONS_RADIO", payload: true });
          }}
        />
        <label htmlFor="rennovation-yes">yes</label>
        <input
          type="radio"
          id="rennovation-no"
          name="rennovations"
          defaultChecked
          onChange={() => {
            singleFamily.rennovationsRadio
              ? dispatch({ type: "UPDATE_RENNOVATIONS_RADIO", payload: true })
              : dispatch({ type: "UPDATE_RENNOVATIONS_RADIO", payload: false });
          }}
        />
        <label htmlFor="rennovation-no">no</label>
      </div>
    </div>
  );
};

export default RennovationRadio;
