"use client";

import { useState } from "react";

interface Vaidya {
  id: string;
  full_name: string;
  qualification: string;
  specializations: string[];
  experience_years: number;
  bio: string;
  consultation_fee_paise: number;
  available: boolean;
}

interface Therapist {
  id: string;
  full_name: string;
  qualification: string;
  therapies_offered: string[];
  experience_years: number;
  bio: string;
  visit_fee_paise: number;
  service_pin_codes: string[];
  available: boolean;
}

type Tab = "online" | "home_visit";

const VAIDYAS: Vaidya[] = [
  {
    id: "v1",
    full_name: "Dr. Anjali Nair",
    qualification: "BAMS, MD (Ayurveda)",
    specializations: ["Digestive Health", "Skin Disorders", "Women's Health"],
    experience_years: 14,
    bio: "Dr. Nair specializes in restoring digestive balance through diet, herbs, and lifestyle correction, with over a decade of clinical practice.",
    consultation_fee_paise: 80000,
    available: true,
  },
  {
    id: "v2",
    full_name: "Dr. Ramesh Iyer",
    qualification: "BAMS, PhD (Ayurvedic Medicine)",
    specializations: ["Joint & Bone Care", "Panchakarma", "Stress Management"],
    experience_years: 21,
    bio: "A senior vaidya focused on chronic pain and joint disorders, blending classical Ayurveda with modern diagnostic insight.",
    consultation_fee_paise: 120000,
    available: true,
  },
  {
    id: "v3",
    full_name: "Dr. Kavita Menon",
    qualification: "BAMS",
    specializations: ["Skin Disorders", "Immunity Building"],
    experience_years: 8,
    bio: "Dr. Menon helps patients build long-term immunity and manage chronic skin conditions using time-tested Ayurvedic protocols.",
    consultation_fee_paise: 60000,
    available: false,
  },
  {
    id: "v4",
    full_name: "Dr. Suresh Pillai",
    qualification: "BAMS, MS (Ayurveda Surgery)",
    specializations: ["Respiratory Care", "Digestive Health"],
    experience_years: 17,
    bio: "Dr. Pillai brings a surgical background combined with classical Ayurveda to treat respiratory and gastrointestinal conditions.",
    consultation_fee_paise: 90000,
    available: true,
  },
];

const THERAPISTS: Therapist[] = [
  {
    id: "t1",
    full_name: "Meera Krishnan",
    qualification: "Diploma in Panchakarma Therapy",
    therapies_offered: ["Abhyanga", "Shirodhara", "Udvartana"],
    experience_years: 9,
    bio: "Meera is a certified Panchakarma therapist skilled in full-body detox therapies and relaxation-focused treatments at home.",
    visit_fee_paise: 150000,
    service_pin_codes: ["560001", "560034", "560095"],
    available: true,
  },
  {
    id: "t2",
    full_name: "Arjun Das",
    qualification: "BAMS, Certified Panchakarma Specialist",
    therapies_offered: ["Basti", "Nasya", "Kati Basti"],
    experience_years: 12,
    bio: "Arjun focuses on therapeutic detox and pain-relief procedures, bringing clinical-grade Panchakarma care to your home.",
    visit_fee_paise: 200000,
    service_pin_codes: ["560001", "560002"],
    available: true,
  },
  {
    id: "t3",
    full_name: "Lakshmi Suresh",
    qualification: "Diploma in Ayurvedic Therapy",
    therapies_offered: ["Abhyanga", "Pizhichil", "Shirodhara"],
    experience_years: 6,
    bio: "Lakshmi delivers calming, traditional oil therapies designed to relieve stress and restore balance in a home setting.",
    visit_fee_paise: 175000,
    service_pin_codes: ["560034", "560041"],
    available: false,
  },
  {
    id: "t4",
    full_name: "Vikram Rao",
    qualification: "Diploma in Panchakarma Therapy",
    therapies_offered: ["Udvartana", "Kati Basti", "Njavara Kizhi"],
    experience_years: 11,
    bio: "Vikram specializes in weight management and joint therapies, offering personalized home-visit treatment plans.",
    visit_fee_paise: 160000,
    service_pin_codes: ["560001", "560095", "560102"],
    available: true,
  },
];

function formatFee(paise: number): string {
  return `₹${(paise / 100).toLocaleString("en-IN")}`;
}

