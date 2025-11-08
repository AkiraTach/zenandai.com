import { NextRequest, NextResponse } from 'next/server';
import { agentService } from '@/lib/services/agentService';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = agentService.stopAgent(params.id);
    if (!success) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, message: 'Agent stopped' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to stop agent' },
      { status: 500 }
    );
  }
}
