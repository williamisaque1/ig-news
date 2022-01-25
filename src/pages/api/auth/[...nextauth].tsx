import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { query } from "faunadb";
import { fauna } from "../../../services/fauna";

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      //  scope: "read:users",
    }),
  ],
  //secret: process.env.SIGNING_KEY,

  callbacks: {
    async signIn({ user, account, profile }) {
      const { email } = user;
      //console.log("----", email);
      try {
        await fauna.query(
          //se não existir user_by_email igual ao email passado pelo usuario
          query.If(
            query.Not(
              query.Exists(
                query.Match(
                  query.Index("users_by_email"),
                  query.Casefold(email)
                )
              )
            ),
            //cria um usuario com os dados
            query.Create(query.Collection("users"), { data: { email } }),
            // else => se caso tiver o usuario somente busca esse usuario
            query.Get(
              query.Match(query.Index("users_by_email"), query.Casefold(email))
            )
          )
        );
        return true;
      } catch {
        return false;
      }
    },
  },
});