function initials(name: string): string {
  return name
    .replace(/^Dr\.\s*/i, "")
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function Avatar({ name }: { name: string }) {
  return (
    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-lg font-semibold text-emerald-700">
      {initials(name)}
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
      {children}
    </span>
  );
}

function AvailabilityBadge({ available }: { available: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
        available
          ? "bg-green-50 text-green-700"
          : "bg-zinc-100 text-zinc-500"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          available ? "bg-green-500" : "bg-zinc-400"
        }`}
      />
      {available ? "Available" : "Unavailable"}
    </span>
  );
}

function VaidyaCard({
  vaidya,
  onBook,
}: {
  vaidya: Vaidya;
  onBook: (name: string) => void;
}) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar name={vaidya.full_name} />
            <div>
              <h3 className="text-base font-semibold text-zinc-900">
                {vaidya.full_name}
              </h3>
              <p className="text-sm text-zinc-500">{vaidya.qualification}</p>
            </div>
          </div>
          <AvailabilityBadge available={vaidya.available} />
        </div>

        <p className="mt-3 text-sm leading-relaxed text-zinc-600">
          {vaidya.bio}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {vaidya.specializations.map((spec) => (
            <Pill key={spec}>{spec}</Pill>
          ))}
        </div>

        <p className="mt-3 text-sm text-zinc-500">
          {vaidya.experience_years} years of experience
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-4">
        <div>
          <p className="text-xs text-zinc-400">Consultation fee</p>
          <p className="text-lg font-semibold text-zinc-900">
            {formatFee(vaidya.consultation_fee_paise)}
          </p>
        </div>
        <button
          type="button"
          disabled={!vaidya.available}
          onClick={() => onBook(vaidya.full_name)}
          className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-400"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}

function TherapistCard({
  therapist,
  onBook,
}: {
  therapist: Therapist;
  onBook: (name: string) => void;
}) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <Avatar name={therapist.full_name} />
            <div>
              <h3 className="text-base font-semibold text-zinc-900">
                {therapist.full_name}
              </h3>
              <p className="text-sm text-zinc-500">
                {therapist.qualification}
              </p>
            </div>
          </div>
          <AvailabilityBadge available={therapist.available} />
        </div>

        <p className="mt-3 text-sm leading-relaxed text-zinc-600">
          {therapist.bio}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {therapist.therapies_offered.map((therapy) => (
            <Pill key={therapy}>{therapy}</Pill>
          ))}
        </div>

        <p className="mt-3 text-sm text-zinc-500">
          {therapist.experience_years} years of experience
        </p>

        <p className="mt-1 text-xs text-zinc-400">
          Serves pin codes: {therapist.service_pin_codes.join(", ")}
        </p>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-4">
        <div>
          <p className="text-xs text-zinc-400">Home visit fee</p>
          <p className="text-lg font-semibold text-zinc-900">
            {formatFee(therapist.visit_fee_paise)}
          </p>
        </div>
        <button
          type="button"
          disabled={!therapist.available}
          onClick={() => onBook(therapist.full_name)}
          className="rounded-full bg-emerald-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-400"
        >
          Book Now
        </button>
      </div>
    </div>
  );
}

export default function BookingPage() {
  const [activeTab, setActiveTab] = useState<Tab>("online");
  const [toast, setToast] = useState<string | null>(null);

  function handleBook(name: string) {
    setToast(`Booking request sent to ${name}. They'll confirm shortly.`);
    window.setTimeout(() => setToast(null), 3500);
  }

  return (
    <div className="min-h-full bg-zinc-50">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
            Book Your Ayurvedic Care
          </h1>
          <p className="mt-2 text-sm text-zinc-500 sm:text-base">
            Consult a Vaidya online or book a Panchakarma therapist for a home
            visit.
          </p>
        </header>

        <div className="mb-8 inline-flex w-full gap-1 rounded-full border border-zinc-200 bg-white p-1 sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab("online")}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors sm:flex-none ${
              activeTab === "online"
                ? "bg-emerald-600 text-white"
                : "text-zinc-600 hover:bg-zinc-100"
            }`}
          >
            Consult a Vaidya (Online)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("home_visit")}
            className={`flex-1 rounded-full px-4 py-2 text-sm font-medium transition-colors sm:flex-none ${
              activeTab === "home_visit"
                ? "bg-emerald-600 text-white"
                : "text-zinc-600 hover:bg-zinc-100"
            }`}
          >
            Book Panchakarma Therapist (Home Visit)
          </button>
        </div>

        {activeTab === "online" ? (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {VAIDYAS.map((vaidya) => (
              <VaidyaCard key={vaidya.id} vaidya={vaidya} onBook={handleBook} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {THERAPISTS.map((therapist) => (
              <TherapistCard
                key={therapist.id}
                therapist={therapist}
                onBook={handleBook}
              />
            ))}
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
