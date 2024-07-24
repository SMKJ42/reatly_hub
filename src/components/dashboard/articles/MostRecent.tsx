import Link from "next/link";
import { useRouter } from "next/router";
import { StandardLoadingSpinner } from "~/components/shared/StandardLoadingSpinner";
import { api } from "~/utils/api";

interface mostRecent {
  id: string;
  publicId: string;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  authorId: string;
  content: string;
  preview: string;
  reviewed: boolean;
  version: string;
  status: string;
}

export function MostRecentArticle() {
  const router = useRouter();

  // const {
  //   data: mostRecent,
  //   isLoading,
  //   isError,
  // } = api.author.getAuthorsLastStagedArticle.useQuery({});

  // if (isLoading) {
  //   return (
  //     <div className="col-span-5">
  //       <StandardLoadingSpinner />
  //     </div>
  //   );
  // }

  // if (isError) {
  //   return (
  //     <div className="col-span-5 pl-8">
  //       <p>Unable to load most recent article.</p>
  //     </div>
  //   );
  // }

  return (
    <>
      {/* <div className="flex w-full flex-col justify-center px-8">
        <h2
          className="mb-2 text-xl font-semibold hover:cursor-pointer hover:underline"
          onClick={() => {
            void router.push(`/user/admin/review-articles/${mostRecent?.id}`);
          }}
        >
          {mostRecent?.title}
        </h2>
        <p>{mostRecent?.preview}...</p>
      </div>
      {mostRecent && <ArticleSwitch {...mostRecent} />} */}
    </>
  );
}

function ArticleSwitch(mostRecent: mostRecent) {
  switch (mostRecent.status) {
    case "draft":
      return <DraftArticleStatus {...mostRecent} />;
    case "pending":
      return <PendingArticleStatus {...mostRecent} />;
    case "published":
      return <PublishedArticleStatus {...mostRecent} />;
    default:
      return null;
  }
}

function DraftArticleStatus(mostRecent: mostRecent) {
  return (
    <>
      {mostRecent.status === "draft" && (
        <div className="ml-8 mt-4 flex items-center ">
          <p className="mr-4 ">
            <span className="text-lg font-semibold">Status: </span>
            Draft
          </p>
          <Link
            href={`/user/write-article/${mostRecent?.id}`}
            // className="ml-8 mt-2 rounded-lg bg-white px-4 py-[1px] text-black"
          >
            Resume work
          </Link>
        </div>
      )}
    </>
  );
}

function PendingArticleStatus(mostRecent: mostRecent) {
  return (
    <>
      {mostRecent.status === "pending" && (
        <div className="ml-8 mt-4 flex  items-center ">
          <p className="mr-4 ">
            <span className="text-lg font-semibold">Status: </span>
            Pending Approval
          </p>
          <Link
            href={`/user/write-articles/${mostRecent?.id}`}
            // className="ml-8 mt-2 rounded-lg bg-white px-4 py-1 text-black"
          >
            Revise
          </Link>
          <Link
            href={`/user/admin/review-articles/${mostRecent?.id}`}
            // className="ml-8 mt-2 rounded-lg bg-white px-4 py-1 text-black"
          >
            Review
          </Link>
        </div>
      )}
    </>
  );
}

function PublishedArticleStatus(mostRecent: mostRecent) {
  return (
    <>
      {mostRecent.status === "published" && (
        <div className="ml-8 mt-4 flex  items-center ">
          <p className="mr-4">
            <span className="text-lg font-semibold">Status: </span>
            Published
          </p>
          <Link
            href={`/user/admin/review-articles/${mostRecent?.id}`}
            // className="ml-8 mt-2 rounded-lg bg-white px-4 py-1 text-black"
          >
            Review
          </Link>
        </div>
      )}
    </>
  );
}
