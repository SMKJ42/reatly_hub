export function InterestOnlyOptions() {
  return (
    <div>
      <label htmlFor="interestOnlyTerm">Interest Only Term:</label>
      <input
        id="interestOnlyTerm"
        name="interestOnlyTerm"
        type="text"
        // onChange={(e) => setIOperiod(e.target.valueAsNumber)}
      ></input>
    </div>
  );
}
