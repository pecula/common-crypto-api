"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTrade = parseTrade;
exports.parsePosition = parsePosition;
exports.parseAllOrders = parseAllOrders;
exports.parseLoadmarketes = parseLoadmarketes;
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
function parseAllOrders(position) {
    const price = parseFloat(position.avgPrice);
    const cost = parseFloat(position.cumQuote);
    const allOrders = {
        info: position,
        id: position.orderId,
        reduceOnly: position.reduceOnly,
        side: position.side,
        symbol: position.symbol,
        status: position.status,
        type: position.type,
        timeInForce: position.timeInForce,
        clientOrderId: position.clientOrderId,
        price,
        cost
    };
    return allOrders;
}
function parseLoadmarketes(position) {
    const symbolsArray = position.symbols;
    const result = symbolsArray.reduce((acc, item) => {
        let max;
        let min;
        let parseLoadmarketesLimits = { price: { min: 0, max: 0 }, amount: { min: 0, max: 0 }, cost: { min: 0, max: 0 }, market: { min: 0, max: 0 } };
        for (const elem of item.filters) {
            if (elem.filterType == "PRICE_FILTER") {
                parseLoadmarketesLimits.price.max = parseFloat(elem.maxPrice);
                parseLoadmarketesLimits.price.min = parseFloat(elem.minPrice);
            }
            else if (elem.filterType == "LOT_SIZE") {
                parseLoadmarketesLimits.amount.max = parseFloat(elem.maxQty);
                parseLoadmarketesLimits.amount.min = parseFloat(elem.minQty);
            }
            else if (elem.filterType == "NOTIONAL") {
                parseLoadmarketesLimits.cost.max = parseFloat(elem.maxNotional);
                parseLoadmarketesLimits.cost.min = parseFloat(elem.minNotional);
            }
            else if (elem.filterType == "MARKET_LOT_SIZE") {
                parseLoadmarketesLimits.market.max = parseFloat(elem.maxQty);
                parseLoadmarketesLimits.market.min = parseFloat(elem.minQty);
            }
        }
        acc[`${item.baseAsset}/${item.quoteAsset}`] = {
            id: item.symbol,
            status: item.status,
            base: item.baseAsset,
            baseId: item.baseAsset,
            quote: item.quoteAsset,
            quoteId: item.quoteAsset,
            spot: item.isSpotTradingAllowed,
            margin: item.isMarginTradingAllowed,
            limits: parseLoadmarketesLimits,
        };
        return acc;
    }, {});
    return result;
}
