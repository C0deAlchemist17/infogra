import { NextResponse } from 'next/server'

interface Supplier {
  id: string
  name: string
  contact: string
  email: string
  phone: string
  address: string
  productCount: number
  notes: string
  createdAt: string
}

// In-memory storage for suppliers (in production, use a database)
let suppliers: Supplier[] = [
  {
    id: 'supplier-1',
    name: 'Kimo Store',
    contact: 'Kimo Store Manager',
    email: 'contact@kimostore.net',
    phone: '+20 123 456 7890',
    address: 'Cairo, Egypt',
    productCount: 4656,
    notes: 'Primary electronics supplier',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'supplier-2',
    name: 'Elhamd Store',
    contact: 'Elhamd Store Manager',
    email: 'info@elhamd.com',
    phone: '+20 987 654 3210',
    address: 'Alexandria, Egypt',
    productCount: 957,
    notes: 'Secondary electronics supplier',
    createdAt: new Date().toISOString(),
  },
]

export async function GET() {
  try {
    return NextResponse.json({ suppliers })
  } catch (error) {
    console.error('Error fetching suppliers:', error)
    return NextResponse.json({ error: 'Failed to fetch suppliers' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, contact, email, phone, address, notes } = body

    const newSupplier: Supplier = {
      id: `supplier-${Date.now()}`,
      name,
      contact,
      email,
      phone,
      address,
      productCount: 0,
      notes,
      createdAt: new Date().toISOString(),
    }

    suppliers.push(newSupplier)

    return NextResponse.json({ success: true, supplier: newSupplier })
  } catch (error) {
    console.error('Error creating supplier:', error)
    return NextResponse.json({ error: 'Failed to create supplier' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, name, contact, email, phone, address, notes } = body

    const index = suppliers.findIndex((s) => s.id === id)
    if (index >= 0) {
      suppliers[index] = {
        ...suppliers[index],
        name,
        contact,
        email,
        phone,
        address,
        notes,
      }
      return NextResponse.json({ success: true, supplier: suppliers[index] })
    }

    return NextResponse.json({ error: 'Supplier not found' }, { status: 404 })
  } catch (error) {
    console.error('Error updating supplier:', error)
    return NextResponse.json({ error: 'Failed to update supplier' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Supplier ID required' }, { status: 400 })
    }

    const index = suppliers.findIndex((s) => s.id === id)
    if (index >= 0) {
      suppliers.splice(index, 1)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Supplier not found' }, { status: 404 })
  } catch (error) {
    console.error('Error deleting supplier:', error)
    return NextResponse.json({ error: 'Failed to delete supplier' }, { status: 500 })
  }
}
