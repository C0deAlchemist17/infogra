// Background job manager for Kimo imports
// Supports job queuing, progress tracking, and resumable imports

import * as fs from 'fs'
import * as path from 'path'

export type JobStatus = 'queued' | 'scanning' | 'processing' | 'downloading_images' | 'importing' | 'completed' | 'failed' | 'cancelled'

export interface JobConfig {
  jobId: string
  type: 'import' | 'scan' | 'sync'
  categories?: string[]
  maxPages?: number
  pricingMode?: 'percentage' | 'fixed' | 'multiplier' | 'unchanged'
  pricingValue?: number
  syncStock?: boolean
  retryFailed?: boolean
  resumeFrom?: string
}

export interface JobProgress {
  jobId: string
  status: JobStatus
  startTime: string
  endTime?: string
  currentStep: string
  totalProducts: number
  processedProducts: number
  successfulProducts: number
  failedProducts: number
  skippedProducts: number
  updatedProducts: number
  categoriesDiscovered: number
  brandsDiscovered: number
  imagesDownloaded: number
  errors: Array<{ product: string; message: string }>
  warnings: string[]
  config: JobConfig
}

export interface JobQueue {
  jobs: Map<string, JobProgress>
  storagePath: string
}

export class JobManager {
  private queue: JobQueue
  private activeJobs: Set<string> = new Set()
  private maxConcurrentJobs = 2

  constructor(storagePath: string = 'D:/Systems/infogra/data/jobs') {
    this.queue = {
      jobs: new Map(),
      storagePath
    }
    
    // Ensure storage directory exists
    if (!fs.existsSync(storagePath)) {
      fs.mkdirSync(storagePath, { recursive: true })
    }
    
    // Load existing jobs
    this.loadJobs()
  }

  /**
   * Create a new job
   */
  createJob(config: JobConfig): JobProgress {
    const job: JobProgress = {
      jobId: config.jobId,
      status: 'queued',
      startTime: new Date().toISOString(),
      currentStep: 'Waiting to start',
      totalProducts: 0,
      processedProducts: 0,
      successfulProducts: 0,
      failedProducts: 0,
      skippedProducts: 0,
      updatedProducts: 0,
      categoriesDiscovered: 0,
      brandsDiscovered: 0,
      imagesDownloaded: 0,
      errors: [],
      warnings: [],
      config
    }
    
    this.queue.jobs.set(config.jobId, job)
    this.saveJobs()
    
    return job
  }

  /**
   * Get job by ID
   */
  getJob(jobId: string): JobProgress | undefined {
    return this.queue.jobs.get(jobId)
  }

  /**
   * Get all jobs
   */
  getAllJobs(): JobProgress[] {
    return Array.from(this.queue.jobs.values()).sort((a, b) => 
      new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    )
  }

  /**
   * Update job progress
   */
  updateJob(jobId: string, updates: Partial<JobProgress>): void {
    const job = this.queue.jobs.get(jobId)
    if (!job) return
    
    Object.assign(job, updates)
    this.saveJobs()
  }

  /**
   * Start processing queued jobs
   */
  async startProcessing(): Promise<void> {
    // Start jobs if under concurrent limit
    const queuedJobs = Array.from(this.queue.jobs.values())
      .filter(job => job.status === 'queued' && !this.activeJobs.has(job.jobId))
      .slice(0, this.maxConcurrentJobs - this.activeJobs.size)
    
    for (const job of queuedJobs) {
      this.activeJobs.add(job.jobId)
      this.updateJob(job.jobId, { status: 'scanning', currentStep: 'Starting import' })
      
      // Process job in background
      this.processJob(job.jobId).catch(error => {
        console.error(`Job ${job.jobId} failed:`, error)
        this.updateJob(job.jobId, { 
          status: 'failed', 
          endTime: new Date().toISOString(),
          currentStep: 'Job failed',
          errors: [...job.errors, { product: 'Job', message: String(error) }]
        })
        this.activeJobs.delete(job.jobId)
      })
    }
  }

