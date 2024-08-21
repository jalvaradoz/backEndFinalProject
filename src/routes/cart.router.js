import express from 'express'
import cartModel from '../models/cart.model.js'
import productModel from '../models/product.model.js'

const cartRouter = express.Router()

export const findCartById = async () => {
    return await cartModel.findById('66c2237aa6953ce022e9c17f').populate('products.product')
}

//This is to add a new product to the cart

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

        res.status(200).json({ message: 'Product added to cart successfully', cart })
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', error })
    }
})

// Update the quantity of a specific product in the cart
cartRouter.put('/cart/products/:pid', async (req, res) => {
    try {
        const { pid } = req.params
        const { quantity } = req.body
        const cart = await findCartById()

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' })
        }

        const productIndex = cart.products.findIndex(p => p.product._id.toString() === pid)

        if (productIndex === -1) {
            return res.status(404).json({ error: 'Product not found in cart' })
        }

        const product = await productModel.findById(pid)

        if (!product) {
            return res.status(404).json({ error: 'Product not found' })
        }

        if (quantity <= 0) {
            return res.status(400).json({ error: 'Quantity must be greater than 0' })
        }

        // Update the product quantity in the cart
        const oldQuantity = cart.products[productIndex].quantity
        cart.products[productIndex].quantity = quantity

        // Adjust product stock
        product.stock += oldQuantity - quantity
        await product.save()

        await cart.save()

        res.status(200).json({ message: 'Product quantity updated successfully', cart })
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', error })
    }
})

// Replace the existing cart products with a new array based on the cart ID
cartRouter.put('/carts/:cid', async (req, res) => {
    try {
        const { cid } = req.params
        const newCart = req.body // Expecting the new cart details in the request body

        const existingCart = await cartModel.findById(cid)

        if (!existingCart) {
            return res.status(404).json({ error: 'Cart not found' })
        }

        // Restore product quantities to stock
        for (const item of existingCart.products) {
            const product = await productModel.findById(item.product._id)
            if (product) {
                product.stock += item.quantity
                await product.save()
            } else {
                console.error(`Product with ID ${item.product._id} not found`)
            }
        }

        // Replace the existing cart with the new cart data
        await cartModel.findByIdAndUpdate(cid, newCart, { new: true })

        res.status(200).json({ message: 'Cart replaced successfully', cart: newCart })
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', error })
    }
})



//This deletes an specific product based on ID & restores the product quantity on the DB

cartRouter.delete('/cart/products/:pid', async (req, res) => {
    try {
        const { pid } = req.params
        const cart = await findCartById()

        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' })
        }

        const productIndex = cart.products.findIndex(p => p.product._id.toString() === pid)

        if (productIndex === -1) {
            return res.status(404).json({ error: 'Product not found in cart' })
        }

        const product = await productModel.findById(cart.products[productIndex].product._id)
        product.stock += cart.products[productIndex].quantity
        await product.save()

        cart.products.splice(productIndex, 1)
        await cart.save()

        res.status(200).json({ message: 'Product removed from cart successfully', cart })
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', error })
    }
})

//This clears the cart and restores the products quantity on the DB 

cartRouter.delete('/cart/:cid', async (req, res) => {
    try {

        const { cid } = req.params
        const cart = await cartModel.findById(cid)

        for (const item of cart.products) {
            const product = await productModel.findById(item.product._id)

            if (product) {
                product.stock += item.quantity
                await product.save()
            } else {
                console.error(`Product with ID ${item.product._id} not found`)
            }
        }
        cart.products = []
        await cart.save()
        res.status(200).json({ message: 'Cart emptied successfully', cart })
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error', error })
    }
})


export default cartRouter