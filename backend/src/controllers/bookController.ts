import { Request, Response } from 'express'
import { supabaseAdmin } from '../config/supabase'
import multer from 'multer'
import path from 'path'
const { PDFParse } = require('pdf-parse')
import { classifyLevel } from '../services/aiService'
import * as recommendationService from '../services/recommendationService'

const uploadCoverMulter = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      return cb(new Error('Cover must be an image (JPG, PNG, GIF, WebP)'))
    }
    cb(null, true)
  },
})

const uploadContentMulter = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!file.originalname.match(/\.(pdf|epub)$/i)) {
      return cb(new Error('Content must be a PDF or EPUB file'))
    }
    cb(null, true)
  },
})

export const uploadCover = uploadCoverMulter.single('cover')

export const uploadContent = uploadContentMulter.single('content')

export const getBooks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, difficulty, age_group, search, limit = 20, offset = 0 } = req.query

    let query = supabaseAdmin.from('books').select('*', { count: 'exact' })

    if (category) query = query.eq('category', category as string)
    if (difficulty) query = query.eq('difficulty', difficulty as string)
    if (age_group) query = query.eq('age_group', age_group as string)
    if (search) {
      query = query.or(`title.ilike.*${search}*,author.ilike.*${search}*,description.ilike.*${search}*`)
    }

    query = query
      .order('created_at', { ascending: false })
      .range(parseInt(offset as string), parseInt(offset as string) + parseInt(limit as string) - 1)

    const { data, error, count } = await query

    if (error) throw error

    res.json({
      success: true,
      data: data || [],
      pagination: {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        total: count || 0,
      },
    })
  } catch (error: any) {
    console.error('Error fetching books:', error)
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
}

export const getBookById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params

    const { data, error } = await supabaseAdmin
      .from('books')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      res.status(404).json({ error: 'Book not found' })
      return
    }

    await supabaseAdmin.rpc('increment_book_views', { book_id: id })

    res.json({
      success: true,
      data,
    })
  } catch (error: any) {
    console.error('Error fetching book:', error)
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
}

export const getCategories = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { data, error } = await supabaseAdmin
      .from('books')
      .select('category')
      .not('category', 'is', null)
      .order('category', { ascending: true })

    if (error) throw error

    const uniqueCategories = [...new Set(data.map(item => item.category))]
      .filter(Boolean)
      .map(name => ({ name }))

    res.json({
      success: true,
      data: uniqueCategories,
    })
  } catch (error: any) {
    console.error('Error fetching categories:', error)
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
}

export const handleUploadCover = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params
    const file = req.file

    if (!file) {
      res.status(400).json({ error: 'No file uploaded' })
      return
    }

    const ext = path.extname(file.originalname)
    const filePath = `covers/${id}${ext}`

    const { data, error } = await supabaseAdmin.storage
      .from('books')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      })

    if (error) throw error

    const { data: urlData } = supabaseAdmin.storage
      .from('books')
      .getPublicUrl(filePath)

    await supabaseAdmin
      .from('books')
      .update({ cover_image_url: urlData.publicUrl })
      .eq('id', id)

    res.json({
      success: true,
      data: { url: urlData.publicUrl },
    })
  } catch (error: any) {
    console.error('Error uploading cover:', error)
    res.status(500).json({ error: error.message || 'Failed to upload cover' })
  }
}

