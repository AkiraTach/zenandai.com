import { NextRequest, NextResponse } from 'next/server';
import { agentService } from '@/lib/services/agentService';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const success = await agentService.startAgent(params.id);
    if (!success) {
      return NextResponse.json(
        { error: 'Agent not found or already running' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, message: 'Agent started' });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to start agent' },
      { status: 500 }
    );
  }
}
