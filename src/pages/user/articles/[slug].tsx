import { type ReactElement, useState, useEffect } from "react";
import UserLayout from "../../../components/layouts/UserLayout";
import type { NextPageWithLayout } from "../../_app";
import { api } from "~/utils/api";
import { useRouter } from "next/router";
import { StandardLoadingSpinner } from "~/components/shared/StandardLoadingSpinner";

const Articles: NextPageWithLayout = () => {
  const router = useRouter();
  const { slug } = router.query || "";
  const { data: articleData, isLoading } = api.articles.getArticleById.useQuery(
    {
      articleId: slug as string,
    },
    { enabled: router.isReady }
  );

  const [article, setArticle] = useState<undefined | string>(undefined);

  useEffect(() => {
    if (!articleData) return;
    const _article = articleData?.content;
    setArticle(_article);
  }, [articleData, router.isReady]);

  if (isLoading) return <StandardLoadingSpinner />;

  if (!articleData) return <div>Article not found</div>;

  return (
    <article className="prose dark:prose-invert lg:prose-xl">
      <h1 id={`title-${articleData.title}`}>{articleData.title}</h1>
      <p>Views: {articleData.viewCount}</p>
      <div
        className={`article-${slug as string}`}
        dangerouslySetInnerHTML={article ? { __html: article } : undefined}
      ></div>
    </article>
  );
};

Articles.getLayout = function getLayout(page: ReactElement) {
  return <UserLayout>{page}</UserLayout>;
};

export default Articles;
