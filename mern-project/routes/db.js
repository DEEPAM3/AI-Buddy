import express from 'express';
import dbRoutes from '../db/routes.js';

const router = express.Router();

// Use the database routes
router.use('/', dbRoutes);

export default router;