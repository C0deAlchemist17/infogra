// API Route for Kimo Product Import
// Handles server-side import operations

import { NextRequest, NextResponse } from 'next/server'
import { ImportOrchestrator, ImportOptions, ImportReport } from '@/lib/importers/import-orchestrator'
import { isAdminRequest, unauthorizedResponse } from '@/lib/auth/admin-auth'

export async function POST(request: NextRequest) {
  // Check authentication
  if (!isAdminRequest(request)) {
    return unauthorizedResponse()
  }
  
  try {
    const body = await request.json()
    
    const options: ImportOptions = {
      mode: body.mode || 'scan',
      maxPagesPerCategory: body.maxPagesPerCategory || 5,
      mappingConfig: body.mappingConfig || {},
      onProgress: undefined // Progress will be sent via SSE in production
    }

    const orchestrator = new ImportOrchestrator()
    
    // Execute import (this will be async with progress updates in production)
    const report: ImportReport = await orchestrator.executeImport(options)

    return NextResponse.json({
      success: true,
      report
    })

  } catch (error) {
    console.error('Import error:', error)
    return NextResponse.json({
      success: false,
      error: String(error)
    }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  // Check authentication
  if (!isAdminRequest(request)) {
    return unauthorizedResponse()
  }
  
  try {
    const orchestrator = new ImportOrchestrator()
    const history = orchestrator.getImportHistory()
    
    return NextResponse.json({
      success: true,
      history: Array.from(history.entries())
    })

  } catch (error) {
    console.error('Error fetching import history:', error)
    return NextResponse.json({
      success: false,
      error: String(error)
    }, { status: 500 })
  }
}
