import { Link } from "react-router-dom";

export default function ConsultationSuccess() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center p-6 text-center">
      <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-green-600">
        <svg
          className="h-12 w-12"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="3"
            d="M5 13l4 4L19 7"
          ></path>
        </svg>
      </div>

      <h1 className="mb-4 text-4xl font-extrabold text-gray-900">
        Payment Successful!
      </h1>
      <p className="mb-8 max-w-md text-lg text-gray-600">
        Your payment has been successfully processed. The doctor will join the
        consultation room shortly.
      </p>

      <div className="flex gap-4">
        <Link
          to="/consultations"
          className="rounded-xl border-2 border-teal-600 bg-white px-6 py-3 font-bold text-teal-600 transition-colors hover:bg-teal-50"
        >
          Back to Doctors
        </Link>
        <Link
          to="/"
          className="rounded-xl bg-teal-600 px-6 py-3 font-bold text-white shadow-md transition-colors hover:bg-teal-700 hover:shadow-lg"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
