import { ApolloServer } from 'apollo-server'
import { schema } from './schema'

const server = new ApolloServer({
  schema: schema,
})

server.listen().then(async ({ url }) => {
  console.log(`\
🚀 Server ready at: ${url}
  `)
})
