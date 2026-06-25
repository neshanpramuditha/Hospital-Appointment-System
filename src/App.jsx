import DoctorsList from './pages/doctors/DoctorsList'

function App() {
    return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="w-96 h-96 bg-white rounded-lg shadow-lg flex items-center justify-center"> <DoctorsList /> </div>
      <h1 className="text-5xl font-bold text-blue-600">
        Tailwind CSS is Working 🎉
      </h1>
    </div>
  )
    
}

export default App