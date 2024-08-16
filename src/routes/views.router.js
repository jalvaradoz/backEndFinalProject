import express from 'express'
import { getProducts } from './product.router.js'


const viewsRouter = express.Router()

viewsRouter.get('/', async (req, res) => {
    try {
        let products = await getProducts()
        res.status(200).render('home', { products })

    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error', err })
    }
})

export default viewsRouter