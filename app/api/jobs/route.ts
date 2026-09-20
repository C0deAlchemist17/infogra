// API endpoint for job management
import { NextRequest, NextResponse } from 'next/server'
import { getJobManager } from '@/lib/jobs/job-manager'
import { isAdminRequest, unauthorizedResponse } from '@/lib/auth/admin-auth'

export async function GET(request: NextRequest) {
  // Check authentication
  if (!isAdminRequest(request)) {
    return unauthorizedResponse()
  }
  
  const searchParams = request.nextUrl.searchParams
  const jobId = searchParams.get('jobId')
  const action = searchParams.get('action')
  
  const jobManager = getJobManager()
  
  if (jobId) {
    // Get specific job
    const job = jobManager.getJob(jobId)
    if (!job) {
      return NextResponse.json({
        success: false,
        error: 'Job not found'
      }, { status: 404 })
    }
    
    if (action === 'retry') {
      const retryJob = await jobManager.retryFailed(jobId)
      return NextResponse.json({
        success: true,
        job: retryJob
      })
    }
    
    if (action === 'resume') {
      const resumeJob = await jobManager.resumeJob(jobId)
      return NextResponse.json({
        success: true,
        job: resumeJob
      })
    }
    
    if (action === 'cancel') {
      const cancelled = jobManager.cancelJob(jobId)
      return NextResponse.json({
        success: cancelled,
        job: jobManager.getJob(jobId)
      })
    }
    
    return NextResponse.json({
      success: true,
      job
    })
  } else {
    // Get all jobs
    const jobs = jobManager.getAllJobs()
    return NextResponse.json({
      success: true,
      jobs
    })
  }
}

export async function POST(request: NextRequest) {
  // Check authentication
  if (!isAdminRequest(request)) {
    return unauthorizedResponse()
  }
  
  try {
    const body = await request.json()
    const jobManager = getJobManager()
    
    if (body.action === 'create') {
      const job = jobManager.createJob(body.config)
      jobManager.startProcessing()
      
      return NextResponse.json({
        success: true,
        job
      })
    }
    
    if (body.action === 'cleanup') {
      const cleaned = jobManager.cleanupOldJobs()
      return NextResponse.json({
        success: true,
        cleaned
      })
    }
    
    return NextResponse.json({
      success: false,
      error: 'Invalid action'
    }, { status: 400 })
    
  } catch (error) {
    console.error('Job API error:', error)
    return NextResponse.json({
      success: false,
      error: String(error)
    }, { status: 500 })
  }
}