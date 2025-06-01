import { Request, Response, NextFunction } from 'express';
import Account from '../../models/Account';

const updateLanguages = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('Received body:', req.body); // Debug log

    // Use userId from the authenticated context or AppContext
    const userId = req.body.userId; // pulled from frontend AppContext
    const { nativeLanguage, targetLanguage } = req.body;

    if (!userId || !nativeLanguage || !targetLanguage) {
      return res.status(400).json({ message: 'Missing required fields: userId, nativeLanguage, targetLanguage' });
    }

    const account = await Account.findById(userId);
    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    account.nativeLanguage = nativeLanguage;
    account.learningLanguages = [targetLanguage];

    await account.save();

    res.status(200).json({ message: 'Languages updated successfully', data: account });
  } catch (error) {
    console.error('Error in updateLanguages:', error);
    next(error);
  }
};

export default updateLanguages;