'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Activity, DollarSign, Bot, Play, Square } from 'lucide-react';
import Link from 'next/link';

interface Agent {
  id: string;
  name: string;
  model: string;
  capital: number;
  totalReturn: number;
  isActive: boolean;
  trades: unknown[];
}

export default function Dashboard() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAgents();
  }, []);

  const fetchAgents = async () => {
    try {
      const response = await fetch('/api/agents');
      const data = await response.json();
      setAgents(data.agents || []);
    } catch (error) {
      console.error('Failed to fetch agents:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAgent = async (agentId: string, isActive: boolean) => {
    try {
      const endpoint = isActive ? 'stop' : 'start';
      await fetch(`/api/agents/${agentId}/${endpoint}`, { method: 'POST' });
      fetchAgents();
    } catch (error) {
      console.error('Failed to toggle agent:', error);
    }
  };

  const totalCapital = agents.reduce((sum, agent) => sum + agent.capital, 0);
  const totalReturn = agents.reduce((sum, agent) => sum + agent.totalReturn, 0);
  const activeAgents = agents.filter(a => a.isActive).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4 border-b border-slate-700">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Activity className="h-8 w-8 text-blue-400" />
            <span className="text-2xl font-bold text-white">ZEN AND AI</span>
          </Link>
          <div className="flex space-x-4">
            <Link href="/dashboard" className="text-blue-400 font-semibold">Dashboard</Link>
            <Link href="/agents" className="text-gray-300 hover:text-white transition">My Agents</Link>
            <Link href="/" className="text-gray-300 hover:text-white transition">Market</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <h1 className="text-4xl font-bold text-white mb-8">Trading Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<DollarSign className="h-8 w-8 text-green-400" />}
            title="Total Capital"
            value={`$${totalCapital.toLocaleString()}`}
            change={totalReturn > 0 ? `+${totalReturn.toFixed(2)}%` : `${totalReturn.toFixed(2)}%`}
            positive={totalReturn >= 0}
          />
          <StatCard
            icon={<Bot className="h-8 w-8 text-blue-400" />}
            title="Active Agents"
            value={`${activeAgents} / ${agents.length}`}
            subtitle="Currently trading"
          />
          <StatCard
            icon={<TrendingUp className="h-8 w-8 text-purple-400" />}
            title="Total Trades"
            value={agents.reduce((sum, a) => sum + a.trades.length, 0).toString()}
            subtitle="All time"
          />
          <StatCard
            icon={<Activity className="h-8 w-8 text-yellow-400" />}
            title="Performance"
            value={totalReturn > 0 ? "Profitable" : "Learning"}
            subtitle={`${totalReturn > 0 ? '+' : ''}${totalReturn.toFixed(2)}% return`}
          />
        </div>

        {/* Agents List */}
        <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Your AI Agents</h2>
            <Link 
              href="/agents/create"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
            >
              Create New Agent
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading agents...</div>
          ) : agents.length === 0 ? (
            <div className="text-center py-12">
              <Bot className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-4">No agents created yet</p>
              <Link 
                href="/agents/create"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
              >
                Create Your First Agent
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {agents.map(agent => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  onToggle={() => toggleAgent(agent.id, agent.isActive)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ 
  icon, 
  title, 
  value, 
  subtitle, 
  change, 
  positive 
}: { 
  icon: React.ReactNode; 
  title: string; 
  value: string; 
  subtitle?: string; 
  change?: string; 
  positive?: boolean;
}) {
  return (
    <div className="bg-slate-800/50 backdrop-blur-lg p-6 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        {icon}
        {change && (
          <span className={`text-sm font-semibold ${positive ? 'text-green-400' : 'text-red-400'}`}>
            {change}
          </span>
        )}
      </div>
      <h3 className="text-gray-400 text-sm mb-1">{title}</h3>
      <p className="text-2xl font-bold text-white">{value}</p>
      {subtitle && <p className="text-gray-500 text-sm mt-1">{subtitle}</p>}
    </div>
  );
}

function AgentCard({ 
  agent, 
  onToggle 
}: { 
  agent: Agent; 
  onToggle: () => void;
}) {
  return (
    <div className="bg-slate-700/50 p-4 rounded-lg flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
          agent.isActive ? 'bg-green-600' : 'bg-gray-600'
        }`}>
          <Bot className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-white font-semibold">{agent.name}</h3>
          <p className="text-gray-400 text-sm">
            {agent.model} • ${agent.capital.toLocaleString()} capital
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-6">
        <div className="text-right">
          <p className={`text-lg font-semibold ${
            agent.totalReturn >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {agent.totalReturn >= 0 ? '+' : ''}{agent.totalReturn.toFixed(2)}%
          </p>
          <p className="text-gray-400 text-sm">{agent.trades.length} trades</p>
        </div>
        <button
          onClick={onToggle}
          className={`p-2 rounded-lg transition ${
            agent.isActive 
              ? 'bg-red-600 hover:bg-red-700' 
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {agent.isActive ? (
            <Square className="h-5 w-5 text-white" />
          ) : (
            <Play className="h-5 w-5 text-white" />
          )}
        </button>
      </div>
    </div>
  );
}
