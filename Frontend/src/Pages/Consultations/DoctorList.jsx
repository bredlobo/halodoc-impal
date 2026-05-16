import { useState } from "react";
import { useDoctors } from "../../hooks/useDoctors";
import { useRequestConsultation } from "../../hooks/useConsultations";
import { useNavigate } from "react-router-dom";

export default function DoctorList() {
  const navigate = useNavigate();

  const { data: doctors, isLoading } = useDoctors();

  const requestMutation = useRequestConsultation({
    onSuccess: (res) => {
      alert("Consultation requested successfully!");
      // Redirect to payment page with the newly created consultation ID
      if (res.data && res.data.id) {
        navigate(`/consultations/${res.data.id}/payment`);
      }
    },
    onError: (err) => {
      console.error(err);
      alert("Failed to request consultation");
    },
  });

  return (
    <div className="mx-auto mt-10 max-w-5xl p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
            Our Specialists
          </h1>
          <p className="mt-2 text-lg text-gray-500">
            Choose a doctor and book your consultation instantly.
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-64 animate-pulse rounded-2xl bg-gray-100"
            ></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {doctors?.map((doctor) => (
            <div
              key={doctor.id}
              className="group overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-xl"
            >
              <div className="relative h-32 bg-gradient-to-r from-teal-500 to-cyan-500">
                <div className="absolute -bottom-10 left-6 h-20 w-20 rounded-full bg-white p-1 shadow-md">
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-gray-200 text-xl font-bold text-gray-500">
                    {doctor.name.charAt(4)}
                  </div>
                </div>
              </div>
              <div className="p-6 pt-12">
                <h3 className="text-xl font-bold text-gray-900">
                  {doctor.name}
                </h3>
                <p className="mb-4 font-medium text-teal-600">
                  {doctor.specialization}
                </p>

                <div className="mb-6 flex justify-between text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      ></path>
                    </svg>
                    {doctor.experience}
                  </span>
                  <span className="flex items-center gap-1 font-medium text-yellow-500">
                    ⭐ {doctor.rating}
                  </span>
                </div>

                <div className="mb-6 font-bold text-gray-900">
                  Rp {doctor.fee.toLocaleString("id-ID")}
                </div>

                <button
                  onClick={() => requestMutation.mutate({ doctorId: doctor.id })}
                  disabled={requestMutation.isPending}
                  className="w-full rounded-xl bg-teal-50 py-3 font-semibold text-teal-700 transition-colors group-hover:bg-teal-600 group-hover:text-white disabled:opacity-50"
                >
                  {requestMutation.isPending
                    ? "Booking..."
                    : "Book Consultation"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
