import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

export async function PATCH(req: Request) {
  if (!isAuthed()) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const id = String(body.id || "");
  if (!id) {
    return NextResponse.json({ error: "Falta el id." }, { status: 400 });
  }

  const update: Record<string, unknown> = {};

  // Guardar / editar la respuesta escrita desde el panel
  if (typeof body.respuesta === "string") {
    const respuesta = body.respuesta;
    const trimmed = respuesta.trim();
    if (trimmed.length > 10000) {
      return NextResponse.json(
        { error: "La respuesta es demasiado larga." },
        { status: 400 }
      );
    }
    update.respuesta = trimmed ? respuesta : null;
    update.respondida_at = trimmed ? new Date().toISOString() : null;
    if (trimmed) update.estado = "respondida";
  }

  // Cambiar el estado manualmente (marcar respondida / reabrir)
  if (body.estado === "nueva" || body.estado === "respondida") {
    update.estado = body.estado;
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json(
      { error: "Nada para actualizar." },
      { status: 400 }
    );
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("consultas")
    .update(update)
    .eq("id", id)
    .select("id, estado, respuesta, respondida_at")
    .single();

  if (error) {
    return NextResponse.json(
      { error: "No se pudo actualizar." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, consulta: data });
}
