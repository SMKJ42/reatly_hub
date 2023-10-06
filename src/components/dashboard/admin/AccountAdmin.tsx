import Link from "next/link";
import { api } from "~/utils/api";

export function AccountAdmin() {
  const { data: publishRequestCount, isLoading } =
    api.admin.getPublishRequestCount.useQuery();

  return (
    <>
      <h1 className="w-full text-center text-lg">Admin</h1>
      <p>Articles Pending Approval: {publishRequestCount}</p>
      <div className="flex w-full justify-around">
        <Link href="/user/admin/review-articles">Review</Link>
      </div>
    </>
  );
}
