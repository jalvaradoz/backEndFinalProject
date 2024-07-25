import express from 'express'
import handlebars from 'express-handlebars'
import __dirname from './utils.js'
import viewsRouter from './routes/views.router.js'
import { Server } from 'socket.io'
import { getProducts, saveProducts } from './routes/views.router.js'

const app = express()
const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))
app.use('/', viewsRouter)

const httpServer = app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
const socketServer = new Server(httpServer)

socketServer.on('connection', async (socket) => {
    console.log('New client connected')

    let products = await getProducts()
    socket.emit('updateProducts', products)

    socket.on('refreshProducts', async () => {
        products = await getProducts()
        socket.emit('updateProducts', products)
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