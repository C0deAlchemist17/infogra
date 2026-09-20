import { NextResponse } from 'next/server'
import { JSONStorageManager } from '@/lib/importers/json-storage-manager'

interface StockTransfer {
  id: string
  productId: string
  productName: string
  fromLocation: string
  toLocation: string
  quantity: number
  status: 'pending' | 'in-transit' | 'completed' | 'cancelled'
  createdAt: string
  completedAt?: string
  notes?: string
}

// In-memory storage for transfers (in production, use a database)
let transfers: StockTransfer[] = []

export async function GET() {
  try {
    return NextResponse.json({ transfers })
  } catch (error) {
    console.error('Error fetching transfers:', error)
    return NextResponse.json({ error: 'Failed to fetch transfers' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { productId, productName, fromLocation, toLocation, quantity, notes } = body

    const newTransfer: StockTransfer = {
      id: `transfer-${Date.now()}`,
      productId,
      productName,
      fromLocation,
      toLocation,
      quantity,
      status: 'pending',
      createdAt: new Date().toISOString(),
      notes,
    }

    transfers.push(newTransfer)

    return NextResponse.json({ success: true, transfer: newTransfer })
  } catch (error) {
    console.error('Error creating transfer:', error)
    return NextResponse.json({ error: 'Failed to create transfer' }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json()
    const { id, status } = body

    const transferIndex = transfers.findIndex((t) => t.id === id)
    if (transferIndex >= 0) {
      transfers[transferIndex].status = status
      if (status === 'completed') {
        transfers[transferIndex].completedAt = new Date().toISOString()
      }
      return NextResponse.json({ success: true, transfer: transfers[transferIndex] })
    }

    return NextResponse.json({ error: 'Transfer not found' }, { status: 404 })
  } catch (error) {
    console.error('Error updating transfer:', error)
    return NextResponse.json({ error: 'Failed to update transfer' }, { status: 500 })
  }
}
