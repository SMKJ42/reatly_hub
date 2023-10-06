import Link from "next/link";
import { api } from "~/utils/api";

export function AccountAdmin() {
  const { data: publishRequestCount, isLoading } =
    api.admin.getPublishRequestCount.useQuery();

  return (
    <div className="flex w-full items-center justify-between ">
      <p className="w-full">Articles Pending Approval: {publishRequestCount}</p>
      <div className="flex justify-around">
        <Link
          href="/user/admin/review-articles"
          className="whitespace-nowrap rounded-lg bg-white px-4 py-1 text-black"
        >
          Review Pending
        </Link>
      </div>
    </div>
  );
}
