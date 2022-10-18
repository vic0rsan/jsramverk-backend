const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');

const DocType = new GraphQLObjectType({
    name: 'Doc',
    description: 'This is a template for a doc object',
    fields: () => ({
        _id: { type: new GraphQLNonNull(GraphQLString) },
        title: { type: new GraphQLNonNull(GraphQLString) },
        body: { type: GraphQLString },
        owner: { type: new GraphQLNonNull(GraphQLString) },
        allowed: { type: new GraphQLList(GraphQLString) }
    })
});

module.exports = DocType;
