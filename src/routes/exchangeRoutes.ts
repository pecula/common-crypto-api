import { Router } from 'express';
import { getBalance, fetchAllOrders, getLeverage, setLeverage, placeOrder } from '../controllers/exchangeController';
const router = Router();
/**
 * @swagger
 * /api/balance:
 *   post:
 *     summary: Get exchange balance
 *     responses:
 *       200:
 *         description: To get exchange balance
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["ace"]
 */
router.post('/balance', getBalance);
/**
 * @swagger
 * /api/all_orders:
 *   get:
 *     summary: Get exchange orders
 *     responses:
 *       200:
 *         description: To get exchange orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["ace"]
 */
router.get('/all_orders', fetchAllOrders);
/**
 * @swagger
 * /api/leverage:
 *   get:
 *     summary: Get exchange leverage
 *     responses:
 *       200:
 *         description: To get exchange leverage
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["ace"]
 */
router.get('/leverage', getLeverage);
/**
 * @swagger
 * /api/leverage:
 *   post:
 *     summary: To set leverage
 *     description: To set leverage.</br>https://developers.binance.com/docs/derivatives/usds-margined-futures/general-info
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               leverage:
 *                 type: number
 *                 example: 10
 *               symbol:
 *                 type: string
 *                 example: ETHUSDT
 *     responses:
 *       200:
 *         description: Leverage set successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Leverage set successfully.
 *       400:
 *         description: Invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid request body.
 */
router.post('/leverage', setLeverage);
/**
 * @swagger
 * /api/place-order:
 *   post:
 *     summary: To place order
 *     description: To place order.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               type:
 *                 type: string
 *                 example: MARKET
 *               quantity:
 *                 type: number
 *                 example: 0.001
 *               side:
 *                 type: string
 *                 example: BUY
 *               symbol:
 *                 type: string
 *                 example: ETHUSDT
 *     responses:
 *       200:
 *         description: Order place successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Order place successfully.
 *       400:
 *         description: Invalid input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid request body.
 */
router.post('/place-order', placeOrder);
export default router;