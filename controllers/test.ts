import { Request, Response } from 'express'
import { fileURLToPath } from 'url'
import path from 'path'
import fs from 'fs'

export const test = async (req: Request, res: Response) => {
  try {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    const uploadPath = path.join(__dirname, 'upload/')

    req.pipe(req.busboy)
    //! console.log('test') bisa
    req.busboy.on('file', (fieldname, file, filename) => {
      //! console.log('test') gabisa
      console.log(`Upload of '${filename}' started`)

      const fstream = fs.createWriteStream(
        path.join(uploadPath, String(filename))
      )

      file.pipe(fstream)

      fstream.on('close', () => {
        console.log(`Upload of '${filename}' finished`)
        res.redirect('back')
      })
    })

    return res.status(200).send('OK')
  } catch (error) {
    return res.status(500).send(error.message)
  }
}
