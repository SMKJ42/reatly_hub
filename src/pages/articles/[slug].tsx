import { type ReactElement, useState, useEffect } from "react";
import { api } from "~/utils/api";
import { StandardLoadingSpinner } from "~/components/shared/StandardLoadingSpinner";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { serverHelperWithContext } from "~/lib/serverHelperWithContext";
import PublicLayout from "~/components/layouts/PublicLayout";
import UserLayout from "../../components/layouts/UserLayout";
import { useUser } from "@clerk/nextjs";

export async function getServerSideProps(
  context: GetServerSidePropsContext<{ id: string }>
) {
  const helpers = await serverHelperWithContext(context);

  const query = context.query;

  await helpers.articles.getArticleById.prefetch({
    articleId: query.slug as string,
  });

  return {
    props: {
      trpcState: helpers.dehydrate(),
      query,
    },
  };
}

const Articles = (
  props: InferGetServerSidePropsType<typeof getServerSideProps>
) => {
  const { query } = props;
  const slug = query?.slug as string;
  const userStatus = useUser();
  if (userStatus.isSignedIn) {
    Articles.getLayout = function getLayout(page: ReactElement) {
      return <UserLayout>{page}</UserLayout>;
    };
  } else {
    Articles.getLayout = function getLayout(page: ReactElement) {
      return <PublicLayout>{page}</PublicLayout>;
    };
  }

  const { data: articleData, isLoading } = api.articles.getArticleById.useQuery(
    {
      articleId: slug,
    },
    { enabled: !!slug }
  );

  const [article, setArticle] = useState<undefined | string>(undefined);

  useEffect(() => {
    if (!articleData) return;
    const _article = articleData?.content;
    setArticle(_article);
  }, [articleData]);

  if (isLoading) return <StandardLoadingSpinner />;

  if (!articleData) return <div>Article not found</div>;

  return (
    <div className="flex w-full flex-col items-center">
      <div className="px-4 pt-8 text-center text-3xl font-bold sm:text-3xl lg:text-4xl">
        <h1 id={`title-${articleData.title}`}>{articleData.title}</h1>
      </div>
      <article className="prose w-[100vw] px-6 pt-4 dark:prose-invert lg:prose-xl">
        {/* <p>Views: {articleData.viewCount}</p> */}
        <div
          className={`article-${slug}`}
          dangerouslySetInnerHTML={article ? { __html: article } : undefined}
        ></div>
      </article>
    </div>
  );
};

Articles.getLayout = function getLayout(page: ReactElement) {
  return <PublicLayout>{page}</PublicLayout>;
};

export default Articles;
