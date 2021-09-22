import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import { BaseProvider } from 'baseui';
import { ToasterContainer } from 'baseui/toast';
import { ApolloProvider } from '@apollo/react-hooks';
import { theme } from './theme';
import Routes from './routes';
import ApolloClient from 'apollo-boost';
import * as serviceWorker from './serviceWorker';
import './theme/global.css';

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDIbYr1PWgESCldK_C0OYoVOQMjU_lEJig",
  authDomain: "fresh-io.firebaseapp.com",
  databaseURL: "https://fresh-io.firebaseio.com",
  projectId: "fresh-io",
  storageBucket: "fresh-io.appspot.com",
  messagingSenderId: "51185430857",
  appId: "1:51185430857:web:de29941c9b5ee51b09aa98",
  measurementId: "G-9WS3L8QVF7"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const client = new ApolloClient({
  uri: process.env.REACT_APP_API_URL,
});

function App() {
  const engine = new Styletron();

  return (
    <ApolloProvider client={client as any}>
      <StyletronProvider value={engine}>
        <BaseProvider theme={theme}>
          <BrowserRouter>
            <ToasterContainer autoHideDuration={3000}>
              <Routes />
            </ToasterContainer>
          </BrowserRouter>
        </BaseProvider>
      </StyletronProvider>
    </ApolloProvider>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
