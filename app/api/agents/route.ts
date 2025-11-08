import { NextRequest, NextResponse } from 'next/server';
import { agentService } from '@/lib/services/agentService';

export async function GET() {
  try {
    const agents = agentService.getAllAgents();
    return NextResponse.json({ agents });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch agents' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const agent = agentService.createAgent(body);
    return NextResponse.json({ agent }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to create agent' },
      { status: 500 }
    );
  }
}
