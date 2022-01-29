import * as prismic from "@prismicio/client";
export function getPrismicClient(req?: unknown) {
  /* const prismic = Prismic.createClient(process.env.PRISMIC_ACCESS_TOKEN, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
  });*/

  const repoName = "projeto-Ignews1";
  const endpoint = prismic.getEndpoint(repoName);
  console.log("endpoint", endpoint);
  const client = prismic.createClient(endpoint, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
  });
  const predicate = prismic.predicate;
  client.enableAutoPreviewsFromReq(req);
  return { client, predicate };
}
