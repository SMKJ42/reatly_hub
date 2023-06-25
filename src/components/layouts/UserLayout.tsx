import { SignOutButton } from "@clerk/nextjs";
import Head from "next/head";
import Link from "next/link";
import ToggleTheme from "../shared/ToggleTheme";
import { useAppSelector } from "~/redux/hooks";
import { CalculatorsNav } from "./dropDown/calculators";
import { useState } from "react";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const colorTheme = useAppSelector((state) => state.client.colorTheme);

  const [activeDropDown, setActiveDropDown] = useState(false);
  const [dropDownOption, setDropDownOption] = useState("");

  return (
    <div className={`${colorTheme}`}>
      <Head>
        <title>Realty-Hub</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav className="flex">
        <div className="logo-container flex flex-none">
          <Link href="/user/dashboard">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
            </svg>
          </Link>
        </div>
        <div className="std-navigation flex flex-1">
          <div
            className="flex flex-1"
            onMouseEnter={() => setActiveDropDown(false)}
          ></div>
          <Link href="/user/dashboard">Dashboard</Link>
          <div
            className="flex flex-1"
            onMouseEnter={() => setActiveDropDown(false)}
          ></div>
          <CalculatorsNav
            setDropDownOption={setDropDownOption}
            dropDownOption={dropDownOption}
            setActiveDropDown={setActiveDropDown}
            activeDropDown={activeDropDown}
          />
          <div
            className="flex flex-1"
            onMouseEnter={() => setActiveDropDown(false)}
          ></div>
          <Link href="/user/blog">Blog</Link>
          <div
            className="flex flex-1"
            onMouseEnter={() => setActiveDropDown(false)}
          ></div>
        </div>
        <div className="account-manager flex-3 flex-inital flex w-32 justify-around">
          <>
            <Link href="/user/account">account</Link>
            <SignOutButton />
          </>
        </div>
        <ToggleTheme />
      </nav>
      <main
        className="bg-bg100 dark:bg-darkBg100"
        onMouseEnter={() => {
          setActiveDropDown(false);
        }}
      >
        {children}
      </main>
      <footer></footer>
    </div>
  );
}
