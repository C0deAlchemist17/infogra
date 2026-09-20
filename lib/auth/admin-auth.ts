// Simple API key-based authentication for admin endpoints
// For production, this should be replaced with a proper authentication system

const ADMIN_API_KEY = process.env.ADMIN_API_KEY || 'infogra-admin-key-2025'

export function isAdminRequest(request: Request): boolean {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader) {
    return false
  }
  
  // Check for Bearer token
  if (authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    return token === ADMIN_API_KEY
  }
  
  // Check for API key in header
  if (authHeader === ADMIN_API_KEY) {
    return true
  }
  
  return false
}

export function unauthorizedResponse() {
  return new Response(
    JSON.stringify({ 
      success: false, 
      error: 'Unauthorized access. Admin API key required.' 
    }),
    { 
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    }
  )
}

export function extractApiKey(request: Request): string | null {
  const authHeader = request.headers.get('authorization')
  
  if (!authHeader) {
    return null
  }
  
  if (authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  
  return authHeader
}