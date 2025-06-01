import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import Account from '../../models/Account'

export interface AuthenticatedRequest extends Request {
  user?: { id: string; [key: string]: any }
}

const loginWithToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Use index notation and cast authorization as string
    const authHeader = req.headers['authorization'] as string | undefined
    if (!authHeader) {
      return res.status(401).json({ message: 'No token provided' })
    }

    const token = authHeader.split(' ')[1]
    const { uid } = jwt.verify(token, process.env.JWT_SECRET!) as { uid: string }

    // Get account from DB, password is not verified because we’re token-authorized
    const account = await Account.findOne({ _id: uid }).select('-password') as (typeof Account.prototype & { _id: any, role: string }) | null

    if (!account) {
      return next({
        statusCode: 400,
        message: 'Bad credentials',
      })
    }

    // Attach user to request (using type assertion)
    ;(req as AuthenticatedRequest).user = { id: account._id.toString(), role: account.role }

    // Generate access token (mapping _id to a string id)
    const newToken = jwt.sign({ uid: account._id.toString(), role: account.role }, process.env.JWT_SECRET!)

    res.status(200).json({
      message: 'Successfully got account',
      data: { ...account.toObject(), id: account._id.toString() },
      token: newToken,
    })
  } catch (error) {
    next(error)
  }
}

export default loginWithToken
