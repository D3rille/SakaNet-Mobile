import { ApolloClient, InMemoryCache, createHttpLink, split } from "@apollo/client";
import { ApolloProvider } from "@apollo/client";
import { getMainDefinition } from '@apollo/client/utilities';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { setContext } from '@apollo/client/link/context';
import * as SecureStore from 'expo-secure-store';

const httpLink = createHttpLink({
  uri: 'http://192.168.1.23:4000/graphql',
});

const authLink = setContext(async (_, { headers }) => {
  let token = "";
  try {
    token = await SecureStore.getItemAsync('jwtToken');
    console.log('Token:', token);
  } catch (error) {
    console.error('Error retrieving token from secure store:', error);
  }

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  };
});

const wsLink =  new GraphQLWsLink(createClient({
  url: 'ws://192.168.1.23:4000/graphql/subscriptions',
}));

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link: authLink.concat(splitLink),
  cache: new InMemoryCache(),
});

export default client;

// Create a wrapper component to provide Apollo Client
// export const ApolloWrapper = ({ children }) => (
//   <ApolloProvider client={client}>{children}</ApolloProvider>
// );





