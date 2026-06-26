import { NextResponse } from "next/server";
import { isAuthed } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

export async function PATCH(req: Request) {
  if (!isAuthed()) {
    return NextResponse.json({ error: "No autorizado." }, { status: 401 });
  }

  let id = "";
  let estado = "";
  try {
    const body = await req.json();
    id = String(body.id || "");
    estado = String(body.estado || "");
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  if (!id || (estado !== "nueva" && estado !== "respondida")) {
    return NextResponse.json({ error: "Datos inválidos." }, { status: 400 });
  }

  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("consultas")
    .update({ estado })
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { error: "No se pudo actualizar." },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
