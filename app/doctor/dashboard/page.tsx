"use client";

import { useState } from "react";
import {
  Video,
  Stethoscope,
  Clock,
  FileText,
  X,
  Plus,
  CalendarDays,
  User,
  CheckCircle2,
} from "lucide-react";

type Day = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

const DAYS: Day[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface Appointment {
  id: string;
  patient_name: string;
  reason: string;
  scheduled_at: string;
  duration_minutes: number;
  notes: string;
}

const INITIAL_SCHEDULE: Record<Day, string[]> = {
  Mon: ["09:00", "09:30", "10:00", "16:00"],
  Tue: ["09:00", "09:30", "16:00", "16:30"],
  Wed: ["09:00", "09:30", "10:00"],
  Thu: ["16:00", "16:30", "17:00"],
  Fri: ["09:00", "09:30", "10:00", "10:30"],
  Sat: ["10:00", "10:30"],
  Sun: [],
};

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: "a1",
    patient_name: "Ritika Sharma",
    reason: "Follow-up for acid reflux and bloating",
    scheduled_at: "Today, 10:30 AM",
    duration_minutes: 30,
    notes: "",
  },
  {
    id: "a2",
    patient_name: "Ananya Joshi",
    reason: "New consultation — chronic migraines",
    scheduled_at: "Today, 3:15 PM",
    duration_minutes: 45,
    notes: "",
  },
  {
    id: "a3",
    patient_name: "Priya Menon",
    reason: "Skin condition review, prescription renewal",
    scheduled_at: "Tomorrow, 9:00 AM",
    duration_minutes: 30,
    notes: "Patient reports mild improvement with previous herbal ointment.",
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

function PrescriptionModal({
  appointment,
  onClose,
  onSave,
}: {
  appointment: Appointment;
  onClose: () => void;
  onSave: (id: string, notes: string) => void;
}) {
  const [draft, setDraft] = useState(appointment.notes);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-zinc-900">
              Prescription Notes
            </h2>
            <p className="mt-0.5 text-sm text-zinc-500">
              {appointment.patient_name} · {appointment.scheduled_at}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1.5 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-4">
          <label
            htmlFor="notes"
            className="mb-1.5 block text-sm font-medium text-zinc-700"
          >
            Notes &amp; prescription
          </label>
          <textarea
            id="notes"
            rows={6}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Add diagnosis, herbal prescriptions, dosage, and dietary advice..."
            className="w-full rounded-lg border border-zinc-200 px-3.5 py-2.5 text-sm text-zinc-900 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onSave(appointment.id, draft);
              onClose();
            }}
            className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            Save Notes
          </button>
        </div>
      </div>
    </div>
  );
}

export default function DoctorDashboardPage() {
  const [online, setOnline] = useState(true);
  const [schedule, setSchedule] =
    useState<Record<Day, string[]>>(INITIAL_SCHEDULE);
  const [newSlotInputs, setNewSlotInputs] = useState<Record<Day, string>>({
    Mon: "",
    Tue: "",
    Wed: "",
    Thu: "",
    Fri: "",
    Sat: "",
    Sun: "",
  });
  const [appointments, setAppointments] =
    useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [activeModal, setActiveModal] = useState<Appointment | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 3000);
  }

  function addSlot(day: Day) {
    const value = newSlotInputs[day];
    if (!value) return;
    setSchedule((prev) => ({
      ...prev,
      [day]: [...prev[day], value].sort(),
    }));
    setNewSlotInputs((prev) => ({ ...prev, [day]: "" }));
  }

  function removeSlot(day: Day, slot: string) {
    setSchedule((prev) => ({
      ...prev,
      [day]: prev[day].filter((s) => s !== slot),
    }));
  }

  function saveNotes(id: string, notes: string) {
    setAppointments((prev) =>
      prev.map((appt) => (appt.id === id ? { ...appt, notes } : appt))
    );
    showToast("Prescription notes saved.");
  }

  return (
    <div className="min-h-full bg-zinc-50">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-lg font-semibold text-emerald-700">
              RI
            </span>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-zinc-900">
                Dr. Ramesh Iyer
              </h1>
              <p className="flex items-center gap-1.5 text-sm text-zinc-500">
                <Stethoscope className="h-4 w-4 text-emerald-600" />
                Panchakarma &amp; Joint Care Specialist
              </p>
            </div>
          </div>
          <Toggle
            checked={online}
            onChange={setOnline}
            onLabel="Online for Consults"
            offLabel="Offline"
          />
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-8">
        <section>
          <div className="mb-4 flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-semibold text-zinc-900">
              Weekly Schedule Manager
            </h2>
          </div>
          <p className="mb-4 text-sm text-zinc-500">
            Set the video consultation time slots you're available for each
            day of the week.
          </p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7">
            {DAYS.map((day) => (
              <div
                key={day}
                className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm"
              >
                <h3 className="text-sm font-semibold text-zinc-900">{day}</h3>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {schedule[day].length === 0 && (
                    <span className="text-xs text-zinc-400">
                      No slots set
                    </span>
                  )}
                  {schedule[day].map((slot) => (
                    <span
                      key={slot}
                      className="group flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700"
                    >
                      {slot}
                      <button
                        type="button"
                        onClick={() => removeSlot(day, slot)}
                        aria-label={`Remove ${slot} on ${day}`}
                        className="text-emerald-400 hover:text-emerald-700"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="mt-3 flex items-center gap-1.5">
                  <input
                    type="time"
                    value={newSlotInputs[day]}
                    onChange={(event) =>
                      setNewSlotInputs((prev) => ({
                        ...prev,
                        [day]: event.target.value,
                      }))
                    }
                    className="w-full rounded-lg border border-zinc-200 px-2 py-1.5 text-xs text-zinc-700 outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => addSlot(day)}
                    aria-label={`Add slot on ${day}`}
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-4 flex items-center gap-2">
            <Video className="h-5 w-5 text-emerald-600" />
            <h2 className="text-lg font-semibold text-zinc-900">
              Upcoming Video Appointments
            </h2>
          </div>

          <div className="space-y-4">
            {appointments.map((appt) => (
              <div
                key={appt.id}
                className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-500">
                    <User className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-zinc-900">
                      {appt.patient_name}
                    </h3>
                    <p className="text-sm text-zinc-500">{appt.reason}</p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-zinc-400">
                      <Clock className="h-3.5 w-3.5" />
                      {appt.scheduled_at} · {appt.duration_minutes} min
                    </p>
                    {appt.notes && (
                      <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Prescription notes added
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveModal(appt)}
                    className="flex items-center gap-1.5 rounded-full border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-50"
                  >
                    <FileText className="h-4 w-4" />
                    {appt.notes ? "Edit Notes" : "Add Prescription Notes"}
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      showToast(`Joining video call with ${appt.patient_name}...`)
                    }
                    className="flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
                  >
                    <Video className="h-4 w-4" />
                    Join Video Call
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {activeModal && (
        <PrescriptionModal
          appointment={activeModal}
          onClose={() => setActiveModal(null)}
          onSave={saveNotes}
        />
      )}

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-zinc-900 px-5 py-3 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
