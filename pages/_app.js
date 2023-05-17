import '../styles/globals.css'

// export default function App({ Component, pageProps }) {
//   return <Component {...pageProps} />
// }
import { ApolloProvider } from '@apollo/client';
import client from '../config/apollo';

const MyApp = ({ Component, pageProps }) => {
  return(
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}

export default MyApp;