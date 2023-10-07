import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useState,
} from "react";
import ToggleTheme from "../shared/ToggleTheme";
import { Inter } from "next/font/google";
import { HomeIcon } from "../shared/icons/home";
import { ExpandIcon } from "../shared/icons/expand";
import { CollapseIcon } from "../shared/icons/collapse";

const inter = Inter({ subsets: ["latin"] });

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

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mini, setMini] = useState<Mini>("collapsed");

  return (
    <div
      className={`min-h-screen ${inter.className} text-black transition-colors duration-500 dark:bg-darkBg100 dark:text-white`}
    >
      <div className="">
        <LargeNav />
        <MiniNav mini={mini} setMini={setMini} />
      </div>
      <main>{children}</main>
      <footer></footer>
    </div>
  );
}

function LargeNavButtons() {
  return (
    <>
      <div className="std-navigation flex flex-1 flex-col last:pb-0 md:flex-row [&>button]:pb-2 [&>button]:md:pb-0">
        <div className="flex flex-1"></div>
        <Link href="/">Home</Link>
        <div className="flex flex-1"></div>
        <Link href="/public/calculator">Calculator</Link>
        <div className="flex flex-1"></div>
        <Link href="/articles">Articles</Link>
        <div className="flex flex-1"></div>
      </div>
    </>
  );
}

function LargeNav() {
  const user = useUser();
  const [theme, setTheme] = useState("light");

  return (
    <nav className="hidden h-14 px-4 md:flex">
      <HomeIcon />
      <LargeNavButtons />
      <div className="account-manager mx-6 flex justify-around">
        <div className="sign-out-btn w-42 ml-12">
          {user.isLoaded && user.isSignedIn ? (
            <>
              <Link href="/user/dashboard">Dashboard</Link>
              <SignOutButton />
            </>
          ) : (
            <SignInButton />
          )}
        </div>
      </div>
      <ToggleTheme theme={theme} setTheme={setTheme} />
    </nav>
  );
}

function MiniNavButtons() {
  const user = useUser();

  return (
    <>
      <div className="std-navigation flex flex-1 flex-col last:pb-0 md:flex-row [&>button]:pb-2 [&>button]:md:pb-0">
        <div className="mb-2 flex w-full justify-center">
          <Link href="/">Home</Link>
        </div>
        <div className="mb-2 flex w-full">
          <div className="flex h-6 w-full flex-1"></div>
          <Link href="public/calculator">Calculator</Link>
          <div className="flex h-6 w-full flex-1"></div>
        </div>
        <div className="flex w-full justify-center">
          <Link href="/articles">Articles</Link>
        </div>

        <div className="sign-out-btn w-42 mt-2">
          {user.isLoaded && user.isSignedIn ? (
            <SignOutButton />
          ) : (
            <SignInButton />
          )}
        </div>
      </div>
    </>
  );
}

function MiniNav(props: {
  mini: Mini;
  setMini: Dispatch<SetStateAction<Mini>>;
}) {
  const { mini, setMini } = props;
  return (
    <nav className="flex h-fit px-4 pb-4 pt-3 md:hidden">
      {mini === "collapsed" ? (
        <CollapsedNav setMini={setMini} />
      ) : (
        <ExpandedNav setMini={setMini} />
      )}
    </nav>
  );
}

function CollapsedNav(props: { setMini: Dispatch<SetStateAction<Mini>> }) {
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

function ExpandedNav(props: { setMini: Dispatch<SetStateAction<Mini>> }) {
  const { setMini } = props;

  return (
    <div className="mt-1 flex h-full w-full items-start justify-end text-xl">
      <div></div>
      <HomeIcon />
      <MiniNavButtons />
      <div onClick={() => setMini("collapsed")}>
        <CollapseIcon />
      </div>
    </div>
  );
}
