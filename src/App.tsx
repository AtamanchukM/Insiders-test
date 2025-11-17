import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import Layout from './Layout/Layout'

// Демо компоненти для кожного таба
function Dashboard() {
  return <div className="p-8"><h1 className="text-2xl font-bold">Dashboard</h1></div>
}

function Accounting() {
  return <div className="p-8"><h1 className="text-2xl font-bold">Accounting</h1></div>
}

function Administration() {
  return <div className="p-8"><h1 className="text-2xl font-bold">Administration</h1></div>
}

function Auswahilsten() {
  return <div className="p-8"><h1 className="text-2xl font-bold">Auswahilsten</h1></div>
}

function Banking() {
  return <div className="p-8"><h1 className="text-2xl font-bold">Banking</h1></div>
}

function Help() {
  return <div className="p-8"><h1 className="text-2xl font-bold">Help</h1></div>
}

function PostOffice() {
  return <div className="p-8"><h1 className="text-2xl font-bold">Post Office</h1></div>
}

function Statistik() {
  return <div className="p-8"><h1 className="text-2xl font-bold">Statistik</h1></div>
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="accounting" element={<Accounting />} />
        <Route path="administration" element={<Administration />} />
        <Route path="auswahilsten" element={<Auswahilsten />} />
        <Route path="banking" element={<Banking />} />
        <Route path="help" element={<Help />} />
        <Route path="postoffice" element={<PostOffice />} />
        <Route path="statistik" element={<Statistik />} />
      </Route>
    </Routes>
  )
}

export default App
