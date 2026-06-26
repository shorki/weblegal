import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

/**
 * Cliente de Supabase con la clave service_role.
 * SOLO debe usarse en el servidor (route handlers / server components).
 * Bypassea RLS, por eso nunca se expone al navegador.
 */
export function getSupabaseAdmin(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRole) {
    throw new Error(
      "Faltan variables de entorno: NEXT_PUBLIC_SUPABASE_URL y/o SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  cached = createClient(url, serviceRole, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}

export type Consulta = {
  id: string;
  created_at: string;
  nombre: string;
  email: string;
  telefono: string | null;
  area: string | null;
  mensaje: string;
  estado: "nueva" | "respondida";
};
