import NextAuth from 'next-auth'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import GithubProvider from 'next-auth/providers/github'
import connectDB from '../../../config/connectDB'
import GoogleProvider from 'next-auth/providers/google'
import FacebookProvider from 'next-auth/providers/facebook'
import CredentialsProvider from 'next-auth/providers/credentials'
import clientPromise from '../../../lib/mongodb'
import axios from 'axios'

export default NextAuth({
  // session: {
  //   jwt: true,
  // },
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
    session: async (session) => {
      if (!session) return
      const email = session.session.user.email
      try {
        const { data } = await axios.get(
          `https://booksmine-server.herokuapp.com/api/v1/user/getUserRoleBy?email=${email}`
        )
        session.session.user.role = data.role
      } catch {
        session.session.user.role = 'user'
      }

      const user = session.session.user
      const expires = session.session.expires

      return { user, expires }
    },
  },
})
