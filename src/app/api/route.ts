import { NextResponse } from 'next/server';

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      message: 'welcome to our api'
    });
  } catch (error) {
    console.error('Failed to load the API:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to load the API:', error
    },
      {
        status: 500
      }
    );
  }
}