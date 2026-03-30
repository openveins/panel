import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import './styles.css'
import NotFoundComponent from './components/ui/not-found'

const router = createRouter({
  routeTree,
  defaultPreload: false,
  scrollRestoration: true,
  context: {
    user: null
  },
  defaultNotFoundComponent: NotFoundComponent
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

const rootElement = document.getElementById('root')!

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(<RouterProvider router={router} />)
}