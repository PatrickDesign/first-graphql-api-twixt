var express = require('express');
var GraphQLServer = require('graphql-yoga').GraphQLServer;
var typeDefs = "type Query { hello(name: String): String! }";
var resolvers = {
    Query: {
        hello: function (_, _a) {
            var name = _a.name;
            return "Hello, " + (name || 'World');
        }
    }
};
var server = new GraphQLServer({ typeDefs: typeDefs, resolvers: resolvers });
var PORT = process.env.PORT ? process.env.PORT : 3000;
server.start({ port: PORT }, function () { return console.log("Example app listening on port " + PORT + "!"); });
//# sourceMappingURL=app.js.map