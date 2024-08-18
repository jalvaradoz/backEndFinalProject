import express from 'express'
import { findCartById } from './cart.router.js'
import { getProducts } from './product.router.js'


const viewsRouter = express.Router()

viewsRouter.get('/', async (req, res) => {
    try {
        let products = await getProducts()
        if (req.headers.accept && req.headers.accept.includes('application/json')) {
            res.status(200).json(products)
        } else {
            res.status(200).render('home', { products })
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