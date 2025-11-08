'use client';

import { useState } from 'react';
import { Activity, ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CreateAgent() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    model: 'gpt-4',
    prompt: '',
    strategy: 'momentum'
  });
  const [creating, setCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          owner: 'user_demo'
        })
      });

      if (response.ok) {
        router.push('/dashboard');
      } else {
        alert('Failed to create agent');
      }
    } catch (error) {
      console.error('Failed to create agent:', error);
      alert('Failed to create agent');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4 border-b border-slate-700">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <Activity className="h-8 w-8 text-blue-400" />
            <span className="text-2xl font-bold text-white">ZEN AND AI</span>
          </Link>
          <Link href="/dashboard" className="flex items-center space-x-2 text-gray-300 hover:text-white transition">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center space-x-3 mb-8">
            <Sparkles className="h-10 w-10 text-blue-400" />
            <h1 className="text-4xl font-bold text-white">Create AI Agent</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Basic Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Agent Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Momentum Trader Pro"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                    placeholder="Describe your agent's trading approach..."
                  />
                </div>
              </div>
            </div>

            {/* AI Model Selection */}
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">AI Model</h2>
              
              <div className="grid md:grid-cols-3 gap-4">
                <ModelCard
                  name="GPT-4"
                  value="gpt-4"
                  description="Most capable, balanced reasoning"
                  selected={formData.model === 'gpt-4'}
                  onSelect={() => setFormData({ ...formData, model: 'gpt-4' })}
                />
                <ModelCard
                  name="Claude 3 Opus"
                  value="claude-3-opus"
                  description="Excellent analysis, careful"
                  selected={formData.model === 'claude-3-opus'}
                  onSelect={() => setFormData({ ...formData, model: 'claude-3-opus' })}
                />
                <ModelCard
                  name="Qwen Max"
                  value="qwen-max"
                  description="Fast, efficient decisions"
                  selected={formData.model === 'qwen-max'}
                  onSelect={() => setFormData({ ...formData, model: 'qwen-max' })}
                />
              </div>
            </div>

            {/* Trading Strategy */}
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Trading Strategy</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2">Strategy Type</label>
                  <select
                    value={formData.strategy}
                    onChange={(e) => setFormData({ ...formData, strategy: e.target.value })}
                    className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="momentum">Momentum Trading</option>
                    <option value="value">Value Investing</option>
                    <option value="mean-reversion">Mean Reversion</option>
                    <option value="trend-following">Trend Following</option>
                    <option value="custom">Custom Strategy</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">System Prompt *</label>
                  <textarea
                    required
                    value={formData.prompt}
                    onChange={(e) => setFormData({ ...formData, prompt: e.target.value })}
                    className="w-full bg-slate-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 h-48 font-mono text-sm"
                    placeholder={`You are a professional trading agent specializing in momentum strategies.

Your goal is to maximize returns while managing risk carefully.

When analyzing market data:
1. Look for strong price momentum
2. Consider volume patterns
3. Use technical indicators
4. Manage position sizes

Make decisions based on data and logic, not emotions.`}
                  />
                  <p className="text-gray-500 text-sm mt-2">
                    This prompt will guide your AI agent&apos;s trading decisions
                  </p>
                </div>
              </div>
            </div>

            {/* Capital Info */}
            <div className="bg-slate-800/50 backdrop-blur-lg rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Initial Capital</h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-green-400">$10,000</p>
                  <p className="text-gray-400 text-sm mt-1">Standard starting capital for all agents</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-300 text-sm">Execution Frequency</p>
                  <p className="text-xl font-semibold text-blue-400">Every 1 Hour</p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={creating}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition flex items-center justify-center space-x-2"
            >
              {creating ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Creating Agent...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  <span>Deploy Agent</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function ModelCard({ 
  name, 
  description, 
  selected, 
  onSelect 
}: { 
  name: string; 
  value: string; 
  description: string; 
  selected: boolean; 
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`p-4 rounded-lg text-left transition ${
        selected 
          ? 'bg-blue-600 border-2 border-blue-400' 
          : 'bg-slate-700 border-2 border-transparent hover:border-slate-500'
      }`}
    >
      <h3 className="text-white font-semibold mb-1">{name}</h3>
      <p className="text-gray-300 text-sm">{description}</p>
    </button>
  );
}
