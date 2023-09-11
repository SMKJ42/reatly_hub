import { type ReactElement, useState } from "react";
import UserLayout from "../../components/layouts/UserLayout";
import type { NextPageWithLayout } from "../_app";
import { useAppDispatch, useAppSelector } from "~/redux/hooks";
import {
  decrement,
  increment,
  incrementByAmount,
} from "~/redux/slice/counterSlice";

const Dashboard: NextPageWithLayout = () => {
  return (
    <>
      <Counter />
      <h1 className=""> User Dashboard :) </h1>
    </>
  );
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <UserLayout>{page}</UserLayout>;
};

const Counter = () => {
  const [number, setNumber] = useState(0);

  const value = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <div className="">
      <h1>Count: {value}</h1>
      <button type="button" onClick={() => dispatch(increment())}>
        Increment
      </button>
      <button onClick={() => dispatch(decrement())}>Decrement</button>
      <input
        value={number}
        onChange={(e) => {
          setNumber(parseInt(e.target.value));
        }}
      />
      <button onClick={() => dispatch(incrementByAmount(number))}>
        Update
      </button>
    </div>
  );
};

export default Dashboard;