import './App.css'
import { Route, Routes } from 'react-router-dom'
import { LoginForm } from './components/login-form'
import Home from './pages/home'
import { SidebarProvider } from './components/ui/sidebar'
import DefaultLayout from './components/default-layout'
import NewPage from './pages/new-page'
import ViewEditPage from './pages/ViewEditPage'
import { PagesProvider } from './contexts/PagesContext'

function App() {

  return (
    <SidebarProvider>
      <PagesProvider>
        <DefaultLayout>
          <Routes>
            <Route path="/" element={<LoginForm />} />
            <Route path="/home" element={<Home />} />
            <Route path="/new-page" element={<NewPage />} />
            <Route path="/page/:id" element={<ViewEditPage />} />
          </Routes>
        </DefaultLayout>
      </PagesProvider>
    </SidebarProvider>
    )
}

export default App
