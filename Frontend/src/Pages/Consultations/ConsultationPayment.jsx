import { useState } from "react";
import { useMidtrans } from "../../hooks/useMidtrans";
import { apiFetch } from "../../lib/apiClient";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";

export default function ConsultationPayment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isLoaded, pay } = useMidtrans();

  // Fetch consultation details
  const { data: consultation, isLoading } = useQuery({
    queryKey: ["consultation", id],
    queryFn: async () => {
      const res = await apiFetch(`/api/v1/consultations/${id}`);
      return res;
    },
  });

  const paymentMutation = useMutation({
    mutationFn: async () => {
      const res = await apiFetch(`/api/v1/consultations/${id}/payment`, {
        method: "POST",
      });
      return res;
    },
    onSuccess: (res) => {
      if (res.data.midtransToken) {
        pay(
          res.data.midtransToken,
          (result) => {
            console.log("Success:", result);
            alert("Payment successful!");
            navigate("/consultations/success");
          },
          (result) => {
            console.log("Pending:", result);
            alert("Payment pending. Please complete it.");
          },
          (result) => {
            console.log("Error:", result);
            alert("Payment failed.");
          },
          () => {
            console.log("Closed popup without finishing payment");
          },
        );
      }
    },
    onError: (err) => {
      console.error("Payment API Error", err);
      alert("Failed to initiate payment.");
    },
  });

  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Loading payment details...
      </div>
    );
  }

  const consData = consultation?.data || consultation;

  return (
    <div className="mx-auto mt-10 max-w-2xl rounded-xl bg-white p-6 shadow-lg">
      <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
        Consultation Payment
      </h1>

      <div className="mb-6 rounded-lg border border-gray-100 bg-gray-50 p-6">
        <h2 className="mb-4 border-b pb-2 text-lg font-semibold text-gray-700">
          Order Summary
        </h2>
        <div className="mb-2 flex justify-between">
          <span className="text-gray-600">Consultation ID</span>
          <span className="font-medium text-gray-800">CONS-{consData.id}</span>
        </div>
        <div className="mb-2 flex justify-between">
          <span className="text-gray-600">Status</span>
          <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800">
            {consData.status}
          </span>
        </div>
        <div className="mb-4 flex justify-between">
          <span className="text-gray-600">Payment Status</span>
          <span className="rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800">
            {consData.paymentStatus}
          </span>
        </div>
        <div className="flex items-center justify-between border-t pt-4">
          <span className="text-lg font-bold text-gray-800">Total Amount</span>
          <span className="text-2xl font-bold text-teal-600">
            Rp {consData.fee?.toLocaleString("id-ID")}
          </span>
        </div>
      </div>

      <button
        onClick={() => paymentMutation.mutate()}
        disabled={
          !isLoaded ||
          paymentMutation.isPending ||
          consData.paymentStatus === "PAID"
        }
        className="w-full rounded-lg bg-teal-600 py-4 text-lg font-bold text-white shadow-md transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {paymentMutation.isPending
          ? "Processing..."
          : consData.paymentStatus === "PAID"
            ? "Already Paid"
            : "Pay with Midtrans"}
      </button>

      <p className="mt-4 text-center text-sm text-gray-500">
        Secure payment powered by Midtrans
      </p>
    </div>
  );
}
