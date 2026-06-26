"use client";

import { useState } from "react";
import type { Consulta } from "@/lib/supabase";

export default function AdminTable({ initial }: { initial: Consulta[] }) {
  const [items, setItems] = useState<Consulta[]>(initial);
  const [drafts, setDrafts] = useState<Record<string, string>>(() =>
    Object.fromEntries(initial.map((c) => [c.id, c.respuesta ?? ""]))
  );
  const [busyId, setBusyId] = useState<string | null>(null);

  function patch(item: Consulta) {
    setItems((prev) =>
      prev.map((x) => (x.id === item.id ? item : x))
    );
  }

  async function guardarRespuesta(c: Consulta) {
    setBusyId(c.id);
    try {
      const res = await fetch("/api/admin/consultas", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: c.id, respuesta: drafts[c.id] ?? "" }),
      });
      if (!res.ok) throw new Error();
      const { consulta } = await res.json();
      patch({
        ...c,
        respuesta: consulta.respuesta,
        respondida_at: consulta.respondida_at,
        estado: consulta.estado,
      });
      setDrafts((d) => ({ ...d, [c.id]: consulta.respuesta ?? "" }));
    } catch {
      alert("No se pudo guardar la respuesta. Probá de nuevo.");
    } finally {
      setBusyId(null);
    }
  }

  async function reabrir(c: Consulta) {
    setBusyId(c.id);
    try {
      const res = await fetch("/api/admin/consultas", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: c.id, estado: "nueva" }),
      });
      if (!res.ok) throw new Error();
      patch({ ...c, estado: "nueva" });
    } catch {
      alert("No se pudo actualizar. Probá de nuevo.");
    } finally {
      setBusyId(null);
    }
  }

  function fmtFecha(iso: string | null) {
    if (!iso) return "";
    return new Date(iso).toLocaleString("es-UY", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="cards">
      {items.map((c) => {
        const respondida = c.estado === "respondida";
        const draft = drafts[c.id] ?? "";
        const busy = busyId === c.id;
        const sinCambios = draft === (c.respuesta ?? "");

        return (
          <article
            key={c.id}
            className={`ccard${respondida ? " respondida" : ""}`}
          >
            <div className="ccard-top">
              <div>
                <div className="ccard-name">{c.nombre}</div>
                {c.area && <div className="ccard-area">{c.area}</div>}
              </div>
              <span className={`badge ${respondida ? "respondida" : "nueva"}`}>
                {respondida ? "Respondida" : "Nueva"}
              </span>
            </div>

            <div className="ccard-meta">
              <a href={`mailto:${c.email}`}>{c.email}</a>
              {c.telefono && (
                <a href={`tel:${c.telefono.replace(/\s/g, "")}`}>
                  {c.telefono}
                </a>
              )}
            </div>

            <div className="ccard-msg">{c.mensaje}</div>

            {/* Respuesta */}
            <div className="ccard-resp">
              <span className="resp-label">Respuesta del estudio</span>
              <textarea
                value={draft}
                onChange={(e) =>
                  setDrafts((d) => ({ ...d, [c.id]: e.target.value }))
                }
                placeholder="Escribí acá la respuesta para esta consulta…"
                disabled={busy}
              />
              <div className="ccard-resp-actions">
                <button
                  className="btn-sm gold"
                  onClick={() => guardarRespuesta(c)}
                  disabled={busy || sinCambios}
                >
                  {busy ? "Guardando…" : "Guardar respuesta"}
                </button>
                {c.respondida_at && (
                  <span className="resp-saved">
                    Respondida el {fmtFecha(c.respondida_at)}
                  </span>
                )}
              </div>
            </div>

            <div className="ccard-foot">
              <span className="ccard-date">
                Recibida el {fmtFecha(c.created_at)}
              </span>
              {respondida && (
                <button
                  className="btn-sm"
                  onClick={() => reabrir(c)}
                  disabled={busy}
                >
                  Reabrir
                </button>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}
