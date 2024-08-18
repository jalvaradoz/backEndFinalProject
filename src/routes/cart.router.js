import express from 'express'
import cartModel from '../models/cart.model.js'
import productModel from '../models/product.model.js'
import { socketServer } from '../app.js'

const cartRouter = express.Router()

export const findCartById = async () => {
    return await cartModel.findById('66c16f51f1fb1cf7eb8b3ef9').populate('products.product')
}

cartRouter.post('/cart/products/:pid', async (req, res) => {
    try {
        const { pid } = req.params
        const cart = await findCartById()
        const product = await productModel.findById(pid)

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' })
        } else if (!product) {
            return res.status(404).json({ error: 'Product not found' })
        } else if (product.stock <= 0) {
            return res.status(400).json({ error: 'Product out of stock' })
        }

        const productIndex = cart.products.findIndex(p => p.product._id.toString() === pid)

        productIndex === -1 ?
            // If product not found in cart, add it
            cart.products.push({ product: pid, quantity: 1 }) :
            // If product already exists in cart, increment quantity
            cart.products[productIndex].quantity += 1

        product.stock -= 1
        await product.save()
        await cart.save()

        socketServer.emit('updateCart', cart)

        res.status(200).json({ message: 'Product added to cart successfully', cart })
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', error })
    }
})


export default cartRouter