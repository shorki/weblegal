# C & V Estudio Jurídico — Web

Sitio del estudio (landing + formulario de consultas) construido con **Next.js (App Router)**.
Las consultas del formulario se guardan en **Supabase**, llega un **email de aviso** a las abogadas
(opcional, vía Resend) y hay un **panel de administración** en `/admin` para verlas y gestionarlas.

Diseño: variante **Opción 4 — mínima · litis clara** (reproducida íntegramente en `app/`).

---

## 1. Estructura

```
app/
  page.tsx                  La web (diseño Opción 4 + textos del cliente)
  ConsultaForm.tsx          Formulario (cliente) → POST /api/consultas
  globals.css               Todos los estilos
  layout.tsx                Fuentes + metadatos
  api/consultas/route.ts    Recibe la consulta, valida, guarda en Supabase, envía email
  admin/
    page.tsx                Panel: lista de consultas (protegido)
    AdminTable.tsx          Tarjetas + botón "marcar respondida"
    login/page.tsx          Login del panel
  api/admin/
    login/route.ts          Inicia sesión (cookie)
    logout/route.ts         Cierra sesión
    consultas/route.ts      Cambia el estado de una consulta
lib/
  supabase.ts               Cliente de Supabase (service_role, solo servidor)
  auth.ts                   Sesión del panel admin
supabase/schema.sql         Tabla `consultas` para crear en Supabase
```

---

## 2. Correr en local

Requisitos: **Node.js 18.18+** (recomendado 20+).

```bash
npm install
cp .env.example .env.local   # y completá los valores (ver abajo)
npm run dev
```

- Web: http://localhost:3000
- Panel: http://localhost:3000/admin

---

## 3. Configurar Supabase

1. Creá un proyecto en https://supabase.com
2. **SQL Editor → New query**, pegá el contenido de [`supabase/schema.sql`](supabase/schema.sql) y **Run**.
3. **Project Settings → API**, copiá a tu `.env.local`:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `service_role` (clave secreta) → `SUPABASE_SERVICE_ROLE_KEY`

> La `service_role` es secreta y solo se usa en el servidor. Nunca la pongas en código del cliente.

---

## 4. Variables de entorno

Ver [`.env.example`](.env.example). Resumen:

| Variable | ¿Obligatoria? | Para qué |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Sí | URL del proyecto Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Sí | Guardar/leer consultas (servidor) |
| `ADMIN_PASSWORD` | Sí | Contraseña para entrar a `/admin` |
| `ADMIN_SESSION_SECRET` | Sí | Texto aleatorio largo para firmar la sesión |
| `RESEND_API_KEY` | No | Enviar email de aviso (Resend) |
| `NOTIFY_EMAIL_TO` | No | A qué email(s) llega el aviso |
| `NOTIFY_EMAIL_FROM` | No | Remitente verificado en Resend |

Si no configurás las de email, la consulta **igual se guarda**; solo no se manda el aviso.

---

## 5. Email de aviso (opcional)

1. Creá una cuenta en https://resend.com y una **API Key** → `RESEND_API_KEY`.
2. Poní en `NOTIFY_EMAIL_TO` el/los email(s) de las abogadas (separados por coma).
3. Para producción, verificá un dominio en Resend y usá un `NOTIFY_EMAIL_FROM` de ese dominio.
   (Para probar podés usar el remitente por defecto `onboarding@resend.dev`.)

---

## 6. Desplegar en Vercel

1. Subí el repo a GitHub.
2. En https://vercel.com → **Add New → Project** → importá el repo.
3. En **Settings → Environment Variables** cargá las mismas variables del `.env.local`.
4. **Deploy**.

Cada `git push` a la rama principal vuelve a desplegar.

---

## 7. Panel de administración

- Entrá a `/admin`, ingresá `ADMIN_PASSWORD`.
- Ves todas las consultas (más nuevas primero), con email/teléfono clickeables.
- Botón **"Marcar respondida"** para llevar el control de cuáles ya atendiste.

---

## Pendientes / a definir con el cliente

- **Email de contacto real:** hoy figura el de ejemplo `consultas@estudio.com.uy` (en la web y en el `mailto:`). Falta el definitivo.
- **Página de privacidad:** los links "política de privacidad" apuntan por ahora a la sección de contacto. Falta el texto legal real (Ley 18.331).
- **Logo / redes / fotos:** no se incluyeron (no venían en el contenido).
