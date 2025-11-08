// Trading Engine - Handles order execution and portfolio management

import { Trade, Position, MarketData } from '@/types';

export class TradingEngine {
  private positions: Map<string, Map<string, Position>>;
  private cash: Map<string, number>;

  constructor() {
    this.positions = new Map();
    this.cash = new Map();
  }

  initializeAccount(agentId: string, initialCapital: number): void {
    this.positions.set(agentId, new Map());
    this.cash.set(agentId, initialCapital);
  }

  executeTrade(agentId: string, trade: Trade, currentPrice: number): boolean {
    const agentPositions = this.positions.get(agentId);
    const agentCash = this.cash.get(agentId);

    if (!agentPositions || agentCash === undefined) {
      throw new Error('Agent account not initialized');
    }

    const totalCost = trade.quantity * currentPrice;

    if (trade.action === 'buy') {
      // Check if enough cash
      if (agentCash < totalCost) {
        return false;
      }

      // Update cash
      this.cash.set(agentId, agentCash - totalCost);

      // Update or create position
      const existingPosition = agentPositions.get(trade.symbol);
      if (existingPosition) {
        const newQuantity = existingPosition.quantity + trade.quantity;
        const newAvgPrice = 
          (existingPosition.averagePrice * existingPosition.quantity + totalCost) / newQuantity;
        
        existingPosition.quantity = newQuantity;
        existingPosition.averagePrice = newAvgPrice;
        existingPosition.currentPrice = currentPrice;
      } else {
        agentPositions.set(trade.symbol, {
          symbol: trade.symbol,
          quantity: trade.quantity,
          averagePrice: currentPrice,
          currentPrice: currentPrice,
          profitLoss: 0,
          profitLossPercent: 0
        });
      }
    } else if (trade.action === 'sell') {
      const position = agentPositions.get(trade.symbol);
      if (!position || position.quantity < trade.quantity) {
        return false;
      }

      // Update cash
      this.cash.set(agentId, agentCash + totalCost);

      // Update position
      position.quantity -= trade.quantity;
      if (position.quantity === 0) {
        agentPositions.delete(trade.symbol);
      }
    }

    return true;
  }

  getPortfolio(agentId: string): {
    cash: number;
    positions: Position[];
    totalValue: number;
  } {
    const agentPositions = this.positions.get(agentId);
    const agentCash = this.cash.get(agentId);

    if (!agentPositions || agentCash === undefined) {
      return { cash: 0, positions: [], totalValue: 0 };
    }

    const positions = Array.from(agentPositions.values());
    const positionsValue = positions.reduce(
      (sum, pos) => sum + pos.quantity * pos.currentPrice,
      0
    );

    return {
      cash: agentCash,
      positions,
      totalValue: agentCash + positionsValue
    };
  }

  updateMarketPrices(agentId: string, marketData: MarketData[]): void {
    const agentPositions = this.positions.get(agentId);
    if (!agentPositions) return;

    marketData.forEach(data => {
      const position = agentPositions.get(data.symbol);
      if (position) {
        position.currentPrice = data.price;
        position.profitLoss = 
          (data.price - position.averagePrice) * position.quantity;
        position.profitLossPercent = 
          ((data.price - position.averagePrice) / position.averagePrice) * 100;
      }
    });
  }

  calculateReturn(agentId: string, initialCapital: number): number {
    const portfolio = this.getPortfolio(agentId);
    return ((portfolio.totalValue - initialCapital) / initialCapital) * 100;
  }
}

export const tradingEngine = new TradingEngine();
