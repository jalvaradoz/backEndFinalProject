import express from 'express'
import { getPaginatedProducts } from './product.router.js'
import { findCartById } from './cart.router.js'


const viewsRouter = express.Router()

viewsRouter.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, sort = '', category = '', inStock = '' } = req.query

        const result = await getPaginatedProducts(req.query, page, limit, sort, category, inStock)

        if (req.headers.accept && req.headers.accept.includes('application/json')) {
            res.status(200).json(result)
        } else {
            res.status(200).render('home', { products: result.payload, pagination: result })
        }
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error', err })
    }
})

viewsRouter.get('/cart', async (req, res) => {
    try {
        const cart = await findCartById()
        res.status(200).render('cart', { cart })
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error', err })
    }
})

export default viewsRouter