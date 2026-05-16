import { useApiQuery } from "./useApiQuery";

export function useDoctors() {
  const result = useApiQuery({
    queryKey: ["doctors"],
    url: "doctors",
  });

  const rawDoctors = result.data?.data ?? [];
  const doctors = rawDoctors.map((doc) => ({
    id: doc.user.id,
    name: doc.user.fullName,
    specialization: doc.specialization.name,
    experience: "Expert", // Fallback if not available
    fee: 100000, // Standard fee
    rating: 4.8,
  }));

  return { ...result, data: doctors };
}
