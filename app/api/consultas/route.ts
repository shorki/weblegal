import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase";

export const runtime = "nodejs";

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Solicitud inválida." },
      { status: 400 }
    );
  }

  const nombre = String(body.nombre || "").trim();
  const email = String(body.email || "").trim();
  const telefono = String(body.telefono || "").trim();
  const area = String(body.area || "").trim();
  const mensaje = String(body.mensaje || "").trim();
  const acepto = body.acepto === true;

  // Validación
  if (!nombre || !email || !mensaje) {
    return NextResponse.json(
      { error: "Completá nombre, email y mensaje." },
      { status: 400 }
    );
  }
  if (!isEmail(email)) {
    return NextResponse.json(
      { error: "El email no parece válido." },
      { status: 400 }
    );
  }
  if (!acepto) {
    return NextResponse.json(
      { error: "Tenés que aceptar la política de privacidad." },
      { status: 400 }
    );
  }
  if (nombre.length > 120 || mensaje.length > 5000) {
    return NextResponse.json(
      { error: "Algún campo es demasiado largo." },
      { status: 400 }
    );
  }

  // Guardar en Supabase
  let supabase;
  try {
    supabase = getSupabaseAdmin();
  } catch {
    return NextResponse.json(
      { error: "El servidor no está configurado todavía. Probá más tarde." },
      { status: 500 }
    );
  }

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || null;
  const userAgent = req.headers.get("user-agent") || null;

  const { data, error } = await supabase
    .from("consultas")
    .insert({
      nombre,
      email,
      telefono: telefono || null,
      area: area || null,
      mensaje,
      ip,
      user_agent: userAgent,
    })
    .select("id")
    .single();

  if (error) {
    console.error("Error guardando consulta:", error.message);
    return NextResponse.json(
      { error: "No se pudo registrar la consulta. Probá de nuevo." },
      { status: 500 }
    );
  }

  // Aviso por email (best-effort: si falla, la consulta ya quedó guardada)
  await notificarPorEmail({ nombre, email, telefono, area, mensaje }).catch(
    (e) => console.error("Error enviando email de aviso:", e)
  );

  return NextResponse.json({ ok: true, id: data?.id });
}

async function notificarPorEmail(c: {
  nombre: string;
  email: string;
  telefono: string;
  area: string;
  mensaje: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL_TO;
  const from =
    process.env.NOTIFY_EMAIL_FROM || "Estudio C&V <onboarding@resend.dev>";

  if (!apiKey || !to) return; // email opcional: si no está configurado, se omite

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#1a1a1a;line-height:1.6">
      <h2 style="color:#1a2841;margin:0 0 16px">Nueva consulta desde la web</h2>
      <p><strong>Nombre:</strong> ${esc(c.nombre)}</p>
      <p><strong>Email:</strong> ${esc(c.email)}</p>
      <p><strong>Teléfono:</strong> ${esc(c.telefono) || "—"}</p>
      <p><strong>Área:</strong> ${esc(c.area) || "—"}</p>
      <p><strong>Mensaje:</strong></p>
      <p style="background:#f3ecdf;border-left:3px solid #b8915a;padding:12px 16px;white-space:pre-wrap">${esc(
        c.mensaje
      )}</p>
    </div>`;

  await resend.emails.send({
    from,
    to: to.split(",").map((x) => x.trim()),
    replyTo: c.email,
    subject: `Nueva consulta: ${c.nombre}${c.area ? " · " + c.area : ""}`,
    html,
  });
}
