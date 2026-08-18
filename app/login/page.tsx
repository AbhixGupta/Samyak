import Link from "next/link";

interface LoginOption {
  title: string;
  description: string;
  href: string;
  icon: string;
}

const LOGIN_OPTIONS: LoginOption[] = [
  {
    title: "Patient",
    description: "Book online consultations and Panchakarma home visits.",
    href: "/login/patient",
    icon: "🧑‍⚕️",
  },
  {
    title: "Vaidya",
    description: "Manage your consultations and patient appointments.",
    href: "/login/vaidya",
    icon: "🌿",
  },
  {
    title: "Panchakarma Therapist",
    description: "View and manage your home visit bookings.",
    href: "/login/therapist",
    icon: "🧴",
  },
  {
    title: "Admin Portal",
    description: "Manage providers, approvals, and platform operations.",
    href: "/login/admin",
    icon: "🛡️",
  },
];

export default function LoginPage() {
  return (
    <div className="flex min-h-full flex-1 items-center justify-center bg-zinc-50 px-6 py-16">
      <div className="w-full max-w-4xl">
        <div className="mb-10 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
            Welcome to AyurCare
          </h1>
          <p className="mt-2 text-sm text-zinc-500 sm:text-base">
            Choose how you'd like to sign in
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {LOGIN_OPTIONS.map((option) => (
            <Link
              key={option.href}
              href={option.href}
              className="group flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
            >
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-2xl">
                  {option.icon}
                </div>
                <h2 className="mt-4 text-lg font-semibold text-zinc-900">
                  {option.title}
                </h2>
                <p className="mt-1.5 text-sm text-zinc-500">
                  {option.description}
                </p>
              </div>
              <div className="mt-5 flex items-center gap-1 text-sm font-medium text-emerald-600">
                Continue
                <span className="transition-transform group-hover:translate-x-1">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
