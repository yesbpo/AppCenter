import '../styles/globals.css'
import { persister, store } from "../store/store";
import { PersistGate } from "redux-persist/integration/react";
import {Provider} from "react-redux";
import { SessionProvider } from "next-auth/react"
import '../styles/sidebar.css'
import '../styles/templates.css'
import '../styles/envios.css'

function MyApp({Component, pageProps}) {

  return ( 
  <SessionProvider session={pageProps.session} >
    <Provider store={store}>
    <PersistGate loading={null} persistor={persister}>
      <Component {...pageProps} />
    </PersistGate>
  </Provider>
  </SessionProvider>
  )
}

export default MyApp
