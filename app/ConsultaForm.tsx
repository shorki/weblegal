"use client";

import { useState, type FormEvent } from "react";

export const AREAS = [
  "Derecho de Familia (Divorcios, Alimentos, Sucesiones)",
  "Derecho Civil / Contratos / Arrendamientos",
  "Amparos",
  "Derecho Laboral (Trabajadores / Empresas)",
  "Otro / no estoy seguro",
];

type Status = "idle" | "sending" | "ok" | "error";

export default function ConsultaForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      nombre: String(data.get("nombre") || "").trim(),
      email: String(data.get("email") || "").trim(),
      telefono: String(data.get("telefono") || "").trim(),
      area: String(data.get("area") || "").trim(),
      mensaje: String(data.get("mensaje") || "").trim(),
      acepto: data.get("acepto") === "on",
    };

    setStatus("sending");
    setErrorMsg("");

    try {
      const res = await fetch("/api/consultas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "No se pudo enviar la consulta.");
      }

      setStatus("ok");
      form.reset();
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Ocurrió un error. Probá de nuevo en unos minutos."
      );
    }
  }

  if (status === "ok") {
    return (
      <div className="form">
        <div className="form-msg ok" role="status">
          <strong>¡Gracias por tu consulta!</strong>
          <br />
          La recibimos correctamente y te vamos a responder dentro de las 24
          horas hábiles. Si es urgente, podés escribirnos por WhatsApp al +598 99
          502 866.
        </div>
        <div className="form-actions">
          <button
            type="button"
            className="btn"
            onClick={() => setStatus("idle")}
          >
            Enviar otra consulta
          </button>
        </div>
      </div>
    );
  }

  const sending = status === "sending";

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <div className="row">
        <div className="field">
          <label htmlFor="nombre">Nombre</label>
          <input
            id="nombre"
            name="nombre"
            type="text"
            required
            placeholder="Juan Pérez"
            disabled={sending}
          />
        </div>
        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="juan@email.com"
            disabled={sending}
          />
        </div>
      </div>

      <div className="row">
        <div className="field">
          <label htmlFor="telefono">Teléfono</label>
          <input
            id="telefono"
            name="telefono"
            type="tel"
            placeholder="099 123 456"
            disabled={sending}
          />
        </div>
        <div className="field">
          <label htmlFor="area">Área</label>
          <select id="area" name="area" required disabled={sending} defaultValue="">
            <option value="" disabled>
              Seleccioná un área
            </option>
            {AREAS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="field">
        <label htmlFor="mensaje">Mensaje</label>
        <textarea
          id="mensaje"
          name="mensaje"
          required
          placeholder="Contanos brevemente tu caso."
          disabled={sending}
        />
      </div>

      <label className="checkbox">
        <input type="checkbox" name="acepto" required disabled={sending} />
        <span>
          Acepto que mis datos sean tratados conforme a la{" "}
          <a href="#contacto">política de privacidad</a> y a la Ley 18.331 de
          Protección de Datos Personales.
        </span>
      </label>

      {status === "error" && (
        <div className="form-msg err" role="alert">
          {errorMsg}
        </div>
      )}

      <div className="form-actions">
        <button type="submit" className="btn btn-solid" disabled={sending}>
          {sending ? "Enviando…" : "Enviar"}
        </button>
      </div>
    </form>
  );
}
