import { Provider } from 'react-redux'
import './App.css'
import { store } from './app/store'
import { RouterProvider } from 'react-router-dom'
import Routes from './router/Routes'
import { Toaster } from 'react-hot-toast'
import NotificationProvider from './Provider/NotificationProvider'

function App() {

  return (
    <>
    <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            style: {
              background: '#22c55e',
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#22c55e',
            },
          },
          error: {
            duration: 4000,
            style: {
              background: '#ef4444',
              color: '#fff',
            },
            iconTheme: {
              primary: '#fff',
              secondary: '#ef4444',
            },
          },
          loading: {
            style: {
              background: '#3b82f6',
              color: '#fff',
            },
          },
        }}
      />
      <Provider store={store}>
        <NotificationProvider>
        <RouterProvider router={Routes}/>
        </NotificationProvider>
      </Provider>
    </>
  )
}

export default App
