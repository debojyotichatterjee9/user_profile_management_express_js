const { buildSchema } = require("graphql");


// module.exports = buildSchema(`
//     type TestData {
//         text: String!
//         views: Int!
//     }
//     type RootQuery {
//         hello: TestData!
//     }    
//     schema {
//         query: RootQuery
//     }

//     type RootMutation{}
//     schema {
//         mutation: RootMutation
//     }
// `);

module.exports = buildSchema(`
    type User {
        id: ID!
        email: String!
    }
    type LoginResponse {
    sid: String!
    token: String!
    } 
    input createUserPayload {
        first_name: String!
        last_name: String!
        email: String!
        username: String!
        password: String!
    }
    input loginPayload {
        email: String!,
        password: String!
    }
    type RootQuery {
        login(payload: loginPayload): LoginResponse!
    }
    type RootMutation{
        createUser(payload: createUserPayload): User!
    }
    schema {
        query: RootQuery
        mutation: RootMutation
    }
`);
