import { NextRequest, NextResponse } from 'next/server';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import amplifyconfig from '@/amplifyconfiguration.json';
import { createDegreeProgram } from '@/graphql/mutations';
import { listDegreePrograms } from '@/graphql/queries';

// Configure Amplify with API key authentication
const config = {
  ...amplifyconfig,
  aws_appsync_authenticationType: 'API_KEY'
};

Amplify.configure(config);

// Generate client with API key auth mode for server-side operations
const client = generateClient({
  authMode: 'apiKey'
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const mode = searchParams.get('mode');
    const search = searchParams.get('search');

    // Build filter conditions
    let filter: any = {};
    
    if (status && status !== 'all') {
      filter.status = { eq: status };
    }
    
    if (mode && mode !== 'all') {
      filter.mode = { eq: mode };
    }

    if (search) {
      filter.or = [
        { name: { contains: search } },
        { specialization: { contains: search } }
      ];
    }

    const { data } = await client.graphql({
      query: listDegreePrograms,
      variables: {
        filter: Object.keys(filter).length > 0 ? filter : undefined
      }
    });

    return NextResponse.json({ degreePrograms: data.listDegreePrograms.items });
  } catch (error) {
    console.error('Error in GET /api/degree-programs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'duration', 'mode', 'schedule', 'description', 'eligibility', 'targetAudience'];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Create the degree program
    const { data } = await client.graphql({
      query: createDegreeProgram,
      variables: {
        input: {
          name: body.name,
          specialization: body.specialization || '',
          duration: body.duration,
          mode: body.mode,
          schedule: body.schedule,
          description: body.description,
          features: body.features || [],
          advantages: body.advantages || [],
          eligibility: body.eligibility,
          targetAudience: body.targetAudience,
          registrationLink: body.registrationLink || '',
          image: body.image || '',
          status: body.status || 'active',
          totalStudents: body.totalStudents || 0,
          revenue: body.revenue || '₹0'
        }
      }
    });

    return NextResponse.json({ 
      message: 'Degree program created successfully',
      degreeProgram: data.createDegreeProgram
    }, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/degree-programs:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
