import { Link } from "react-router-dom";
import {
  CalendarCheck,
  CalendarPlus,
  Clock,
  UserRound,
  Stethoscope,
} from "lucide-react";

function DoctorDashboard() {
  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-5 rounded-2xl bg-gradient-to-r from-primary via-secondary to-accent p-5 text-white shadow-lg md:p-6">
        <p className="mb-1 text-sm font-medium text-white/80">
          Doctor Dashboard
        </p>

        <h1 className="text-2xl font-bold md:text-3xl">
          Welcome to Doctor Portal
        </h1>

        <p className="mt-1 max-w-lg text-sm text-white/80">
          Manage appointments, schedules, patients, and doctor profile details.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <DashboardCard
          icon={<CalendarCheck size={26} />}
          title="My Appointments"
          description="View patient appointments and manage appointment status."
          link="/doctor/appointments"
          button="View Appointments"
        />

        <DashboardCard
          icon={<Clock size={26} />}
          title="My Schedule"
          description="Manage available dates and time slots for appointments."
          link="/doctor/schedules"
          button="View Schedule"
        />

        <DashboardCard
          icon={<UserRound size={26} />}
          title="My Patients"
          description="View patients who booked appointments with you."
          link="/doctor/patients"
          button="View Patients"
        />

        <DashboardCard
          icon={<Stethoscope size={26} />}
          title="Doctor Profile"
          description="Update doctor profile and specialization information."
          link="/doctor/profile"
          button="View Profile"
        />
      </div>

      <div className="mt-5 rounded-2xl bg-white p-5 shadow-lg md:p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white">
            <CalendarPlus size={24} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-primary">
              Quick Doctor Actions
            </h2>
            <p className="text-sm text-gray-500">
              Use these shortcuts to manage daily doctor activities.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <Link
            to="/doctor/appointments"
            className="rounded-xl bg-gray-50 p-4 text-center font-semibold text-primary hover:bg-primary hover:text-white"
          >
            Appointments
          </Link>

          <Link
            to="/doctor/schedules/add"
            className="rounded-xl bg-gray-50 p-4 text-center font-semibold text-primary hover:bg-primary hover:text-white"
          >
            Add Schedule
          </Link>

          <Link
            to="/doctor/profile"
            className="rounded-xl bg-gray-50 p-4 text-center font-semibold text-primary hover:bg-primary hover:text-white"
          >
            Profile
          </Link>
        </div>
      </div>
    </div>
  );
}

function DashboardCard({ icon, title, description, link, button }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-lg transition hover:-translate-y-1 hover:shadow-xl">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white">
        {icon}
      </div>

      <h2 className="text-xl font-bold text-primary">{title}</h2>

      <p className="mt-2 text-sm text-gray-500">{description}</p>

      <Link
        to={link}
        className="mt-5 inline-flex rounded-xl bg-gradient-to-r from-primary to-accent px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:opacity-90"
      >
        {button}
      </Link>
    </div>
  );
}

export default DoctorDashboard;