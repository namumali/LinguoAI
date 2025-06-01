import express, { Request, Response, NextFunction } from 'express';
import updateLanguages from '../controllers/user/updateLanguages';

const router = express.Router();

router.put('/update-languages', (req: Request, res: Response, next: NextFunction) => {
  updateLanguages(req, res, next);
});

export default router;
