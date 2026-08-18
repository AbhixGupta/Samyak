"use client";

import { useState } from "react";

type ProviderType = "vaidya" | "therapist";
type AppointmentType = "online_consultation" | "home_visit";
type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "in_progress"
  | "completed"
  | "cancelled";

interface PendingApproval {
  id: string;
  type: ProviderType;
  full_name: string;
  email: string;
  qualification: string;
  tags: string[];
  experience_years: number;
  submitted_at: string;
}

interface Booking {
  id: string;
  patient_name: string;
  appointment_type: AppointmentType;
  provider_name: string;
  scheduled_at: string;
  status: AppointmentStatus;
  amount_paise: number;
}

interface Kpi {
  label: string;
  value: string;
  delta: string;
  positive: boolean;
  icon: string;
}

const KPIS: Kpi[] = [
  {
    label: "Total Revenue",
    value: "₹18,42,500",
    delta: "+12.4% this month",
    positive: true,
    icon: "💰",
  },
  {
    label: "Active Vaidyas",
    value: "24",
    delta: "+3 this month",
    positive: true,
    icon: "🌿",
  },
  {
    label: "Active Therapists",
    value: "17",
    delta: "+1 this month",
    positive: true,
    icon: "🧴",
  },
  {
    label: "Total Bookings",
    value: "1,286",
    delta: "-2.1% vs last month",
    positive: false,
    icon: "📅",
  },
];

const INITIAL_APPROVALS: PendingApproval[] = [
  {
    id: "p1",
    type: "vaidya",
    full_name: "Dr. Nikhil Varma",
    email: "nikhil.varma@example.com",
    qualification: "BAMS, MD (Ayurveda)",
    tags: ["Digestive Health", "Immunity Building"],
    experience_years: 6,
    submitted_at: "2026-08-15",
  },
  {
    id: "p2",
    type: "therapist",
    full_name: "Sowmya Reddy",
    email: "sowmya.reddy@example.com",
    qualification: "Diploma in Panchakarma Therapy",
    tags: ["Abhyanga", "Shirodhara"],
    experience_years: 4,
    submitted_at: "2026-08-16",
  },
  {
    id: "p3",
    type: "vaidya",
    full_name: "Dr. Farhan Sheikh",
    email: "farhan.sheikh@example.com",
    qualification: "BAMS, MS (Ayurveda Surgery)",
    tags: ["Joint & Bone Care", "Panchakarma"],
    experience_years: 10,
    submitted_at: "2026-08-16",
  },
  {
    id: "p4",
    type: "therapist",
    full_name: "Deepak Nambiar",
    email: "deepak.nambiar@example.com",
    qualification: "BAMS, Certified Panchakarma Specialist",
    tags: ["Basti", "Nasya", "Kati Basti"],
    experience_years: 8,
    submitted_at: "2026-08-17",
  },
];

const BOOKINGS: Booking[] = [
  {
    id: "b1",
    patient_name: "Ritika Sharma",
    appointment_type: "online_consultation",
    provider_name: "Dr. Anjali Nair",
    scheduled_at: "2026-08-18 10:30 AM",
    status: "confirmed",
    amount_paise: 80000,
  },
  {
    id: "b2",
    patient_name: "Vivek Kumar",
    appointment_type: "home_visit",
    provider_name: "Meera Krishnan",
    scheduled_at: "2026-08-18 12:00 PM",
    status: "in_progress",
    amount_paise: 150000,
  },
  {
    id: "b3",
    patient_name: "Ananya Joshi",
    appointment_type: "online_consultation",
    provider_name: "Dr. Ramesh Iyer",
    scheduled_at: "2026-08-18 03:15 PM",
    status: "pending",
    amount_paise: 120000,
  },
  {
    id: "b4",
    patient_name: "Sameer Khan",
    appointment_type: "home_visit",
    provider_name: "Arjun Das",
    scheduled_at: "2026-08-17 05:00 PM",
    status: "completed",
    amount_paise: 200000,
  },
  {
    id: "b5",
    patient_name: "Priya Menon",
    appointment_type: "online_consultation",
    provider_name: "Dr. Suresh Pillai",
    scheduled_at: "2026-08-17 09:00 AM",
    status: "completed",
    amount_paise: 90000,
  },
  {
    id: "b6",
    patient_name: "Karan Malhotra",
    appointment_type: "home_visit",
    provider_name: "Vikram Rao",
    scheduled_at: "2026-08-16 11:30 AM",
    status: "cancelled",
    amount_paise: 160000,
  },
];

function formatFee(paise: number): string {
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}

