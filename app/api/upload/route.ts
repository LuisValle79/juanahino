import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import formidable from 'formidable'

// Configure formidable to not automatically parse files
export const routeSegmentConfig = {
  api: {
    bodyParser: false,
  },
}


// POST /api/upload - Upload an image file
export async function POST(request: Request) {
  try {
    // Create uploads directory if it doesn't exist
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }
    
    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ 
        success: false, 
        message: "No se ha proporcionado ningún archivo."
      }, { status: 400 })
    }
    
    // Generate unique filename
    const fileExtension = file.name.split('.').pop()
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`
    const filePath = path.join(uploadDir, fileName)
    
    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Save file to disk
    await writeFile(filePath, buffer)
    
    // Return the URL where the file can be accessed
    const fileUrl = `/uploads/${fileName}`
    
    return NextResponse.json({ 
      success: true, 
      message: "Archivo subido exitosamente.",
      url: fileUrl
    })
  } catch (error) {
    console.error("Error uploading file:", error)
    return NextResponse.json({ 
      success: false, 
      message: "Hubo un problema al subir el archivo."
    }, { status: 500 })
  }
}