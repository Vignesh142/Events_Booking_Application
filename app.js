import express from 'express'
import bodyParser from 'body-parser'
import { graphqlHTTP  } from 'express-graphql'
import { graphql } from 'graphql'
import { mongoose } from 'mongoose'
import dotenv from 'dotenv'

import { graphqlSchema } from './graphql/schema/index.js'
import { graphqlResolvers } from './graphql/resolvers/index.js'
import authMiddleware from './middleware/is-auth.js'

dotenv.config()

const app = express()

app.use(bodyParser.json())

app.use(authMiddleware)

const uri = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.haacszw.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority&appName=Cluster0`

mongoose.connect(uri)
    .then(() => {
        console.log('Connected to MongoDB')
    })
    .catch(err => {
        console.log(err)
    })

app.use('/graphql', graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolvers,
    graphiql: true
}))

app.get('/', (req, res, next) => {
    res.send('Hello World')
})


app.listen(3000, () => {
    console.log('Server is running on port 3000')
})