import { NextRequest, NextResponse } from 'next/server';

// Mock database - in a real application, this would be connected to your actual database
let degreePrograms = [
  {
    id: 1,
    name: 'Bachelor of Business Administration (BBA)',
    specialization: 'Entrepreneurship & Innovation',
    duration: '3 Years',
    mode: 'Hybrid',
    schedule: 'Monday–Friday, 7–9 PM',
    description: 'Comprehensive undergraduate program focusing on business fundamentals with specialization in entrepreneurship and innovation.',
    features: ['Industry-relevant curriculum', 'Internship opportunities', 'Mentorship from industry experts', 'Startup incubation support'],
    advantages: ['Global exchange programs', 'Industry partnerships', 'Career placement support', 'Alumni network'],
    eligibility: '10+2 with 50% marks',
    targetAudience: 'Students seeking business education with entrepreneurial focus',
    registrationLink: 'https://forms.google.com/bba-application',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop',
    status: 'active',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  },
  {
    id: 2,
    name: 'Master of Business Administration (MBA)',
    specialization: 'Digital Business & Strategy',
    duration: '2 Years',
    mode: 'Online',
    schedule: 'Weekend Classes',
    description: 'Advanced management program designed for future business leaders with focus on digital transformation and strategic thinking.',
    features: ['Case study methodology', 'Live projects with companies', 'International study tours', 'Leadership development'],
    advantages: ['Digital marketing specialization', 'Executive coaching', 'Peer learning', 'Capstone project'],
    eligibility: 'Bachelor degree with 50% marks',
    targetAudience: 'Working professionals seeking advanced management skills',
    registrationLink: 'https://forms.google.com/mba-application',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    status: 'active',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18'
  },
  {
    id: 3,
    name: 'Post Graduate Diploma in Management (PGDM)',
    specialization: 'Technology & Innovation',
    duration: '2 Years',
    mode: 'Offline',
    schedule: 'Monday–Friday, 9 AM–5 PM',
    description: 'Specialized diploma program focusing on technology management and innovation in modern business environments.',
    features: ['Technology-focused curriculum', 'Industry partnerships', 'Innovation labs access', 'Tech startup exposure'],
    advantages: ['Certification programs', 'Industry mentors', 'Project-based learning', 'Placement assistance'],
    eligibility: 'Bachelor degree with 45% marks',
    targetAudience: 'Graduates interested in technology management',
    registrationLink: 'https://forms.google.com/pgdm-application',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop',
    status: 'inactive',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-15'
  }
];

// GET /api/admin/degree-programs/[id] - Fetch a specific degree program
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const programId = parseInt(params.id);
    
    if (isNaN(programId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid program ID' },
        { status: 400 }
      );
    }

    const program = degreePrograms.find(p => p.id === programId);
    
    if (!program) {
      return NextResponse.json(
        { success: false, error: 'Degree program not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: program
    });
  } catch (error) {
    console.error('Error fetching degree program:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch degree program' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/degree-programs/[id] - Update a specific degree program
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const programId = parseInt(params.id);
    
    if (isNaN(programId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid program ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    const requiredFields = ['name', 'duration', 'mode', 'schedule', 'description', 'eligibility', 'targetAudience'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { success: false, error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate URL if provided
    if (body.registrationLink && !isValidUrl(body.registrationLink)) {
      return NextResponse.json(
        { success: false, error: 'Invalid registration link URL' },
        { status: 400 }
      );
    }

    if (body.image && !isValidUrl(body.image)) {
      return NextResponse.json(
        { success: false, error: 'Invalid image URL' },
        { status: 400 }
      );
    }

    const programIndex = degreePrograms.findIndex(p => p.id === programId);
    
    if (programIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Degree program not found' },
        { status: 404 }
      );
    }

    // Update the program
    const updatedProgram = {
      ...degreePrograms[programIndex],
      name: body.name,
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
      updatedAt: new Date().toISOString().split('T')[0]
    };

    degreePrograms[programIndex] = updatedProgram;

    return NextResponse.json({
      success: true,
      data: updatedProgram,
      message: 'Degree program updated successfully'
    });
  } catch (error) {
    console.error('Error updating degree program:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update degree program' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/degree-programs/[id] - Delete a specific degree program
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const programId = parseInt(params.id);
    
    if (isNaN(programId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid program ID' },
        { status: 400 }
      );
    }

    const programIndex = degreePrograms.findIndex(p => p.id === programId);
    
    if (programIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Degree program not found' },
        { status: 404 }
      );
    }

    // Remove the program
    const deletedProgram = degreePrograms.splice(programIndex, 1)[0];

    return NextResponse.json({
      success: true,
      data: deletedProgram,
      message: 'Degree program deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting degree program:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete degree program' },
      { status: 500 }
    );
  }
}

// Helper function to validate URLs
function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}
