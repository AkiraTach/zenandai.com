// Agent Service - Manages AI agent lifecycle and execution

import { Agent, Trade, INITIAL_CAPITAL } from '@/types';
import { mcpServer } from '@/lib/mcp/server';

export class AgentService {
  private agents: Map<string, Agent>;
  private executionIntervals: Map<string, NodeJS.Timeout>;

  constructor() {
    this.agents = new Map();
    this.executionIntervals = new Map();
  }

  createAgent(agentData: Partial<Agent>): Agent {
    const agent: Agent = {
      id: `agent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: agentData.name || 'Unnamed Agent',
      description: agentData.description || '',
      owner: agentData.owner || 'anonymous',
      model: agentData.model || 'gpt-4',
      prompt: agentData.prompt || '',
      strategy: agentData.strategy || '',
      capital: INITIAL_CAPITAL,
      totalReturn: 0,
      trades: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      isActive: false,
    };

    this.agents.set(agent.id, agent);
    return agent;
  }

  getAgent(id: string): Agent | undefined {
    return this.agents.get(id);
  }

  getAllAgents(): Agent[] {
    return Array.from(this.agents.values());
  }

  updateAgent(id: string, updates: Partial<Agent>): Agent | undefined {
    const agent = this.agents.get(id);
    if (!agent) return undefined;

    const updatedAgent = {
      ...agent,
      ...updates,
      updatedAt: new Date(),
    };

    this.agents.set(id, updatedAgent);
    return updatedAgent;
  }

  deleteAgent(id: string): boolean {
    this.stopAgent(id);
    return this.agents.delete(id);
  }

  async startAgent(id: string): Promise<boolean> {
    const agent = this.agents.get(id);
    if (!agent) return false;

    agent.isActive = true;
    this.agents.set(id, agent);

    // Execute strategy every hour (3600000 ms)
    const interval = setInterval(() => {
      this.executeAgentStrategy(id);
    }, 3600000); // 1 hour

    this.executionIntervals.set(id, interval);

    // Execute immediately on start
    await this.executeAgentStrategy(id);

    return true;
  }

  stopAgent(id: string): boolean {
    const agent = this.agents.get(id);
    if (!agent) return false;

    agent.isActive = false;
    this.agents.set(id, agent);

    const interval = this.executionIntervals.get(id);
    if (interval) {
      clearInterval(interval);
      this.executionIntervals.delete(id);
    }

    return true;
  }

  private async executeAgentStrategy(agentId: string): Promise<void> {
    const agent = this.agents.get(agentId);
    if (!agent || !agent.isActive) return;

    try {
      // Get current portfolio
      const portfolio = await mcpServer.executeTool('get_portfolio', { agentId }) as Record<string, unknown>;

      // Get market data for decision making
      const marketData = await mcpServer.executeTool('get_market_data', {
        symbol: 'AAPL',
        timeframe: '1h'
      }) as { price: number };

      // Execute AI model decision (simplified - would call actual AI API)
      const decision = await this.makeDecision(agent, portfolio);

      if (decision && decision.action !== 'hold') {
        await mcpServer.executeTool('place_order', {
          symbol: decision.symbol,
          action: decision.action,
          quantity: decision.quantity
        });

        // Record trade
        const trade: Trade = {
          id: `trade_${Date.now()}`,
          agentId: agent.id,
          symbol: decision.symbol,
          action: decision.action,
          quantity: decision.quantity,
          price: marketData.price,
          timestamp: new Date(),
          reasoning: decision.reasoning
        };

        agent.trades.push(trade);
        this.agents.set(agentId, agent);
      }
    } catch (error) {
      console.error(`Error executing strategy for agent ${agentId}:`, error);
    }
  }

  private async makeDecision(agent: Agent, portfolio: Record<string, unknown>) {
    // This is a simplified decision engine
    // In production, this would call the actual AI model (GPT, Claude, Qwen)
    // using the agent's prompt and strategy

    // Placeholder logic
    const random = Math.random();
    const positions = (portfolio.positions as unknown[]) || [];
    
    if (random > 0.7) {
      return {
        symbol: 'AAPL',
        action: 'buy' as const,
        quantity: 10,
        reasoning: 'Market conditions favorable for purchase'
      };
    } else if (random < 0.3 && positions.length > 0) {
      return {
        symbol: 'AAPL',
        action: 'sell' as const,
        quantity: 5,
        reasoning: 'Taking profits based on strategy'
      };
    }

    return { action: 'hold' as const };
  }

  async backtest(agentId: string, startDate: Date, endDate: Date): Promise<unknown> {
    const agent = this.agents.get(agentId);
    if (!agent) throw new Error('Agent not found');

    return await mcpServer.executeTool('evaluate_strategy', {
      agentId,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    });
  }
}

export const agentService = new AgentService();
