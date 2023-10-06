import { type ReactElement, useState } from "react";
import Link from "next/link";
import { api } from "~/utils/api";
import PublicLayout from "~/components/layouts/PublicLayout";

export const Articles = () => {
  const ctx = api.useContext();
  const [page, setPage] = useState(1);
  const { data: articles, isLoading } = api.articles.previewMostRecent.useQuery(
    {
      page,
    }
  );

  const { mutate: deleteArticle } = api.author.deleteStagedArticle.useMutation({
    onSuccess: () => {
      console.log("success");
      void ctx.articles.invalidate();
    },
    onError: (error) => {
      console.log(error);
    },
  });

  interface Direction {
    direction: 1 | -1;
  }
  interface ToPage {
    toPage: number;
  }
  type PageNavigationProps = Direction | ToPage;

  function handlePageNavigation(props: PageNavigationProps) {
    if ("direction" in props) {
      if (page === 1 && props.direction === -1) {
        return;
      } else {
        setPage((prev) => prev + props.direction);
      }
    } else if ("toPage" in props) {
      setPage(props.toPage);
    } else {
      throw new Error("Unhanlded page navigation");
    }
  }

  return (
    <div className="flex w-full flex-col items-center">
      <div className="p-8 sm:w-3/4 lg:w-2/3 ">
        <div className="[&>*]:border-b">
          {articles?.map((article) => (
            <div key={article.id}>
              <h2 className="text-2xl font-semibold">{article.title}</h2>
              <p className="text-xl">{article.preview}...</p>
              <div className="py-2">
                <Link
                  href="/user/articles/[id]"
                  as={`/user/articles/${article.id}`}
                  className="rounded-md border px-4 py-1 shadow-inner dark:shadow-white"
                >
                  Read more
                </Link>
              </div>
              <button
                onClick={() => {
                  deleteArticle({ articleId: article.id });
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
        <div className="flex w-full justify-center">
          <button>Left Carrot</button>
          <button>...</button>
          <button>current</button>
          <button>...</button>
          <button>Right Carrot</button>
        </div>
      </div>
    </div>
  );
};

Articles.getLayout = function getLayout(page: ReactElement) {
  return <PublicLayout>{page}</PublicLayout>;
};

export default Articles;
