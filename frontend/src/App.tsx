import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import PromptEditor from './pages/PromptEditor'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl px-4 py-4">
            <Link to="/" className="text-2xl font-bold text-gray-900 no-underline">
              Prompt Library
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/prompts/new" element={<PromptEditor />} />
            <Route path="/prompts/:id" element={<PromptEditor />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
