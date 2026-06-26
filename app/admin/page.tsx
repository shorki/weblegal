import { redirect } from "next/navigation";
import { isAuthed } from "@/lib/auth";
import { getSupabaseAdmin, type Consulta } from "@/lib/supabase";
import AdminTable from "./AdminTable";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!isAuthed()) {
    redirect("/admin/login");
  }

  let consultas: Consulta[] = [];
  let loadError = "";

  try {
    const supabase = getSupabaseAdmin();
    const { data, error } = await supabase
      .from("consultas")
      .select(
        "id, created_at, nombre, email, telefono, area, mensaje, estado, respuesta, respondida_at"
      )
      .order("created_at", { ascending: false })
      .limit(500);
    if (error) throw error;
    consultas = (data as Consulta[]) || [];
  } catch (e) {
    loadError =
      e instanceof Error
        ? e.message
        : "No se pudieron cargar las consultas. Revisá la configuración de Supabase.";
  }

  const nuevas = consultas.filter((c) => c.estado !== "respondida").length;

  return (
    <div className="admin-wrap">
      <div className="admin-head">
        <div>
          <h1>Consultas recibidas</h1>
          <div className="admin-sub">
            {consultas.length} en total · {nuevas} sin responder
          </div>
        </div>
        <div className="admin-actions">
          <a className="btn-sm" href="/" target="_blank" rel="noreferrer">
            Ver web
          </a>
          <form action="/api/admin/logout" method="post">
            <button className="btn-sm" type="submit">
              Salir
            </button>
          </form>
        </div>
      </div>

      {loadError ? (
        <div className="form-msg err">{loadError}</div>
      ) : consultas.length === 0 ? (
        <div className="empty">Todavía no llegaron consultas.</div>
      ) : (
        <AdminTable initial={consultas} />
      )}
    </div>
  );
}
