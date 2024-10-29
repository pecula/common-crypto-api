import { Request, response, Response } from 'express';

import { MultiExchangeAPI } from '../services/multiexchange';

export const getBalance = async (req: Request, res: Response): Promise<void> => {
    try {
        const multiExchange = new MultiExchangeAPI('binance', 'a420fefe7d78a366a3daab941cfc181f88e03ac3daccb4b9c5456823557c4e50', 'ac649a0c10c9a1d3ddc92bf49622a6467ab1b3b9a6b0a175c75df0784c917e89', true);

        const response = await multiExchange.getBalance();
        res.status(200).json({ balance: response });
        return;
    } catch (error) {
        res.status(500).json({ error: error });
    }
};
export const fetchAllOrders = async (req: Request, res: Response): Promise<void> => {
    try {
        const multiExchange = new MultiExchangeAPI('binance', 'a420fefe7d78a366a3daab941cfc181f88e03ac3daccb4b9c5456823557c4e50', 'ac649a0c10c9a1d3ddc92bf49622a6467ab1b3b9a6b0a175c75df0784c917e89', true);

        const response = await multiExchange.fetchAllOrders();
        res.status(200).json({ orders: response });
        return;
    } catch (error) {
        res.status(500).json({ error: error });
    }
};
export const getLeverage = async (req: Request, res: Response): Promise<void> => {
    try {
        const multiExchange = new MultiExchangeAPI('binance', 'a420fefe7d78a366a3daab941cfc181f88e03ac3daccb4b9c5456823557c4e50', 'ac649a0c10c9a1d3ddc92bf49622a6467ab1b3b9a6b0a175c75df0784c917e89', true);

        const response = await multiExchange.getLeverage();
        res.status(200).json({ leverage: response });
        return;
    } catch (error) {
        res.status(500).json({ error: error });
    }
};
export const setLeverage = async (req: Request, res: Response): Promise<void> => {
    try {
        const multiExchange = new MultiExchangeAPI('binance', 'a420fefe7d78a366a3daab941cfc181f88e03ac3daccb4b9c5456823557c4e50', 'ac649a0c10c9a1d3ddc92bf49622a6467ab1b3b9a6b0a175c75df0784c917e89', true);

        const response = await multiExchange.setLeverage(req.body.symbol, req.body.leverage);
        res.status(200).json({ leverage: response });
        return;
    } catch (error) {
        res.status(500).json({ error: error });
    }
};
export const placeOrder = async (req: Request, res: Response): Promise<void> => {
    try {
        const multiExchange = new MultiExchangeAPI('binance', 'a420fefe7d78a366a3daab941cfc181f88e03ac3daccb4b9c5456823557c4e50', 'ac649a0c10c9a1d3ddc92bf49622a6467ab1b3b9a6b0a175c75df0784c917e89', true);

        const response = await multiExchange.placeOrder(req.body.symbol, req.body.type, req.body.side, req.body.quantity, req.body.price);
        res.status(200).json({ details: response });
        return;
    } catch (error) {
        res.status(500).json({ error: error });
    }
};