import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import PromptEditor from './pages/PromptEditor'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <header className="bg-gradient-to-r from-indigo-600 to-blue-500 shadow-lg">
          <div className="mx-auto max-w-7xl px-4 py-4 flex items-center gap-3">
            <span className="text-2xl">&#9997;&#65039;</span>
            <Link to="/" className="text-2xl font-bold text-white no-underline tracking-tight">
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
