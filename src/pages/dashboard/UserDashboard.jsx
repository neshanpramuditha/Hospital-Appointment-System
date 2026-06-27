import { Link } from "react-router-dom";
import {
  CalendarCheck,
  CalendarPlus,
  Search,
  UserRound,
  Stethoscope,
} from "lucide-react";

function UserDashboard() {
  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="mb-5 rounded-2xl bg-gradient-to-r from-primary via-secondary to-accent p-5 text-white shadow-lg md:p-6">
        <p className="mb-1 text-sm font-medium text-white/80">
          Patient Dashboard
        </p>

        <h1 className="text-2xl font-bold md:text-3xl">
          Welcome to Patient Portal
        </h1>

        <p className="mt-1 max-w-lg text-sm text-white/80">
          Find doctors, book appointments, and manage your healthcare profile.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <DashboardCard
          icon={<Search size={26} />}
          title="Find Doctors"
          description="Browse doctors by name, contact details, or specialization."
          link="/patient/doctors"
          button="Find Doctor"
        />

        <DashboardCard
          icon={<CalendarPlus size={26} />}
          title="Book Appointment"
          description="Select a doctor and available schedule to book a visit."
          link="/patient/doctors"
          button="Book Now"
        />

        <DashboardCard
          icon={<CalendarCheck size={26} />}
          title="My Appointments"
          description="View your booked appointments and appointment details."
          link="/patient/appointments"
          button="View Appointments"
        />

        <DashboardCard
          icon={<UserRound size={26} />}
          title="My Profile"
          description="Update your patient profile and contact information."
          link="/patient/profile"
          button="View Profile"
        />
      </div>

      <div className="mt-5 rounded-2xl bg-white p-5 shadow-lg md:p-6">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-white">
            <Stethoscope size={24} />
          </div>

          <div>
            <h2 className="text-xl font-bold text-primary">
              Quick Patient Actions
            </h2>
            <p className="text-sm text-gray-500">
              Use these shortcuts to access common patient services.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <Link
            to="/patient/doctors"
            className="rounded-xl bg-gray-50 p-4 text-center font-semibold text-primary hover:bg-primary hover:text-white"
          >
            Search Doctors
          </Link>

          <Link
            to="/patient/appointments"
            className="rounded-xl bg-gray-50 p-4 text-center font-semibold text-primary hover:bg-primary hover:text-white"
          >
            Appointments
          </Link>

          <Link
            to="/patient/profile"
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

export default UserDashboard;