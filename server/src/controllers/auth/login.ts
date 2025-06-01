import { type RequestHandler } from 'express'
import joi from '../../utils/joi'
import jwt from '../../utils/jwt'
import crypt from '../../utils/crypt'
import Account from '../../models/Account'

const login: RequestHandler = async (req, res, next) => {
  try {
    const validationError = await joi.validate(
      {
        username: joi.instance.string().required(),
        password: joi.instance.string().required(),
      },
      req.body
    )

    if (validationError) {
      return next(validationError)
    }

    const { username, password } = req.body

    // Get account from DB, and verify existence
    const account = await Account.findOne({ username })

    if (!account) {
      return next({
        statusCode: 400,
        message: 'Bad credentials',
      })
    }

    // Verify password hash
    const passOk = await crypt.validate(password, account.password)

    if (!passOk) {
      return next({
        statusCode: 400,
        message: 'Bad credentials',
      })
    }

    // Generate access token
    const token = jwt.signToken({ uid: account._id, role: account.role })

    // Construct complete user profile to send to frontend
    const { password: _, ...accountData } = account.toObject()

    res.status(200).json({
      message: 'Successfully logged-in',
      data: {
        id: accountData._id,            // ✅ explicitly pass as 'id'
        username: account.username,
        nativeLanguage: account.nativeLanguage,
        learningLanguages: account.learningLanguages,
        role: account.role,
      },
      token,
    })
  } catch (error) {
    next(error)
  }
}



export default login
