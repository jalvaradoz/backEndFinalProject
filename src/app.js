import express from 'express'
import mongoose from 'mongoose'
import usersRouter from './routes/users.router.js'
import userModel from './models/user.model.js'

/* import handlebars from 'express-handlebars'
import __dirname from './utils.js'
import viewsRouter from './routes/views.router.js'
import { Server } from 'socket.io'
import { getProducts, saveProducts } from './routes/views.router.js'
*/

const app = express()
const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/', usersRouter)

const environment = async () => {

    await mongoose.connect('mongodb+srv://joey2596:6Gsb0szOnn5mCODC@cluster0.lsakre9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
        .then(async () => {
            console.log('Connected to DataBase')
            let response = await userModel.find().explain('executionStats ')
        })
        .catch((err) => console.error('Error while connecting to DB', err))
}

environment()

const httpServer = app.listen(PORT, () => console.log(`Server running on port ${PORT}`))











/* app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))
app.use('/', viewsRouter) */

/* const socketServer = new Server(httpServer) */

/* socketServer.on('connection', async (socket) => {
    console.log('New client connected')

    let products = await getProducts()
    socket.emit('updateProducts', products)

    socket.on('updateProducts', (products) => {
        updateProductList(products)
    })

    socket.on('addProduct', async (product) => {
        const newId = products.length > 0 ? String(Number(products[products.length - 1].id) + 1) : "1"
        product.id = newId
        products.push(product)
        await saveProducts(products)
        socketServer.emit('updateProducts', products)
    })

    socket.on('deleteProduct', async (productId) => {
        products = products.filter(product => product.id !== productId)
        await saveProducts(products)
        socketServer.emit('updateProducts', products)
    })
})

export { socketServer } */