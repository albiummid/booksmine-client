import axios from 'axios'
import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import FacebookProvider from 'next-auth/providers/facebook'
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'

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
    session: async (session) => {
      if (!session) return
      const { email, name, image } = session.session.user
      try {
        const base = 'https://booksmine-server.herokuapp.com/api/v1'
        const { data } = await axios.post(base + '/user/checkAndCreateUser', {
          email,
          name,
          image,
        })
        console.log(image)
        session.session.user.role = data.user.role
      } catch (err) {
        console.log(err)
        session.session.user.role = 'user'
      }

      const user = session.session.user
      const expires = session.session.expires

      return { user, expires }
    },
  },
})
