import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

export async function POST(request: Request) {
  try {
    // Directorio donde se guardarán las imágenes
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Obtener el archivo desde el FormData
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No se envió ningún archivo.' },
        { status: 400 }
      )
    }

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, message: 'Solo se permiten imágenes.' },
        { status: 400 }
      )
    }

    // Validar tamaño máximo (5 MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, message: 'La imagen es demasiado grande (máx. 5MB).' },
        { status: 400 }
      )
    }

    // Generar nombre único
    const fileExt = path.extname(file.name)
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${fileExt}`
    const filePath = path.join(uploadDir, fileName)

    // Guardar el archivo en el disco
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(filePath, buffer)

    // Crear la URL pública
    const fileUrl = `/uploads/${fileName}`

    return NextResponse.json({
      success: true,
      message: 'Imagen subida correctamente.',
      url: fileUrl,
    })
  } catch (error) {
    console.error('Error al subir la imagen:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno al subir la imagen.' },
      { status: 500 }
    )
  }
}
