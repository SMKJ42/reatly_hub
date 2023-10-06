import { type ReactElement, useState } from "react";
import UserLayout from "~/components/layouts/UserLayout";
import type { NextPageWithLayout } from "~/pages/_app";
import Link from "next/link";
import { api } from "~/utils/api";

const Articles: NextPageWithLayout = () => {
  const ctx = api.useContext();

  const [page, setPage] = useState(1);
  const { data: articles } = api.author.getPublishRequests.useQuery({
    page,
  });

  // const { mutate: deleteArticle } = api.author.deleteStagedArticle.useMutation({
  //   onSuccess: () => {
  //     console.log("success");
  //     void ctx.articles.invalidate();
  //   },
  //   onError: (error) => {
  //     console.log(error);
  //   },
  // });

  return (
    <>
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
              // deleteArticle({ articleId: article.id });
            }}
          >
            Push Back
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
