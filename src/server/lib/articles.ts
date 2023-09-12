import { TRPCError } from "@trpc/server";
import { adminPriveledges } from "../api/routers/users/admin";
import { prisma } from "../db";

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
  html
    // reduce the string into a manageable size before removing html tags
    .slice(0, 600)
    // remove html tags
    .replaceAll(/(<([^>]+)>)/gi, "")
    // reduce the string further into a manageable size to display on UI
    .slice(0, 200);
  for (let i = html.length; i > 0; i--) {
    if (html[i] !== " ") {
      html = html.slice(0, i);
    }
  }

  return html;
}
