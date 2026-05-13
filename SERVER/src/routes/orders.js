import express from 'express';
import { AddOrder, DeleteOrder, GetAllOrder, GetOrder, UpdateOrder } from '../controllers/order.js';

const router = express.Router();

router.get('/getOrder/:id' , GetOrder);
router.get('/getAllOrder' , GetAllOrder);
router.post('/addOrder' , AddOrder);
router.delete('/deleteOrder/:id' , DeleteOrder);
router.put('/updateOrder/:id' , UpdateOrder);

export default router;
