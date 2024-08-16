import express from 'express'
import mongoose from 'mongoose'
import usersRouter from './routes/users.router.js'
import handlebars from 'express-handlebars'
import __dirname from './utils.js'
import viewsRouter from './routes/views.router.js'
import productModel from './models/product.model.js'
import { Server } from 'socket.io'
import { getProducts } from './routes/views.router.js'

const hbs = handlebars.create({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true
    }
})

const app = express()
const PORT = 8080

app.engine('handlebars', hbs.engine)
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(__dirname + '/public'))
app.use('/', viewsRouter)
app.use('/', usersRouter)

const httpServer = app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

const environment = async () => {
    try {
        await mongoose.connect('mongodb+srv://joey2596:6Gsb0szOnn5mCODC@cluster0.lsakre9.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0')

        console.log('Connected to DataBase')

    } catch (err) {
        console.error('Error while connecting to DB', err)
    }
}

environment()


const socketServer = new Server(httpServer)

socketServer.on('connection', async (socket) => {
    console.log('New client connected')

    let products = await getProducts()
    socket.emit('updateProducts', products)

    socket.on('updateProducts', (products) => {
        updateProductList(products)
    })

    socket.on('addProduct', async (product) => {
        await productModel.create(product)
        products = await getProducts()
        socketServer.emit('updateProducts', products)
    })

    socket.on('deleteProduct', async (productId) => {
        await productModel.deleteOne({ _id: productId })
        products = await getProducts()
        socketServer.emit('updateProducts', products)
    });
})

export { socketServer }