"use client";

import { useState } from "react";
import type { Consulta } from "@/lib/supabase";

export default function AdminTable({ initial }: { initial: Consulta[] }) {
  const [items, setItems] = useState<Consulta[]>(initial);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function toggle(c: Consulta) {
    const nuevoEstado = c.estado === "respondida" ? "nueva" : "respondida";
    setBusyId(c.id);
    try {
      const res = await fetch("/api/admin/consultas", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: c.id, estado: nuevoEstado }),
      });
      if (!res.ok) throw new Error();
      setItems((prev) =>
        prev.map((x) => (x.id === c.id ? { ...x, estado: nuevoEstado } : x))
      );
    } catch {
      alert("No se pudo actualizar el estado. Probá de nuevo.");
    } finally {
      setBusyId(null);
    }
  }

  function fmtFecha(iso: string) {
    const d = new Date(iso);
    return d.toLocaleString("es-UY", {
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

            <div className="ccard-foot">
              <span className="ccard-date">{fmtFecha(c.created_at)}</span>
              <button
                className={`btn-sm${respondida ? "" : " gold"}`}
                onClick={() => toggle(c)}
                disabled={busyId === c.id}
              >
                {busyId === c.id
                  ? "Guardando…"
                  : respondida
                  ? "Marcar como nueva"
                  : "Marcar respondida"}
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
