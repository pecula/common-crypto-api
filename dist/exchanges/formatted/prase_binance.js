"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTrade = parseTrade;
exports.parsePosition = parsePosition;
function parseTrade(trade) {
    return {
        info: trade,
        id: trade.id.toString(),
        timestamp: trade.time,
        datetime: new Date(trade.time).toISOString(),
        symbol: `${trade.symbol.slice(0, -4)}/${trade.symbol.slice(-4)}:USDT`,
        order: trade.orderId.toString(),
        type: undefined, // Binance does not provide order type in trade data
        side: trade.side.toLowerCase(),
        takerOrMaker: trade.maker ? 'maker' : 'taker',
        price: parseFloat(trade.price),
        amount: parseFloat(trade.qty),
        cost: parseFloat(trade.price) * parseFloat(trade.qty),
        fee: {
            cost: parseFloat(trade.commission),
            currency: trade.commissionAsset,
        },
        fees: [
            {
                cost: parseFloat(trade.commission),
                currency: trade.commissionAsset,
            },
        ],
    };
}
function parsePosition(position) {
    const entryPrice = position.entryPrice;
    if (entryPrice === '0' || entryPrice === '0.0' || entryPrice === '0.00000000') {
        return null;
    }
    const notional = Math.abs(parseFloat(position.notional));
    const contracts = parseFloat(position.positionAmt);
    const unrealizedPnl = parseFloat(position.unRealizedProfit);
    const leverage = parseInt(position.leverage);
    const liquidationPrice = parseFloat(position.liquidationPrice);
    const entryPriceFloat = parseFloat(position.entryPrice);
    const markPrice = parseFloat(position.markPrice);
    const collateral = Math.abs((contracts * entryPriceFloat) / leverage);
    const initialMargin = (contracts * entryPriceFloat) / leverage;
    const maintenanceMargin = contracts * markPrice * 0.004;
    const marginRatio = maintenanceMargin / collateral;
    const percentage = (unrealizedPnl / initialMargin) * 100;
    const timestamp = parseInt(position.updateTime);
    return {
        info: position,
        symbol: `${position.symbol.slice(0, -4)}/${position.symbol.slice(-4)}:USDT`,
        contracts,
        contractSize: 1,
        unrealizedPnl,
        leverage,
        liquidationPrice,
        collateral,
        notional,
        markPrice,
        entryPrice: entryPriceFloat,
        timestamp,
        initialMargin,
        initialMarginPercentage: 1 / leverage,
        maintenanceMargin,
        maintenanceMarginPercentage: 0.004,
        marginRatio,
        datetime: new Date(timestamp).toISOString(),
        marginMode: position.marginType,
        marginType: position.marginType,
        side: position.positionSide.toLowerCase(),
        hedged: true,
        percentage,
    };
}
