const express = require('express')
const { GraphQLServer } = require('graphql-yoga')

const typeDefs =  `type Query { hello(name: String): String! }`

const resolvers = {
    Query: {
        hello: (_, { name }) => `Hello, ${name || 'World'}`,
    },
}

const server = new GraphQLServer({typeDefs, resolvers})

const PORT = process.env.PORT ? process.env.PORT : 3000

server.start({port: PORT}, () => console.log(`Example app listening on port ${PORT}!`))

// const app = express();

// app.get("/", (req, res) => {
//   res.send("Hi evan...");
// });