const express = require('express')
const { GraphQLServer } = require('graphql-yoga')
const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server-core');
const jwtSecret = require('./constants');
const { rule, shield, and, or, not } = require("graphql-shield");

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// const typeDefs =  `type Query { hello(name: String): String! }`

const resolvers = {
    Query: {
        hello: (_, { name }, ctx) => `Hello, ${name || 'World'}`,
        users: async (_, { id }, ctx ) => {

            const foundUser = await ctx.prisma.users.findOne({
                where: {
                    id
                }
            })

            return foundUser
        }
    },
    Mutation: {
        createUser: async (_, { name, id }, ctx) => { 
            
            const newUser = await ctx.prisma.users.create({
                data: {
                    name,
                    id
                }
            }); 
            return newUser;
        },
        changeName: async (_, { name, id }, ctx) => {
            
            const editedUser = await ctx.prisma.users.update({
                where: {
                    id
                },
                data: {
                    name
                }
            })

            return editedUser
        }
    }
    // Mutation: {
    //     login: (_, {name, password}) => jwt.sign({ data: "bar" }, jwtSecret, { algorithm: "RS256" })
    // }
}
// const newUser = await prisma.users.create({
//     data: {
//         name: 'Alice',
//     },
// })

const autheticate = async (resolve, root, args, context, info) => {
  let token;
  try {
    token = jwt.verify(context.request.get("Authorization"), jwtSecret);
  } catch (e) {
    return new AuthenticationError("Not authorised");
  }
  const result = await resolve(root, args, context, info);
  return result;
};

// Auth

function getClaims(req) {
    let token;
    try {
        token = jwt.verify(req.request.get("Authorization"), jwtSecret);
    } catch (e) {
        return null;
    }
    return token.claims;
}

// Rules

const isAuthenticated = rule()(async (parent, args, ctx, info) => {
    return ctx.claims !== null;
});

const canReadposts = rule()(async (parent, args, ctx, info) => {
    return ctx.claims === "read-posts";
});

// Permissions

const permissions = shield({
    Query: {
        hello: isAuthenticated
    }
});

const server = new GraphQLServer({
    typeDefs: './src/schema.graphql',
    resolvers,
    // middlewares: [permissions],
    context: req => ({
        ...req,
        prisma
        // claims: getClaims(req)
    })
});

const PORT = process.env.PORT ? process.env.PORT : 3000

server.start({ port: PORT }, () => console.log(`Example app listening on port ${PORT}!`))
