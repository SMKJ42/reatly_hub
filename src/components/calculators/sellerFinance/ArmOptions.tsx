import { useAppDispatch } from "~/redux/hooks";

export function ARMOptions() {
  const dispatch = useAppDispatch();

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div>
        <div>
          <label>Initial Period in months:</label>
          <input />
        </div>
        <div>
          <label>Initial margin: </label>
          <input />
        </div>
        <div>
          <label>Period in months: </label>
          <input />
        </div>
        <div>
          <label>Periodic margin: </label>
          <input />
        </div>
      </div>
    </div>
  );
}
