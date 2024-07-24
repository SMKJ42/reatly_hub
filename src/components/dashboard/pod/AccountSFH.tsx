import Link from "next/link";
import { MostRecentSFHPods } from "~/components/dashboard/pod/mostRecentSFH";

export function AccountSFH() {
  return (
    <div className="grid grid-cols-6 rounded-xl border">
      <div className="flex w-full flex-col border-r p-4">
        <h1 className="mb-4 text-center text-2xl font-semibold">SFH pods</h1>
        <div className="flex flex-col">
          <button className="mb-4">
            <Link
              href="/user/calculators/single-family"
              // className="rounded-lg bg-darkBg300 px-4 py-1 text-white dark:bg-white dark:text-black"
            >
              Create
            </Link>
          </button>
          <button>
            <Link
              href="/user/calculators/history"
              // className="rounded-lg bg-darkBg300 px-4 py-1 text-white dark:bg-white dark:text-black"
            >
              View
            </Link>
          </button>
        </div>
      </div>
      <div className="col-span-5 mb-6 mt-4">
        <MostRecentSFHPods />
      </div>
    </div>
  );
}
