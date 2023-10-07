import { type ReactElement, useState } from "react";
import type { NextPageWithLayout } from "~/pages/_app";
import UserLayout from "~/components/layouts/UserLayout";
import { api } from "~/utils/api";
import Link from "next/link";
import { StandardLoadingSpinner } from "~/components/shared/StandardLoadingSpinner";
import { NoArticlesFound } from "~/components/articles/NoArticlesFound";
import Head from "next/head";

interface Direction {
  direction: 1 | -1;
}
interface ToPage {
  toPage: number;
}
type PageNavigationProps = Direction | ToPage;

const MyArticles: NextPageWithLayout = () => {
  const [articleType, setArticleType] = useState<"published" | "staged">(
    "published"
  );

  return (
    <div className="flex w-full flex-col items-center">
      <Head>
        <title>Realty-hub My Articles</title>
      </Head>
      <div className="p-8 sm:w-3/4 lg:w-2/3 ">
        <div className="flex w-full justify-around pb-4">
          <button
            className={`rounded-lg bg-white px-4 py-1 text-black ${
              articleType === "published" ? "shadow-inner shadow-black" : ""
            }`}
            onClick={() => {
              setArticleType("published");
            }}
          >
            Published
          </button>
          <button
            className={`rounded-lg bg-white px-4 py-1 text-black ${
              articleType === "staged" ? "shadow-inner shadow-black" : ""
            }`}
            onClick={() => {
              setArticleType("staged");
            }}
          >
            Staged
          </button>
        </div>
        <div className="[&>*]:border-b">
          {articleType === "published" && <PublishedArticles />}
          {articleType === "staged" && <StagedArticles />}
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

function PublishedArticles() {
  const [page, setPage] = useState(1);

  const { data: articles, isLoading } = api.author.getAuthorsArticles.useQuery({
    page,
  });

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
  const ctx = api.useContext();

  const { mutate: deleteArticle } = api.author.deleteStagedArticle.useMutation({
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
      {articles && articles.length === 0 && <NoArticlesFound />}
      {isLoading && <StandardLoadingSpinner />}
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
    </>
  );
}

function StagedArticles() {
  const [page, setPage] = useState(1);

  const { data: articles, isLoading } =
    api.author.getAuthorsStagedArticles.useQuery({
      page,
    });

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
  const ctx = api.useContext();

  const { mutate: deleteArticle } = api.author.deleteStagedArticle.useMutation({
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
      {articles && articles.length === 0 && <div>No articles found</div>}
      {isLoading && <StandardLoadingSpinner />}
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
    </>
  );
}

MyArticles.getLayout = function getLayout(page: ReactElement) {
  return <UserLayout>{page}</UserLayout>;
};

export default MyArticles;
