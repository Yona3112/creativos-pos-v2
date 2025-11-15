import { trpc } from "@/lib/trpc";

export function useConfiguracion() {
  const { data: configuracion, isLoading, error } = trpc.configuracion.obtener.useQuery();

  return {
    configuracion,
    isLoading,
    error,
  };
}
