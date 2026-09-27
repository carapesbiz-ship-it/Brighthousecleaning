# Bright House — Vista previa y lanzamiento

Guía paso a paso para publicar una vista previa privada en Netlify, probar el formulario, enviarla a Cindy para aprobación y, después, lanzar con el dominio oficial.

> **Protección contra indexación (automática).** El sitio solo se puede indexar cuando Netlify construye el contexto de producción **y** la URL principal es `https://brighthousecleaning.ca` (o `www.`). En cualquier otro caso —Deploy Preview, branch deploy, producción en `*.netlify.app`, builds locales— cada página lleva la etiqueta `noindex, nofollow`, se envía el encabezado `X-Robots-Tag: noindex, nofollow` y `robots.txt` bloquea todo. La lógica está en `src/data/indexing.mjs`.

---

## 1. Crear la vista previa en Netlify (sin dominio, sin merge)

El repositorio solo tiene la rama `claude/bright-house-website-d30pgc`. Un *Deploy Preview* de Netlify necesita un pull request hacia una rama de producción, que todavía no existe. Lo equivalente —y más simple— es desplegar esta rama en una dirección `*.netlify.app`, que queda automáticamente fuera de Google.

1. Entra a <https://app.netlify.com> → **Add new project** → **Import an existing project** → **GitHub**.
2. Autoriza Netlify y elige `carapesbiz-ship-it/Brighthousecleaning`.
3. **Branch to deploy:** `claude/bright-house-website-d30pgc`.
   Los ajustes de build se leen de `netlify.toml` (`npm run build`, carpeta `dist`, Node 22). No hace falta cambiarlos.
4. **Deploy.** Al terminar, en **Project configuration → General → Project details → Change project name** ponle un nombre claro, por ejemplo `brighthouse-preview`. El enlace quedará así: `https://brighthouse-preview.netlify.app`.
5. **No agregues ningún dominio todavía.**

### Verificar que no se indexa

- `https://brighthouse-preview.netlify.app/robots.txt` debe mostrar `Disallow: /`.
- En el navegador: clic derecho → *Ver código fuente* → debe aparecer `<meta name="robots" content="noindex, nofollow">`.
- Opcional, en una terminal: `curl -I https://brighthouse-preview.netlify.app/` debe incluir `x-robots-tag: noindex, nofollow`.

## 2. Activar los formularios y probar un envío real

1. **Project configuration → Forms → Enable form detection.** En proyectos nuevos viene desactivado.
2. **Deploys → Trigger deploy → Deploy project.** Hace falta un deploy nuevo para que Netlify detecte el formulario.
3. En **Forms** debe aparecer el formulario **`quote`**.
4. Abre la vista previa y envía un pedido de prueba, por ejemplo:
   - Nombre: `PRUEBA – no responder`
   - Método: WhatsApp, con tu teléfono
   - Servicio: Regular Cleaning · Ciudad: Vancouver · marca el consentimiento
5. Debe abrirse la página **/thank-you/**.
6. En Netlify: **Forms → quote** → el envío debe aparecer con todos los campos. Si no aparece, revisa **Spam submissions** y márcalo como *Not spam*.
7. Repite una vez con el método **Email** (sin teléfono) para confirmar ese camino.

## 3. Notificación por email

1. **Project configuration → Notifications → Emails and webhooks → Form submission notifications → Add notification → Email notification.**
2. **Event to listen for:** *New form submission* · **Form:** `quote` · **Email to notify:** `brighthouse.csc@gmail.com` (puedes agregar otra notificación con tu propio correo mientras hacen pruebas).
3. Envía otro pedido de prueba y confirma que llega. El remitente es de Netlify (`formresponses@netlify.com`). Si no llega, revisa **Spam** en Gmail y marca "No es spam".
4. Recomendación: en Gmail de Cindy, crea un filtro para que esos mensajes nunca vayan a spam y tengan una etiqueta, por ejemplo "Cotizaciones web".

## 4. Aprobación de Cindy

Envíale el enlace `https://brighthouse-preview.netlify.app`, pídele que lo revise en el celular y la computadora, y confirma también:

- [ ] Textos, precios y servicios correctos
- [ ] Puede mostrarse la foto de la oficina (con sus frases de pared) en Commercial Cleaning
- [ ] Tiene autorización de los propietarios para las fotos (si la tiene, se puede volver a mostrar "Photos shared with permission.")
- [ ] Recibió el email de prueba del formulario
- [ ] Opcional: foto real de Cindy para "Meet Cindy" y una foto horizontal nueva para el hero

Los cambios que pida se hacen en la misma rama; Netlify vuelve a publicar la vista previa automáticamente.

## 5. Comprar el dominio (cuenta de Cindy)

- Cindy crea la cuenta del registrador **a su nombre y con su email** (por ejemplo Cloudflare Registrar, Namecheap u otro registrador certificado por CIRA). Así el dominio siempre es de ella.
- Los dominios `.ca` exigen presencia en Canadá (Canadian Presence Requirements); Cindy como residente o negocio canadiense cumple.
- Activa **renovación automática** y protección de privacidad (CIRA la aplica por defecto a personas).
- Ideal: que el proyecto de Netlify y el repositorio de GitHub también queden en cuentas de Cindy, o que ella sea propietaria del equipo de Netlify.

## 6. Lanzamiento oficial

1. **Rama de producción:** crea `main` a partir del commit aprobado (este es el "merge") y en **Project configuration → Build & deploy → Branches and deploy contexts** cambia la rama de producción a `main`.
2. **Dominio:** **Domain management → Add a domain** → `brighthousecleaning.ca`. Sigue las instrucciones que muestra Netlify: o cambiar los *nameservers* a Netlify DNS, o crear en el registrador los registros que Netlify indique (normalmente un registro `A` para el dominio raíz y un `CNAME` para `www`). Usa exactamente los valores que aparezcan en Netlify.
3. Marca `brighthousecleaning.ca` como **Primary domain** y espera el certificado HTTPS automático.
4. **Importante:** haz un deploy nuevo de producción (**Deploys → Trigger deploy**). La protección contra indexación se evalúa al construir; solo un build hecho con el dominio oficial como principal activa la indexación.
5. Verifica:
   - `https://brighthousecleaning.ca/robots.txt` muestra `Allow: /` y la línea `Sitemap:`.
   - El código fuente de la página principal ya **no** tiene `noindex`.
   - El formulario envía, aparece en Netlify y llega el email.
6. **Después del lanzamiento:** verificar el dominio en Google Search Console y enviar `https://brighthousecleaning.ca/sitemap.xml`; crear o actualizar el Perfil de Empresa de Google como negocio de área de servicio (sin mostrar dirección) y enlazar el sitio.
