import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from 'apollo-link-context';
import { onError } from "@apollo/client/link/error";

// const httpLink = createHttpLink({
//     uri : 'https://morning-journey-09515.herokuapp.com/',
//     fetch
// });
const httpLink = createHttpLink({
    uri : 'https://656e9a254c37ab0497a9b327--rococo-hotteok-094ba8.netlify.app/',
    fetch
});

const authLink = setContext((_, { headers }) => {

    const token = localStorage.getItem('token');
    return {
        headers: {
            ...headers,
            authorization : token ? `Bearer ${token}` : ''
        }
    }
});

const client = new ApolloClient({
    connectToDevTools: true,
    cache : new InMemoryCache(),
    link : authLink.concat(httpLink)
});

export default client;
