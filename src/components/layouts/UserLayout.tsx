import { SignOutButton } from "@clerk/nextjs";
import Link from "next/link";
import ToggleTheme from "../shared/ToggleTheme";
import { CalculatorsDropdown } from "./dropDown/calculators";
import React, {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useState,
} from "react";
import { CollapseIcon } from "../shared/icons/collapse";
import { ExpandIcon } from "../shared/icons/expand";
import { HomeIcon } from "../shared/icons/home";


interface LargeNavProps {
  setDropDownOption: Dispatch<SetStateAction<string>>;
  dropDownOption: string;
  setActiveDropDown: Dispatch<SetStateAction<boolean>>;
  activeDropDown: boolean;
}

type Mini = "expanded" | "collapsed";
interface MiniNav {
  setDropDownOption: Dispatch<SetStateAction<string>>;
  dropDownOption: string;
  setActiveDropDown: Dispatch<SetStateAction<boolean>>;
  activeDropDown: boolean;
  mini: Mini;
  setMini: Dispatch<SetStateAction<Mini>>;
  navOpt?: ReactNode;
}

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [activeDropDown, setActiveDropDown] = useState(false);
  const [dropDownOption, setDropDownOption] = useState("");
  const [mini, setMini] = useState<Mini>("collapsed");

  return (
    <div
      className="text-black transition-colors duration-500 min-h-screen bg-slate-100 dark:bg-darkBg100 dark:text-white"
    >
      <div className="absolute w-full">
        <LargeNav
          activeDropDown={activeDropDown}
          setActiveDropDown={setActiveDropDown}
          dropDownOption={dropDownOption}
          setDropDownOption={setDropDownOption}
        />
        <MiniNav
          mini={mini}
          setMini={setMini}
          activeDropDown={activeDropDown}
          setActiveDropDown={setActiveDropDown}
          dropDownOption={dropDownOption}
          setDropDownOption={setDropDownOption}
        />
      </div>
      <main
        className="top-14 relative bg-slate-100 dark:bg-darkBg100 dark:text-white [min-height:calc(100vh-3.5rem)]"
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

function LargeNavButtons(props: LargeNavProps) {
  const {
    setDropDownOption,
    dropDownOption,
    setActiveDropDown,
    activeDropDown,
  } = props;
  return (
    <>
      <div className="std-navigation flex flex-1 flex-col last:pb-0 md:flex-row [&>button]:pb-2 [&>button]:md:pb-0">
        <div
          className="flex flex-1"
          onMouseEnter={() => setActiveDropDown(false)}
        ></div>
        <Link href="/user/dashboard">Dashboard</Link>
        <div
          className="flex flex-1"
          onMouseEnter={() => setActiveDropDown(false)}
        ></div>
        <button>
          <CalculatorsDropdown
            setDropDownOption={setDropDownOption}
            dropDownOption={dropDownOption}
            setActiveDropDown={setActiveDropDown}
            activeDropDown={activeDropDown}
          />
        </button>
        <div
          className="flex flex-1"
          onMouseEnter={() => setActiveDropDown(false)}
        ></div>
        <Link href="/user/articles">Articles</Link>
        <div
          className="flex flex-1"
          onMouseEnter={() => setActiveDropDown(false)}
        ></div>
      </div>
    </>
  );
}

function LargeNav(props: LargeNavProps) {
  const {
    setDropDownOption,
    dropDownOption,
    setActiveDropDown,
    activeDropDown,
  } = props;

  const [theme, setTheme] = useState("light");

  return (
    <nav className="hidden h-14 px-4 md:flex">
      <HomeIcon />
      <LargeNavButtons
        activeDropDown={activeDropDown}
        setActiveDropDown={setActiveDropDown}
        dropDownOption={dropDownOption}
        setDropDownOption={setDropDownOption}
      />
      <div className="account-manager mx-4 flex justify-around">
        <Link href="/user/account">Account</Link>
        <div className="sign-out-btn w-42 ml-8">
          <SignOutButton />
        </div>
      </div>
      <ToggleTheme theme={theme} setTheme={setTheme} />
    </nav>
  );
}

function MiniNavButtons(props: LargeNavProps) {
  const {
    setDropDownOption,
    dropDownOption,
    setActiveDropDown,
    activeDropDown,
  } = props;
  return (
    <>
      <div className="std-navigation flex flex-1 flex-col last:pb-0 md:flex-row [&>button]:pb-2 [&>button]:md:pb-0">
        <div
          onMouseEnter={() => setActiveDropDown(false)}
          className="mb-2 flex w-full justify-center"
        >
          <Link href="/user">Dashboard</Link>
        </div>
        <div className="mb-2 flex w-full">
          <div
            className="flex h-6 w-full flex-1"
            onMouseOver={() => {
              setDropDownOption("");
            }}
          ></div>
          <CalculatorsDropdown
            setDropDownOption={setDropDownOption}
            dropDownOption={dropDownOption}
            setActiveDropDown={setActiveDropDown}
            activeDropDown={activeDropDown}
          />
          <div
            className="flex h-6 w-full flex-1"
            onMouseOver={() => {
              setDropDownOption("");
            }}
          ></div>
        </div>
        <div
          className="flex w-full justify-center"
          onMouseEnter={() => setActiveDropDown(false)}
        >
          <Link href="/user/articles">Articles</Link>
        </div>
        <div className="account-manager mx-4 flex flex-col items-center justify-around">
          <Link href="/user/account"
            className="mt-2"
          >
            Account
          </Link>
          <div className="sign-out-btn w-42 mt-2">
            <SignOutButton />
          </div>
        </div>
      </div>
    </>
  );
}

function MiniNav(props: MiniNav) {
  const {
    setDropDownOption,
    dropDownOption,
    setActiveDropDown,
    activeDropDown,
  } = props;
  const { mini, setMini } = props;
  return (
    <nav className="flex h-fit px-4 pb-4 pt-3 md:hidden">
      {mini === "collapsed" ? (
        <CollapsedNav
          mini={mini}
          setMini={setMini}
          activeDropDown={activeDropDown}
          setActiveDropDown={setActiveDropDown}
          dropDownOption={dropDownOption}
          setDropDownOption={setDropDownOption}
        />
      ) : (
        <ExpandedNav
          mini={mini}
          setMini={setMini}
          activeDropDown={activeDropDown}
          setActiveDropDown={setActiveDropDown}
          dropDownOption={dropDownOption}
          setDropDownOption={setDropDownOption}
        />
      )}
    </nav>
  );
}

function CollapsedNav(props: MiniNav) {
  const { setMini } = props;
  return (
    <div className="flex h-full w-full items-center justify-between">
      <HomeIcon />
      <div onClick={() => setMini("expanded")}>
        <ExpandIcon />
      </div>
    </div>
  );
}

function ExpandedNav(props: MiniNav) {
  const {
    setDropDownOption,
    dropDownOption,
    setActiveDropDown,
    activeDropDown,
  } = props;
  const { mini, setMini } = props;

  return (
    <div className="mt-1 flex h-full w-full items-start justify-end text-xl">
      <div onMouseEnter={() => setActiveDropDown(false)}></div>
      <HomeIcon />
      <MiniNavButtons
        activeDropDown={activeDropDown}
        setActiveDropDown={setActiveDropDown}
        dropDownOption={dropDownOption}
        setDropDownOption={setDropDownOption}
      />
      <div onClick={() => setMini("collapsed")}>
        <CollapseIcon />
      </div>
    </div>
  );
}
