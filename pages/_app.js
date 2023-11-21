import '../styles/globals.css'
import { persister, store } from "../store/store";
import { PersistGate } from "redux-persist/integration/react";
import {Provider} from "react-redux";

function MyApp({Component, pageProps}) {
  return <Provider store={store}>
    <PersistGate loading={null} persistor={persister}>
      <Component {...pageProps} />
    </PersistGate>
  </Provider>
}

export default MyApp
