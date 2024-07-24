import {
  SignInButton,
  SignOutButton,
  SignUpButton,
  useUser,
} from "@clerk/nextjs";
import Link from "next/link";
import {
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useEffect,
  useState,
} from "react";
import ToggleTheme from "../shared/ToggleTheme";
import { HomeIcon } from "../shared/icons/home";
import { ExpandIcon } from "../shared/icons/expand";
import { CollapseIcon } from "../shared/icons/collapse";
import { redirect } from "next/navigation";
import { useRouter } from "next/router";

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

  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user.isLoaded && user.isSignedIn) void router.push("/user/dashboard");
  }, [user]);

  return (
    <div className="min-h-screen bg-slate-100 text-black transition-colors duration-500 dark:bg-darkBg100 dark:text-white">
      <div className="fixed z-10 w-full">
        <LargeNav />
        <MiniNav mini={mini} setMini={setMini} />
      </div>
      <main className="relative top-14 bg-slate-100 [min-height:calc(100vh-3.5rem)] dark:bg-darkBg100 dark:text-white">
        {children}
      </main>
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
              <Link href="/user/dashboard" className="mr-4">
                Dashboard
              </Link>
              <SignOutButton />
            </>
          ) : (
            <>
              <SignUpButton />
              <div className="w-4"></div>
              <SignInButton />
            </>
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

        {user.isLoaded && user.isSignedIn ? (
          <div className="sign-out-btn w-42 mt-2">
            <SignOutButton />
          </div>
        ) : (
          <>
            <div className="sign-out-btn w-42 mt-2">
              <SignUpButton />
            </div>
            <div className="sign-out-btn w-42 mt-2">
              <SignInButton />
            </div>
          </>
        )}
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
