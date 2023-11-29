import mongoose from 'mongoose'

let isConnected = false // Track the connection status.

export const connectToDb = async () => {
  mongoose.set('strictQuery', true)

  if (isConnected) {
    console.log('MongoDB is already connected')
    return
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      dbName: 'Share prompt',
      useNewUrlParser: true,
      useUnifiedTipology: true
    })

    isConnected = true
    console.log('MongoDB connected')
  } catch (error) {
    console.log(error)
  }
}
