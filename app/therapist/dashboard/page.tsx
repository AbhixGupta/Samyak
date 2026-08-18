"use client";

import { useState } from "react";
import {
  MapPin,
  Navigation,
  Clock,
  User,
  Truck,
  CheckCircle2,
  Circle,
  Stethoscope,
  PackageCheck,
} from "lucide-react";

type VisitStatus = "en_route" | "arrived" | "treatment_started" | "completed";

const STATUS_FLOW: VisitStatus[] = [
  "en_route",
  "arrived",
  "treatment_started",
  "completed",
];

const STATUS_LABELS: Record<VisitStatus, string> = {
  en_route: "En Route",
  arrived: "Arrived",
  treatment_started: "Treatment Started",
  completed: "Completed",
};

interface Visit {
  id: string;
  patient_name: string;
  address: string;
  pin_code: string;
  therapy_type: string;
  duration_minutes: number;
  scheduled_at: string;
  status: VisitStatus;
  equipment: { label: string; checked: boolean }[];
}

const APPROVED_PIN_CODES = ["560001", "560034", "560095", "560102"];

const INITIAL_VISITS: Visit[] = [
  {
    id: "v1",
    patient_name: "Vivek Kumar",
    address: "204, Lotus Residency, 4th Cross, Indiranagar",
    pin_code: "560038",
    therapy_type: "Abhyanga",
    duration_minutes: 60,
    scheduled_at: "Today, 12:00 PM",
    status: "en_route",
    equipment: [
      { label: "Warm herbal oils", checked: true },
      { label: "Massage table", checked: true },
      { label: "Towels & linen", checked: false },
      { label: "Oil warmer", checked: false },
    ],
  },
  {
    id: "v2",
    patient_name: "Sameer Khan",
    address: "12A, Green Valley Apartments, HSR Layout",
    pin_code: "560102",
    therapy_type: "Shirodhara",
    duration_minutes: 75,
    scheduled_at: "Today, 3:30 PM",
    status: "arrived",
    equipment: [
      { label: "Shirodhara stand", checked: true },
      { label: "Herbal oil / buttermilk", checked: true },
      { label: "Head support cushion", checked: true },
      { label: "Towels & linen", checked: false },
    ],
  },
  {
    id: "v3",
    patient_name: "Karan Malhotra",
    address: "77, Palm Grove Villas, Whitefield",
    pin_code: "560066",
    therapy_type: "Udvartana",
    duration_minutes: 45,
    scheduled_at: "Today, 5:15 PM",
    status: "treatment_started",
    equipment: [
      { label: "Herbal powder mix", checked: true },
      { label: "Massage table", checked: true },
      { label: "Towels & linen", checked: true },
    ],
  },
];

function Toggle({
  checked,
  onChange,
  onLabel,
  offLabel,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  onLabel: string;
  offLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`flex items-center gap-2.5 rounded-full border px-1.5 py-1.5 pr-4 transition-colors ${
        checked
          ? "border-emerald-200 bg-emerald-50"
          : "border-zinc-200 bg-zinc-50"
      }`}
    >
      <span
        className={`relative h-6 w-11 rounded-full transition-colors ${
          checked ? "bg-emerald-600" : "bg-zinc-300"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </span>
      <span
        className={`text-sm font-medium ${
          checked ? "text-emerald-700" : "text-zinc-500"
        }`}
      >
        {checked ? onLabel : offLabel}
      </span>
    </button>
  );
}

function StatusTracker({
  status,
  onAdvance,
}: {
  status: VisitStatus;
  onAdvance: () => void;
}) {
  const currentIndex = STATUS_FLOW.indexOf(status);
  const isCompleted = status === "completed";

  return (
    <div>
      <div className="flex items-center">
        {STATUS_FLOW.map((step, index) => {
          const stepDone = index <= currentIndex;
          const isLast = index === STATUS_FLOW.length - 1;
          return (
            <div key={step} className="flex flex-1 items-center last:flex-none">
              <div className="flex flex-col items-center gap-1">
                {stepDone ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                ) : (
                  <Circle className="h-5 w-5 text-zinc-300" />
                )}
                <span
                  className={`text-[11px] font-medium whitespace-nowrap ${
                    stepDone ? "text-emerald-700" : "text-zinc-400"
                  }`}
                >
                  {STATUS_LABELS[step]}
                </span>
              </div>
              {!isLast && (
                <span
                  className={`mx-2 mb-4 h-0.5 flex-1 rounded ${
                    index < currentIndex ? "bg-emerald-500" : "bg-zinc-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {!isCompleted && (
        <button
          type="button"
          onClick={onAdvance}
          className="mt-4 w-full rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 sm:w-auto"
        >
          Mark as {STATUS_LABELS[STATUS_FLOW[currentIndex + 1]]}
        </button>
      )}
      {isCompleted && (
        <p className="mt-4 flex items-center gap-1.5 text-sm font-medium text-emerald-700">
          <CheckCircle2 className="h-4 w-4" />
          Visit completed
        </p>
      )}
    </div>
  );
}

