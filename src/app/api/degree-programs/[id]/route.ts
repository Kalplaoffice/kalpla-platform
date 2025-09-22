import { NextRequest, NextResponse } from 'next/server';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import amplifyconfig from '@/amplifyconfiguration.json';
import { updateDegreeProgram, deleteDegreeProgram } from '@/graphql/mutations';
import { getDegreeProgram } from '@/graphql/queries';

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

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data } = await client.graphql({
      query: getDegreeProgram,
      variables: {
        id: params.id
      }
    });

    if (!data.getDegreeProgram) {
      return NextResponse.json(
        { error: 'Degree program not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ degreeProgram: data.getDegreeProgram });
  } catch (error) {
    console.error('Error in GET /api/degree-programs/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Update the degree program
    const { data } = await client.graphql({
      query: updateDegreeProgram,
      variables: {
        input: {
          id: params.id,
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
      message: 'Degree program updated successfully',
      degreeProgram: data.updateDegreeProgram
    });
  } catch (error) {
    console.error('Error in PUT /api/degree-programs/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data } = await client.graphql({
      query: deleteDegreeProgram,
      variables: {
        input: {
          id: params.id
        }
      }
    });

    return NextResponse.json({ 
      message: 'Degree program deleted successfully' 
    });
  } catch (error) {
    console.error('Error in DELETE /api/degree-programs/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
