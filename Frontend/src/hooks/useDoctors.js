import { useApiQuery } from "./useApiQuery";

function mapDoctor(doc) {
  return {
    id: doc.user?.id ?? doc.id,
    name: doc.user?.fullName ?? doc.name,
    specialization: doc.specialization?.name ?? doc.specialization,
    experience: doc.experience ?? "Expert",
    fee: doc.fee ?? 100000,
    rating: doc.rating ?? 4.8,
    bio: doc.bio ?? null,
  };
}

export function useDoctors() {
  const result = useApiQuery({
    queryKey: ["doctors"],
    url: "doctors",
  });

  const rawDoctors = result.data?.data ?? [];
  const doctors = rawDoctors.map(mapDoctor);

  return { ...result, data: doctors };
}

export function useDoctorById(id) {
  const result = useApiQuery({
    queryKey: ["doctors", id],
    url: `doctors/${id}`,
    enabled: !!id,
  });

  const raw = result.data?.data ?? result.data;
  const doctor = raw ? mapDoctor(raw) : null;

  return { ...result, data: doctor };
}
