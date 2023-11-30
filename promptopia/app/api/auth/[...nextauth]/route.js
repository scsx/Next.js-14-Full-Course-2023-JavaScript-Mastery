import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

import User from '@models/user'
import { connectToDB } from '@utils/database'

console.log({
  clientId: 'process.env.GOOGLE_ID',
  clientSecret: 'process.env.GOOGLE_CLIENT_SECRET'
})

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: 'process.env.GOOGLE_ID',
      clientSecret: 'process.env.GOOGLE_CLIENT_SECRET'
    })
  ],
  async session({ session }) {},
  async signIn({ profile }) {
    try {
      await connectToDB()

      // Check if user already exists.
      const userExists = await User.findOne({
        email: profile.email
      })

      // If not, create a new document and save user in MongoDB.
      if (!userExists) {
        await User.create({
          email: profile.email,
          username: profile.name.replace(' ', '').toLowerCase(),
          image: profile.picture
        })
      }

      return true
    } catch (error) {
      console.log(error)
      return false
    }
  }
})

export { handler as GET, handler as POST }
