import { Schema, model, models } from 'mongoose'

// Este ficheiro ajuda a comunicar de forma standard com o MongoDB.

const UserSchema = new Schema({
  email: {
    type: String,
    unique: [true, 'Email already exists!'],
    required: [true, 'Email is required!']
  },
  username: {
    type: String,
    required: [true, 'Username is required!'],
    match: [
      /[A-Za-z]+/,
      'Username invalid, it should contain 8-20 alphanumeric letters and be unique!'
    ]
  },
  image: {
    type: String
  }
})

// Como esta route é dinâmica e a conexão à DB é intermintente tem que se fazer este check:
// Se User já existe em models (importado em cima), reusa-se esse; senão cria-se um novo model.
const User = models.User || model("User", UserSchema)

export default User