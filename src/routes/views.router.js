import express from 'express'
import fs from "fs/promises"

const viewsRouter = express.Router()
const PRODUCTS_FILE = "./src/products.json"

export const getProducts = async () => {
    try {
        const data = await fs.readFile(PRODUCTS_FILE, "utf-8")
        return JSON.parse(data)
    } catch (err) {
        console.error(err)
        throw new Error('Internal Server Error')
    }
}
export const saveProducts = async (products) => {
    try {
        await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8')
    } catch (err) {
        console.error(err)
        throw new Error('Internal Server Error')
    }
}

viewsRouter.get('/', async (req, res) => {
    try {
        const products = await getProducts()
        res.render('home', { products })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

viewsRouter.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await getProducts()
        res.render('realTimeProducts', { products })
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

viewsRouter.post('/api/products', async (req, res) => {
    try {
        const { title, description, code, price, stock, category } = req.body
        const products = await getProducts()

        if (stock <= 0) {
            return res.status(400).json({ error: 'Stock must be greater than 0' })
        }

        if (products.some(p => p.title === title)) {
            return res.status(400).json({ error: 'A product with this TITLE already exists, check inventory first' })
        }

        const newId = products.length > 0 ? Math.max(...products.map(p => parseInt(p.id, 10))) + 1 : 1

        const newProduct = { id: newId, title, description, code, price, stock, category }
        products.push(newProduct)

        await saveProducts(products)
        res.status(201).json(newProduct)

    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

export default viewsRouter