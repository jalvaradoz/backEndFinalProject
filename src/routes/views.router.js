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
        const products = await getProducts();
        res.render('realTimeProducts', { products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default viewsRouter