export const handleUploadContent = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params
    const file = req.file

    if (!file) {
      res.status(400).json({ error: 'No file uploaded' })
      return
    }

    const ext = path.extname(file.originalname)
    const filePath = `content/${id}${ext}`

    const { data, error } = await supabaseAdmin.storage
      .from('books')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: true,
      })

    if (error) throw error

    const { data: urlData } = supabaseAdmin.storage
      .from('books')
      .getPublicUrl(filePath)

    const updates: any = { content_url: urlData.publicUrl }

    if (file.mimetype === 'application/pdf') {
      try {
        const parser = new PDFParse(new Uint8Array(file.buffer))
        await parser.load()

        let pageCount = 0
        for (let i = 0; i < 1000; i++) {
          try {
            await parser.getPageText(i)
            pageCount++
          } catch {
            break
          }
        }
        updates.total_pages = pageCount || 100

        const classification = await classifyLevel({ pdfBuffer: file.buffer })
        if (classification.cefrLevel) {
          updates.difficulty = classification.cefrLevel
        }
      } catch (parseError: any) {
        console.error('PDF processing error:', parseError.message)
      }
    }

    await supabaseAdmin
      .from('books')
      .update(updates)
      .eq('id', id)

    res.json({
      success: true,
      data: { url: urlData.publicUrl, ...updates },
    })
  } catch (error: any) {
    console.error('Error uploading content:', error)
    res.status(500).json({ error: error.message || 'Failed to upload content' })
  }
}

export const deleteFile = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id, type } = req.params

    if (!['cover', 'content'].includes(type)) {
      res.status(400).json({ error: 'Invalid file type. Use "cover" or "content"' })
      return
    }

    const folder = type === 'cover' ? 'covers' : 'content'
    const { data: files } = await supabaseAdmin.storage
      .from('books')
      .list(folder)

    if (files) {
      const toDelete = files.filter(f => f.name.startsWith(id))
      if (toDelete.length > 0) {
        const paths = toDelete.map(f => `${folder}/${f.name}`)
        await supabaseAdmin.storage
          .from('books')
          .remove(paths)
      }
    }

    const updateField = type === 'cover' ? 'cover_image_url' : 'content_url'
    await supabaseAdmin
      .from('books')
      .update({ [updateField]: null })
      .eq('id', id)

    res.json({ success: true, message: `${type} file deleted` })
  } catch (error: any) {
    console.error('Error deleting file:', error)
    res.status(500).json({ error: error.message || 'Failed to delete file' })
  }
}

export const getPopularAuthors = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { data, error } = await supabaseAdmin
      .from('books')
      .select('author')
      .not('author', 'is', null)

    if (error) throw error

    const uniqueAuthors = [...new Set(data?.map(b => b.author).filter(Boolean))].sort()

    res.json({ success: true, data: uniqueAuthors })
  } catch (error: any) {
    console.error('Error fetching popular authors:', error)
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
}

export const getRecommended = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const userId = req.user?.id
    const limit = parseInt(req.query.limit as string) || 12
    let books: any[] = []

    // Try the Python recommendation service for personalized recs
    if (userId) {
      const result = await recommendationService.getRecommendations(userId, limit)
      const recs = result.recommendations || []

      if (recs.some(r => r.predicted_score != null)) {
        const bookIds = recs.map(r => r.id).filter(Boolean)
        if (bookIds.length > 0) {
          const { data } = await supabaseAdmin
            .from('books')
            .select('*')
            .in('id', bookIds)

          if (data) {
            const bookMap = new Map(data.map(b => [b.id, b]))
            books = bookIds.map(id => bookMap.get(id)).filter(Boolean)
          }
        }
      }
    }

    // Fallback: random books
    if (books.length === 0) {
      const { data, error } = await supabaseAdmin.rpc('get_random_books', { limit_count: limit })
      if (error) throw error
      books = data || []
    }

    res.json({
      success: true,
      data: books,
    })
  } catch (error: any) {
    console.error('Error fetching recommended books:', error)
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
}

export const getTrending = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { limit = 10 } = req.query

    const { data, error } = await supabaseAdmin
      .from('books')
      .select('*')
      .order('views', { ascending: false })
      .order('rating', { ascending: false })
      .limit(parseInt(limit as string))

    if (error) throw error

    res.json({
      success: true,
      data: data || [],
    })
  } catch (error: any) {
    console.error('Error fetching trending books:', error)
    res.status(500).json({ error: error.message || 'Internal server error' })
  }
}
