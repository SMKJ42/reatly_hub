import { SignOutButton } from "@clerk/nextjs";
import Head from "next/head";
import Link from "next/link";
import ToggleTheme from "../shared/ToggleTheme";
import { CalculatorsNav } from "./dropDown/calculators";
import { useState } from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState("light");

  const [activeDropDown, setActiveDropDown] = useState(false);
  const [dropDownOption, setDropDownOption] = useState("");

  return (
    <div
      className={`min-h-screen ${inter.className} bg-bg10 text-black transition-colors duration-500 dark:bg-darkBg100 dark:text-white`}
    >
      <nav className="flex px-4">
        <div className="logo-container flex flex-none">
          <Link href="/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6 text-primary200"
            >
              <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
              <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
            </svg>
          </Link>
        </div>
        <div className="std-navigation flex flex-1">
          <div
            className="flex flex-1"
            onMouseEnter={() => setActiveDropDown(false)}
          ></div>
          <Link href="/user">Dashboard</Link>
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
          <Link href="/user/articles">Articles</Link>
          <div
            className="flex flex-1"
            onMouseEnter={() => setActiveDropDown(false)}
          ></div>
          <div
            className="flex flex-1"
            onMouseEnter={() => setActiveDropDown(false)}
          ></div>
        </div>

        <div className="account-manager mx-4 flex justify-around">
          <Link href="/user/account">Account</Link>
          <div className="sign-out-btn w-42 ml-4">
            <SignOutButton />
          </div>
        </div>
        <ToggleTheme theme={theme} setTheme={setTheme} />
      </nav>
      <main
        onMouseEnter={() => {
          setActiveDropDown(false);
          setDropDownOption("");
        }}
      >
        {children}
      </main>
      <footer></footer>
    </div>
  );
}
