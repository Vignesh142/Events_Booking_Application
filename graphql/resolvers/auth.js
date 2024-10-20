import bcrypt from 'bcryptjs'
import { User } from '../../models/user.js'
import { events, singleEvent } from './merge.js'
import jwt from 'jsonwebtoken'

const authResolver = {
    createUser: async args => {
        try {
            const existingUser = await User.findOne({ email: args.userInput.email })
            if (existingUser) {
                throw new Error('User exists already')
            }

            const hashedPass = await bcrypt.hash(args.userInput.password, 12)
            if (!hashedPass) {
                throw new Error('Password hashing failed')
            }
            const user = new User({
                email: args.userInput.email,
                password: hashedPass
            })
            const result = await user.save()
            console.log(result)
            return { ...result._doc, password: null }
        } catch (err) {
            console.log(err)
            throw err
        }
    },
    login: async ({ email, password }) => {
        const user = await User.findOne({ email: email })
        if (!user) {
            throw new Error('User does not exist!')
        }
        const isEqual = await bcrypt.compare(password, user.password)
        if (!isEqual) {
            throw new Error('Password is incorrect!')
        }
        const token = jwt.sign({ userId: user.id, email: user.email }, 'somesupersecretkey', {
            expiresIn: '1h'
        })
        return { userId: user.id, token: token, tokenExpiration: 1 }
    }
}

export default authResolver