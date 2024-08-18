import express from 'express'
import mongoose from 'mongoose'
import usersRouter from './routes/users.router.js'
import viewsRouter from './routes/views.router.js'
import productRouter from './routes/product.router.js'
import cartRouter from './routes/cart.router.js'
import handlebars from 'express-handlebars'
import __dirname from './utils.js'

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
app.use('/', productRouter)
app.use('/', cartRouter)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))

const environment = async () => {
    try {
        await mongoose.connect('mongodb+srv://joey2596:6Gsb0szOnn5mCODC@cluster0.lsakre9.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0')
        console.log('Connected to DataBase')

    } catch (err) {
        console.error('Error while connecting to DB', err)
    }
}

environment()

export default app
