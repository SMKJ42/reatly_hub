import { ReactElement, useState } from "react";
import UserLayout from "../../components/layouts/UserLayout";
import type { NextPageWithLayout } from "../_app";
import { NextComponentType } from "next";
import { useAppDispatch, useAppSelector } from "~/redux/hooks";
import { decrement, increment } from "~/redux/counterSlice";

const Dashboard: NextPageWithLayout = () => {
  return (
    <>
      <Counter />
      <h1 className="bg-white"> User Dashboard :) </h1>
    </>
  );
};

Dashboard.getLayout = function getLayout(page: ReactElement) {
  return <UserLayout>{page}</UserLayout>;
};

const Counter = () => {
  const value = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <div className="bg-white">
      <h1>Count: {value}</h1>
      <button type="button" onClick={() => dispatch(increment())}>
        Increment
      </button>
      <button onClick={() => dispatch(decrement())}>Decrement</button>
    </div>
  );
};

export default Dashboard;