function StatusBadge({ status }: { status: AppointmentStatus }) {
  const styles: Record<AppointmentStatus, string> = {
    pending: "bg-amber-50 text-amber-700",
    confirmed: "bg-blue-50 text-blue-700",
    in_progress: "bg-indigo-50 text-indigo-700",
    completed: "bg-green-50 text-green-700",
    cancelled: "bg-red-50 text-red-700",
  };
  const labels: Record<AppointmentStatus, string> = {
    pending: "Pending",
    confirmed: "Confirmed",
    in_progress: "In Progress",
    completed: "Completed",
    cancelled: "Cancelled",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}

function TypeBadge({ type }: { type: AppointmentType }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
        type === "online_consultation"
          ? "bg-emerald-50 text-emerald-700"
          : "bg-purple-50 text-purple-700"
      }`}
    >
      {type === "online_consultation" ? "Online Consultation" : "Home Visit"}
    </span>
  );
}

function ProviderTypeBadge({ type }: { type: ProviderType }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
        type === "vaidya"
          ? "bg-emerald-50 text-emerald-700"
          : "bg-purple-50 text-purple-700"
      }`}
    >
      {type === "vaidya" ? "Vaidya" : "Therapist"}
    </span>
  );
}

function KpiCard({ kpi }: { kpi: Kpi }) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-zinc-500">{kpi.label}</p>
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-50 text-lg">
          {kpi.icon}
        </span>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-zinc-900">
        {kpi.value}
      </p>
      <p
        className={`mt-1 text-xs font-medium ${
          kpi.positive ? "text-green-600" : "text-red-500"
        }`}
      >
        {kpi.delta}
      </p>
    </div>
  );
}

type Tab = "approvals" | "bookings";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<Tab>("approvals");
  const [approvals, setApprovals] = useState<PendingApproval[]>(
    INITIAL_APPROVALS
  );
  const [toast, setToast] = useState<string | null>(null);

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 3000);
  }

  function handleApprove(item: PendingApproval) {
    setApprovals((prev) => prev.filter((entry) => entry.id !== item.id));
    showToast(`${item.full_name} has been approved and is now active.`);
  }

  function handleReject(item: PendingApproval) {
    setApprovals((prev) => prev.filter((entry) => entry.id !== item.id));
    showToast(`${item.full_name}'s application has been rejected.`);
  }

  return (
    <div className="min-h-full bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
              Admin Dashboard
            </h1>
            <p className="text-sm text-zinc-500">
              Platform overview and provider management
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
              AD
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {KPIS.map((kpi) => (
            <KpiCard key={kpi.label} kpi={kpi} />
          ))}
        </div>

        <div className="mt-8 mb-6 inline-flex gap-1 rounded-full border border-zinc-200 bg-white p-1">
          <button
            type="button"
            onClick={() => setActiveTab("approvals")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "approvals"
                ? "bg-emerald-600 text-white"
                : "text-zinc-600 hover:bg-zinc-100"
            }`}
          >
            Pending Approvals
            {approvals.length > 0 && (
              <span
                className={`ml-2 rounded-full px-1.5 py-0.5 text-xs ${
                  activeTab === "approvals"
                    ? "bg-white/20 text-white"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {approvals.length}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("bookings")}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === "bookings"
                ? "bg-emerald-600 text-white"
                : "text-zinc-600 hover:bg-zinc-100"
            }`}
          >
            Recent Bookings
          </button>
        </div>

        {activeTab === "approvals" ? (
          <div className="space-y-4">
            {approvals.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-zinc-300 bg-white p-10 text-center text-sm text-zinc-500">
                No pending approvals. All caught up!
              </div>
            ) : (
              approvals.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold text-zinc-900">
                        {item.full_name}
                      </h3>
                      <ProviderTypeBadge type={item.type} />
                      <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700">
                        Awaiting License Verification
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-zinc-500">
                      {item.qualification} · {item.experience_years} years
                      experience
                    </p>
                    <p className="text-sm text-zinc-500">{item.email}</p>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="mt-2 text-xs text-zinc-400">
                      Submitted on{" "}
                      {new Date(item.submitted_at).toLocaleDateString(
                        "en-IN",
                        { day: "numeric", month: "short", year: "numeric" }
                      )}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() => handleReject(item)}
                      className="rounded-full border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                    >
                      Reject
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApprove(item)}
                      className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
                    <th className="px-5 py-3 font-medium">Patient</th>
                    <th className="px-5 py-3 font-medium">Type</th>
                    <th className="px-5 py-3 font-medium">Provider</th>
                    <th className="px-5 py-3 font-medium">Scheduled</th>
                    <th className="px-5 py-3 font-medium">Status</th>
                    <th className="px-5 py-3 text-right font-medium">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {BOOKINGS.map((booking) => (
                    <tr
                      key={booking.id}
                      className="transition-colors hover:bg-zinc-50"
                    >
                      <td className="px-5 py-4 font-medium text-zinc-900">
                        {booking.patient_name}
                      </td>
                      <td className="px-5 py-4">
                        <TypeBadge type={booking.appointment_type} />
                      </td>
                      <td className="px-5 py-4 text-zinc-600">
                        {booking.provider_name}
                      </td>
                      <td className="px-5 py-4 text-zinc-600">
                        {booking.scheduled_at}
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={booking.status} />
                      </td>
                      <td className="px-5 py-4 text-right font-medium text-zinc-900">
                        {formatFee(booking.amount_paise)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-zinc-900 px-5 py-3 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
