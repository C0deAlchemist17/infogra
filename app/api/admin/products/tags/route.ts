import { NextResponse } from 'next/server'

interface Tag {
  id: string
  name: string
  color: string
  productCount: number
  createdAt: string
}

// In-memory storage for tags (in production, use a database)
let tags: Tag[] = [
  {
    id: 'tag-1',
    name: 'Electronics',
    color: '#3b82f6',
    productCount: 3250,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tag-2',
    name: 'Accessories',
    color: '#10b981',
    productCount: 1890,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tag-3',
    name: 'Best Sellers',
    color: '#f59e0b',
    productCount: 475,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'tag-4',
    name: 'New Arrivals',
    color: '#ef4444',
    productCount: 320,
    createdAt: new Date().toISOString(),
  },
]

export async function GET() {
  try {
    return NextResponse.json({ tags })
  } catch (error) {
    console.error('Error fetching tags:', error)
    return NextResponse.json({ error: 'Failed to fetch tags' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, color } = body

    const newTag: Tag = {
      id: `tag-${Date.now()}`,
      name,
      color,
      productCount: 0,
      createdAt: new Date().toISOString(),
    }

    tags.push(newTag)

    return NextResponse.json({ success: true, tag: newTag })
  } catch (error) {
    console.error('Error creating tag:', error)
    return NextResponse.json({ error: 'Failed to create tag' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json()
    const { id, name, color } = body

    const index = tags.findIndex((t) => t.id === id)
    if (index >= 0) {
      tags[index] = {
        ...tags[index],
        name,
        color,
      }
      return NextResponse.json({ success: true, tag: tags[index] })
    }

    return NextResponse.json({ error: 'Tag not found' }, { status: 404 })
  } catch (error) {
    console.error('Error updating tag:', error)
    return NextResponse.json({ error: 'Failed to update tag' }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'Tag ID required' }, { status: 400 })
    }

    const index = tags.findIndex((t) => t.id === id)
    if (index >= 0) {
      tags.splice(index, 1)
      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: 'Tag not found' }, { status: 404 })
  } catch (error) {
    console.error('Error deleting tag:', error)
    return NextResponse.json({ error: 'Failed to delete tag' }, { status: 500 })
  }
}
