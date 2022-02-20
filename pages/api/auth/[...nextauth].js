import NextAuth from 'next-auth'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import GithubProvider from 'next-auth/providers/github'
import connectDB from '../../../config/connectDB'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import CredentialsProvider from 'next-auth/providers/credentials'
import clientPromise from '../../../lib/mongodb'
import url from 'url'
// connectDB()

export default NextAuth({
  session: {
    jwt: true,
  },
  // adapter: MongoDBAdapter(clientPromise),
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      async authorize({ id, email, name }) {
        return { id, email, name }
      },
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],
  secret: process.env.SECRET,
  //configure session =>

  //SQL or MongoDB database
  database: process.env.DATABASE_URL,
  pages: {
    signIn: '/login',
  },
  callbacks: {
    redirect({ url: full, baseUrl }) {
      const from = url?.parse(full, true)?.query?.from
      return from ? from : baseUrl
    },
  },
})
