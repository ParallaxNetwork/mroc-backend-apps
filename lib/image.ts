import sharp from 'sharp'
import dcmjsimaging from 'dcmjs-imaging'
import { UploadedFile } from 'express-fileupload'
import { PNG } from 'pngjs'
const { DicomImage, NativePixelDecoder } = dcmjsimaging

const toArrayBuffer = async (buffer: Buffer): Promise<ArrayBuffer> => {
  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  )
}

export const pngToWebp = async (file: UploadedFile): Promise<Buffer> => {
  try {
    const arrayBuffer = await toArrayBuffer(file.data)
    await NativePixelDecoder.initializeAsync()
    const image = new DicomImage(arrayBuffer)
    const renderingResult = image.render()
    const renderedPixels = renderingResult.pixels
    const width = renderingResult.width
    const height = renderingResult.height
    const png = new PNG({ width, height })
    png.data = Buffer.from(renderedPixels)
    const pngBuffer = PNG.sync.write(png)

    const webpFile = await sharp(pngBuffer).webp().toBuffer()

    return webpFile
  } catch (error) {
    console.error('Error converting PNG to WebP:', error)
    return error
  }
}

export const bufferToBlob = (buffer: Buffer): Blob => {
  const mimeType = 'text/plain'
  const blob = new Blob([buffer], { type: mimeType })
  return blob
}
