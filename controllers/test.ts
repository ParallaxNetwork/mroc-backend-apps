import { Request, Response } from 'express'
import { UploadedFile } from 'express-fileupload'
import fs from 'fs'

export const test = async (req: Request, res: Response) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.')
    }

    const uploadedFile = req.files.file as UploadedFile

    const uploadPath = `./uploads/${uploadedFile.name}`

    const uploadDirectory = './uploads'
    if (!fs.existsSync(uploadDirectory)) {
      fs.mkdirSync(uploadDirectory)
    }
    uploadedFile.mv(uploadPath, err => {
      if (err) {
        return res.status(500).send(err)
      }

      res.send('File uploaded!')
    })
  } catch (error) {
    console.log(error.message)
    return res.status(500).send(error.message)
  }
}
