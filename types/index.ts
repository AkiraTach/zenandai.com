// Core type definitions for ZEN AND AI platform

export interface Agent {
  id: string;
  name: string;
  description: string;
  owner: string;
  model: ModelType;
  prompt: string;
  strategy: string;
  capital: number;
  totalReturn: number;
  trades: Trade[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export type ModelType = 'gpt-4' | 'gpt-3.5-turbo' | 'claude-3-opus' | 'claude-3-sonnet' | 'qwen-max' | 'qwen-turbo';

export interface Trade {
  id: string;
  agentId: string;
  symbol: string;
  action: 'buy' | 'sell';
  quantity: number;
  price: number;
  timestamp: Date;
  profit?: number;
  reasoning?: string;
}

export interface Position {
  symbol: string;
  quantity: number;
  averagePrice: number;
  currentPrice: number;
  profitLoss: number;
  profitLossPercent: number;
}

export interface MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: Date;
}

export interface User {
  id: string;
  username: string;
  email: string;
  credits: number;
  monthlyFreeCredits: number;
  lastLogin: Date;
  agents: Agent[];
}

export interface AgentToken {
  agentId: string;
  price: number;
  currency: string;
}

export interface Subscription {
  userId: string;
  type: 'basic' | 'premium' | 'enterprise';
  status: 'active' | 'cancelled' | 'expired';
  startDate: Date;
  endDate: Date;
}

export interface BacktestConfig {
  startDate: Date;
  endDate: Date;
  initialCapital: number;
  executionFrequency: 'hourly' | 'daily';
}

export interface MCPTool {
  name: string;
  description: string;
  parameters: Record<string, any>;
}

export const NASDAQ_100_SYMBOLS = [
  'AAPL', 'MSFT', 'GOOGL', 'AMZN', 'NVDA', 'META', 'TSLA', 'AVGO', 'COST', 'NFLX',
  'AMD', 'PEP', 'ADBE', 'CSCO', 'CMCSA', 'TMUS', 'INTC', 'TXN', 'QCOM', 'AMGN'
  // ... more symbols can be added
];

export const INITIAL_CAPITAL = 10000;
export const EXECUTION_FREQUENCY_HOURS = 1;
