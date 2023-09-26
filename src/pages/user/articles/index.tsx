import { type ReactElement, useState } from "react";
import UserLayout from "../../../components/layouts/UserLayout";
import type { NextPageWithLayout } from "../../_app";
import Link from "next/link";
import { api } from "~/utils/api";

const Articles: NextPageWithLayout = () => {
  const ctx = api.useContext();

  const [page, setPage] = useState(1);
  const { data: articles, isLoading } = api.articles.previewMostRecent.useQuery(
    {
      page,
    }
  );

  const { mutate: deleteArticle } = api.author.delete.useMutation({
    onSuccess: () => {
      console.log("success");
      void ctx.articles.invalidate();
    },
    onError: (error) => {
      console.log(error);
    },
  });

  return (
    <>
      <div className="flex w-full justify-around">
        <Link href="/user/articles/write-article">Create</Link>
        <Link href="/user/articles/write-article">Update</Link>
        <Link href="/user/articles/write-article">Review</Link>
      </div>
      <h1 className=""> Articles :) </h1>
      {articles?.map((article) => (
        <div key={article.id}>
          <h2 className="text-2xl">{article.title}</h2>
          <p className="text-xl">{article.preview}...</p>

          <Link href="/user/articles/[id]" as={`/user/articles/${article.id}`}>
            Read more
          </Link>
          <button
            onClick={() => {
              deleteArticle({ articleId: article.id });
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </>
  );
};

Articles.getLayout = function getLayout(page: ReactElement) {
  return <UserLayout>{page}</UserLayout>;
};

export default Articles;