export default function TherapistDashboardPage() {
  const [availableForVisits, setAvailableForVisits] = useState(true);
  const [visits, setVisits] = useState<Visit[]>(INITIAL_VISITS);

  function advanceStatus(id: string) {
    setVisits((prev) =>
      prev.map((visit) => {
        if (visit.id !== id) return visit;
        const currentIndex = STATUS_FLOW.indexOf(visit.status);
        const nextStatus = STATUS_FLOW[Math.min(currentIndex + 1, STATUS_FLOW.length - 1)];
        return { ...visit, status: nextStatus };
      })
    );
  }

  function toggleEquipment(visitId: string, label: string) {
    setVisits((prev) =>
      prev.map((visit) =>
        visit.id === visitId
          ? {
              ...visit,
              equipment: visit.equipment.map((item) =>
                item.label === label
                  ? { ...item, checked: !item.checked }
                  : item
              ),
            }
          : visit
      )
    );
  }

  return (
    <div className="min-h-full bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-lg font-semibold text-emerald-700">
              MK
            </span>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
                Meera Krishnan
              </h1>
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                <span className="flex items-center gap-1 text-xs text-zinc-500">
                  <MapPin className="h-3.5 w-3.5 text-emerald-600" />
                  Approved pincodes:
                </span>
                {APPROVED_PIN_CODES.map((pin) => (
                  <span
                    key={pin}
                    className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-600"
                  >
                    {pin}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <Toggle
            checked={availableForVisits}
            onChange={setAvailableForVisits}
            onLabel="Available for Home Visits"
            offLabel="Unavailable"
          />
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-4 flex items-center gap-2">
          <Truck className="h-5 w-5 text-emerald-600" />
          <h2 className="text-lg font-semibold text-zinc-900">
            Assigned Home Visits
          </h2>
        </div>

        <div className="space-y-5">
          {visits.map((visit) => {
            const checkedCount = visit.equipment.filter(
              (item) => item.checked
            ).length;
            return (
              <div
                key={visit.id}
                className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div className="flex items-start gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-500">
                      <User className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-base font-semibold text-zinc-900">
                        {visit.patient_name}
                      </h3>
                      <p className="mt-0.5 text-sm text-zinc-600">
                        {visit.address}
                      </p>
                      <p className="text-sm text-zinc-500">
                        PIN: {visit.pin_code}
                      </p>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                          `${visit.address} ${visit.pin_code}`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1.5 inline-flex items-center gap-1.5 text-sm font-medium text-emerald-600 hover:text-emerald-700"
                      >
                        <Navigation className="h-3.5 w-3.5" />
                        Open in Maps
                      </a>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:flex-col sm:items-end">
                    <span className="flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
                      <Stethoscope className="h-3.5 w-3.5" />
                      {visit.therapy_type}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                      <Clock className="h-3.5 w-3.5" />
                      {visit.scheduled_at} · {visit.duration_minutes} min
                    </span>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-zinc-100 bg-zinc-50 p-4">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-sm font-medium text-zinc-700">
                      <PackageCheck className="h-4 w-4 text-emerald-600" />
                      Equipment checklist
                    </span>
                    <span className="text-xs font-medium text-zinc-500">
                      {checkedCount}/{visit.equipment.length} ready
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {visit.equipment.map((item) => (
                      <label
                        key={item.label}
                        className="flex items-center gap-2 text-sm text-zinc-600"
                      >
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={() =>
                            toggleEquipment(visit.id, item.label)
                          }
                          className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
                        />
                        {item.label}
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mt-5 border-t border-zinc-100 pt-4">
                  <StatusTracker
                    status={visit.status}
                    onAdvance={() => advanceStatus(visit.id)}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
