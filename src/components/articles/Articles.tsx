import Link from "next/link";
import { NoArticlesFound } from "~/components/articles/NoArticlesFound";
import { PaginatePageButtons } from "~/components/shared/PaginatePageButtons";
import { useRouter } from "next/router";
import { api } from "~/utils/api";

export const Articles = () => {
  const router = useRouter();
  const page = router.query.page ? router.query.page.length : 1;

  function paginateTo(newPage: number) {
    void router.push(`/articles?page=${newPage}`);
  }

  const { data: articleData, isLoading } =
    api.articles.previewMostRecent.useQuery({
      page,
    });

  return (
    <div className="flex w-full flex-col items-center">
      <div className="p-8 sm:w-3/4 lg:w-2/3">
        <div className="min-h-[75vh] [&>*]:border-b text-center">
          {articleData && articleData.articles.length === 0 && (
            <NoArticlesFound />
          )}
          {articleData &&
            articleData.articles?.map((article) => (
              <div key={article.id} className="py-4">
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
              </div>
            ))}
        </div>
        <div>
          <PaginatePageButtons
            paginateTo={paginateTo}
            pageMax={articleData && Math.ceil(articleData.count / 10)}
          />
        </div>
      </div>
    </div>
  );
};
