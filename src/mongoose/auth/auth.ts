import jwt, { Secret } from 'jsonwebtoken'

import bcrypt from 'bcrypt'
import userModel from '../models/user'

const generateAccessToken = (data: any) => {
  try {
    const token = jwt.sign(data, process.env.ACCESS_KEY as Secret, {
      expiresIn: '1d',
    })
    return token
  } catch (e) {
    console.log('this error is from access token generator function', e)
  }
}

const generateRefreshToken = (data: any) => {
  try {
    const token = jwt.sign(data, process.env.REFRESH_KEY as Secret, {
      expiresIn: '1y',
    })
    return token
  } catch (e) {
    console.log('this error is from refresh token generating function side ', e)
  }
}
export async function register(req: any, res: any) {
  try {
    const { email, password, firstName, lastName, gender, dob } = req.body
    let user = await userModel.findOne({ email })
    if (user) {
      return res.status(409).send('User is already registered')
    }
    const hashPassword = await bcrypt.hash(password, 10)
    user = new userModel({
      email,
      password_salt: hashPassword, // Assuming you will hash the password before saving it
      first_name: firstName,
      last_name: lastName,
      gender,
      dob,
    })
    return user._id
  } catch (e) {
    return res.status(500).send(e)
  }
}
export async function login(req: any, res: any) {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).send('Plz enter email id/password')
    }
    const user = await userModel.findOne({ email }).select('+password')
    if (!user) {
      return res.status(404).send('User is not registered')
    }
    const matchPassword = await bcrypt.compare(password, user.password)
    if (!matchPassword) {
      return res.status(403).send('Incorrect password')
    }
    const accessToken = generateAccessToken({ _id: user._id })
    const refreshToken = generateRefreshToken({ _id: user._id })
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      secure: true,
    })
    return res.status(200).send({ accessToken })
  } catch (e) {
    console.log('this is the error from login side', e)
    return res.status(500).send(e)
  }
}
