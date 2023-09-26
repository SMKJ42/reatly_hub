import { TRPCError } from "@trpc/server";
import { adminPriveledges } from "../api/routers/users/admin";
import { prisma } from "../db";

//safe guard against updating other users articles and returns the article
export async function getUsersOwnArticle(props: {
  userId: string;
  role: string;
}) {
  const { userId, role } = props;

  const article = await prisma.article.findUnique({
    where: {
      id: userId,
    },
  });

  if (article?.authorId !== userId && !adminPriveledges.includes(role)) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You don't have access to this resource",
    });
  }

  return article;
}

export function getArticlePreview(html: string) {
  html = html
    // reduce the string into a manageable size before removing html tags
    .slice(0, 600)
    // remove html tags
    .replaceAll(/(<([^>]+)>)/gi, " ")
    .trim();

  if (html.length < 180) {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Article must be at least 180 characters long",
    });
  }
  // reduce the string further into a manageable size to display on UI
  html = html.slice(0, 200);

  return { content: html };
}
