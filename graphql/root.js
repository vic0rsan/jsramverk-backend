const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLBoolean
} = require('graphql');

const DocType = require('./docs.js');
const UserType = require('./users.js');

const docs = require('../models/docs.js');
const auth = require('../models/auth.js');

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        docs: {
            type: new GraphQLList(DocType),
            description: 'List of all documents',
            args: {
                email: { type: GraphQLString },
                code: { type: GraphQLBoolean }
            },
            resolve: async function(parent, args) {
                const req = {user: {
                    email: args.email,
                    code: args.code  
                }          
            };
                const userDocs = await docs.getUserDocs(req);

                return userDocs;
            }
        },
        users: {
            type: new GraphQLList(UserType),
            description: 'List of all users',
            resolve: async function() {
                const allUsers = await auth.getAllUser();

                return allUsers;
            }
        }
    })
});

module.exports = RootQueryType;
