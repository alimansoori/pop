import { ApolloServer } from 'apollo-server'
import mongoose from 'mongoose'
import config from './config/config'
import typeDefs from './graphql/typeDefs'
import resolvers from './graphql/resolvers'

const server = new ApolloServer({
    typeDefs,
    resolvers,
})

mongoose
    .connect(config.mongo_server, {
        // @ts-ignore
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => {
        console.log('MongoDb Connection successful')

        return server.listen({ port: 5000 })
    })
    .then((res) => {
        console.log(`Server running at ${res.url}`)
    })