  /**
   * Process a single job
   */
  private async processJob(jobId: string): Promise<void> {
    const job = this.queue.jobs.get(jobId)
    if (!job) return
    
    try {
      // This is a placeholder - actual implementation would import the ImportOrchestrator
      // For now, we'll simulate the job processing
      
      // Simulate scanning
      this.updateJob(jobId, { 
        status: 'scanning', 
        currentStep: 'Scanning Kimo catalog' 
      })
      await this.sleep(2000)
      
      // Simulate processing
      this.updateJob(jobId, { 
        status: 'processing', 
        currentStep: 'Processing products',
        totalProducts: 100
      })
      
      for (let i = 0; i < 100; i++) {
        this.updateJob(jobId, {
          processedProducts: i + 1,
          successfulProducts: i + 1,
          currentStep: `Processing product ${i + 1} of 100`
        })
        await this.sleep(100)
      }
      
      // Complete job
      this.updateJob(jobId, {
        status: 'completed',
        endTime: new Date().toISOString(),
        currentStep: 'Import completed successfully'
      })
      
    } catch (error) {
      throw error
    } finally {
      this.activeJobs.delete(jobId)
    }
  }

  /**
   * Cancel a job
   */
  cancelJob(jobId: string): boolean {
    const job = this.queue.jobs.get(jobId)
    if (!job || job.status === 'completed' || job.status === 'failed') {
      return false
    }
    
    this.updateJob(jobId, {
      status: 'cancelled',
      endTime: new Date().toISOString(),
      currentStep: 'Job cancelled by user'
    })
    
    this.activeJobs.delete(jobId)
    return true
  }

  /**
   * Retry failed products in a job
   */
  async retryFailed(jobId: string): Promise<JobProgress | null> {
    const job = this.queue.jobs.get(jobId)
    if (!job || job.failedProducts === 0) {
      return null
    }
    
    // Create a new job to retry failed products
    const retryJobId = `${jobId}-retry-${Date.now()}`
    const retryJob = this.createJob({
      ...job.config,
      jobId: retryJobId,
      retryFailed: true,
      resumeFrom: jobId
    })
    
    return retryJob
  }

  /**
   * Resume a cancelled or failed job
   */
  async resumeJob(jobId: string): Promise<JobProgress | null> {
    const job = this.queue.jobs.get(jobId)
    if (!job || (job.status !== 'cancelled' && job.status !== 'failed')) {
      return null
    }
    
    // Create a new job to resume
    const resumeJobId = `${jobId}-resume-${Date.now()}`
    const resumeJob = this.createJob({
      ...job.config,
      jobId: resumeJobId,
      resumeFrom: jobId
    })
    
    return resumeJob
  }

  /**
   * Clean up old jobs (older than 7 days)
   */
  cleanupOldJobs(): number {
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    
    let cleaned = 0
    const jobEntries = Array.from(this.queue.jobs.entries())
    
    for (const [jobId, job] of jobEntries) {
      const jobDate = new Date(job.startTime)
      if (jobDate < sevenDaysAgo && job.status === 'completed') {
        this.queue.jobs.delete(jobId)
        cleaned++
      }
    }
    
    if (cleaned > 0) {
      this.saveJobs()
    }
    
    return cleaned
  }

  /**
   * Save jobs to disk
   */
  private saveJobs(): void {
    const jobsArray = Array.from(this.queue.jobs.entries())
    const jobsData = JSON.stringify(jobsArray, null, 2)
    fs.writeFileSync(
      path.join(this.queue.storagePath, 'jobs.json'),
      jobsData,
      'utf-8'
    )
  }

  /**
   * Load jobs from disk
   */
  private loadJobs(): void {
    const jobsFile = path.join(this.queue.storagePath, 'jobs.json')
    
    if (!fs.existsSync(jobsFile)) {
      return
    }
    
    try {
      const data = fs.readFileSync(jobsFile, 'utf-8')
      const jobsArray = JSON.parse(data)
      
      this.queue.jobs = new Map(jobsArray)
      
      // Reset active jobs that were in progress
      const jobEntries = Array.from(this.queue.jobs.entries())
      for (const [jobId, job] of jobEntries) {
        if (job.status === 'scanning' || job.status === 'processing' || job.status === 'downloading_images' || job.status === 'importing') {
          this.updateJob(jobId, {
            status: 'failed',
            endTime: new Date().toISOString(),
            currentStep: 'Job interrupted by server restart',
            errors: [...job.errors, { product: 'Job', message: 'Job interrupted by server restart' }]
          })
        }
      }
      
    } catch (error) {
      console.error('Error loading jobs:', error)
      this.queue.jobs = new Map()
    }
  }

  /**
   * Sleep helper
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// Singleton instance
let jobManagerInstance: JobManager | null = null

export function getJobManager(): JobManager {
  if (!jobManagerInstance) {
    jobManagerInstance = new JobManager()
  }
  return jobManagerInstance
}