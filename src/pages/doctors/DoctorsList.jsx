import { useEffect, useState } from 'react'
import { supabase } from '../../services/supabase'

function DoctorsList() {
  const [doctors, setDoctors] = useState([])

  useEffect(() => {
    loadDoctors()
  }, [])

async function loadDoctors() {
  const { data, error } = await supabase
    .from('doctors')
    .select('*')

  console.log("DATA:", data)
  console.log("ERROR:", error)

  if (!error) {
    setDoctors(data)
  }
}

return (
  <div>
    <h1>Doctors</h1>

    <p>Total Doctors: {doctors.length}</p>

    {doctors.map((doctor) => (
      <div key={doctor.id}>
        <h3>{doctor.full_name}</h3>
        <p>{doctor.email}</p>
      </div>
    ))}
  </div>
)
}

export default DoctorsList

