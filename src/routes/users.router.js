import { Router } from "express"
import userModel from "../models/user.model.js"

const usersRouter = Router()

usersRouter.get('/', async (req, res) => {
    try {
        let users = await userModel.find()
        res.send({ result: 'Success', payload: users })
    } catch (err) {
        res.status(500).send({ status: 'Error', error: 'Internal server error' })
    }
})

usersRouter.post('/', async (req, res) => {
    try {
        let { name, lastName, email } = req.body
        if (!name || !lastName || !email) {
            return res.send({ status: 'Error', error: 'Missing params' })
        }

        let result = await userModel.create({ name, lastName, email })
        res.send({ result: 'Success', payload: result })
    } catch (error) {
        res.status(500).send({ status: 'Error', error: 'Internal server error' })
    }
})

usersRouter.put('/:uid', async (req, res) => {
    try {
        let userId = req.params.uid
        let userToUpdate = req.body
        if (!userToUpdate.name || !userToUpdate.lastName || !userToUpdate.email) {
            return res.status(400).send({ status: 'Error', error: 'Missing params' })
        }

        let existingUser = await userModel.findOne({ email: userToUpdate.email });
        if (existingUser.email === userToUpdate.email) {
            return res.status(400).send({ status: 'Error', error: 'Email already in use' })
        }

        let result = await userModel.updateOne({ _id: userId }, userToUpdate)
        res.send({ result: 'Success', payload: result })
    } catch (err) {
        res.status(500).send({ status: 'Error', error: 'Internal server error' })
    }
})

usersRouter.delete('/:uid', async (req, res) => {
    try {
        let userId = req.params.uid
        let result = await userModel.deleteOne({ _id: userId })
        res.send({ result: 'Success', payload: result })
    } catch (error) {
        res.status(500).send({ status: 'Error', error: 'Internal server error' })
    }
})

export default usersRouter