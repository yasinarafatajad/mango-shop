
import express from 'express';
import { addCustomer, deleteCustomer, getAllCustomer, getCustomer, updateCustomer } from '../controllers/customer.js';

const router = express.Router();

router.get('/getCustomer/:id', getCustomer)
router.get('/getAllCustomer', getAllCustomer)
router.post('/addCustomer', addCustomer)
router.put('/updateCustomer/:id', updateCustomer)
router.delete('/deleteCustomer/:id', deleteCustomer)

export default router;