# Diagnóstico de Problemas en n8n

## 🔍 Checklist de Verificación

Revisa estos puntos en orden:

### 1️⃣ ¿El Workflow está ACTIVO?
- [ ] En n8n, arriba a la derecha, el switch debe estar **VERDE** (Active)
- [ ] Si está gris, actívalo y prueba de nuevo

### 2️⃣ ¿Llegó la petición al Webhook?
- [ ] Ve a n8n → menú izquierdo → **"Executions"**
- [ ] ¿Ves una ejecución nueva cuando envías el formulario?
  - **SÍ** → El webhook funciona, el problema está en Supabase (ve al punto 3)
  - **NO** → El webhook no recibe datos (ve al punto 4)

### 3️⃣ Si el Webhook SÍ recibe datos pero falla Supabase:

#### Error: "relation 'leads' does not exist"
**Solución:**
- Ve a Supabase → Table Editor
- Verifica que la tabla se llame exactamente `leads` (minúsculas)
- Si no existe, créala con:
  - `id` (uuid, primary key)
  - `created_at` (timestamp)
  - `name` (text)
  - `email` (text)
  - `message` (text)

#### Error: "permission denied" o "insufficient privileges"
**Solución:**
- Ve a Supabase → Settings → API
- Copia la llave `service_role` (NO la `anon`)
- En n8n → Credenciales de Supabase → pega esa llave
- Guarda y prueba de nuevo

#### Error: "column 'xyz' does not exist"
**Solución:**
- En el nodo de Supabase en n8n, verifica que los campos estén mapeados así:
  - `name` ← `{{ $json.body.name }}`
  - `email` ← `{{ $json.body.email }}`
  - `message` ← `{{ $json.body.message }}`

### 4️⃣ Si el Webhook NO recibe datos:

#### Opción A: Verificar la URL del Webhook
1. En n8n, abre el nodo **Webhook**
2. Copia la **Production URL** (debería ser `https://auraflowfit.app.n8n.cloud/webhook/...`)
3. Compárala con la URL en el código (línea 129 de `script.js`)
4. Si no coinciden, actualiza el código

#### Opción B: Probar manualmente
1. Abre una terminal o Postman
2. Ejecuta este comando (reemplaza con tu URL real):
```bash
curl -X POST https://auraflowfit.app.n8n.cloud/webhook/6539874a-c7e6-4e03-a964-0a5de374fdf5 \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","message":"Prueba manual"}'
```
3. Si esto funciona, el problema está en el formulario web
4. Si esto NO funciona, el problema está en n8n

### 5️⃣ Verificar el Formulario Web

Abre la consola del navegador (F12) y busca errores:

#### Error: "Failed to fetch" o "NetworkError"
- El workflow no está activo
- La URL del webhook es incorrecta
- Hay un problema de red/firewall

#### Error: "CORS policy"
- Esto NO debería pasar en GitHub Pages
- Si lo ves, asegúrate de estar usando `https://hugoxz2003-ux.github.io/...` (no `file://`)

---

## 🎯 Configuración Correcta Paso a Paso

### En n8n:

**Nodo 1: Webhook**
- Trigger: Webhook
- HTTP Method: POST
- Path: (lo que quieras, ej: `aura-lead`)
- Response Mode: "Respond Immediately"
- Response Code: 200

**Nodo 2: Supabase**
- Resource: Database
- Operation: Insert
- Table: `leads`
- Columns:
  - name: `{{ $json.body.name }}`
  - email: `{{ $json.body.email }}`
  - message: `{{ $json.body.message }}`

**Conexión:**
- Webhook → Supabase (conectados con una línea)

**Credenciales Supabase:**
- Host: `https://TU-PROYECTO.supabase.co` (sin `/` al final)
- Service Key: La llave `service_role` de Supabase → Settings → API

---

## 📊 Cómo Leer los Errores en n8n

Cuando falla una ejecución:
1. Click en la ejecución fallida
2. Click en el nodo con el ícono rojo ❌
3. Lee el mensaje de error
4. Busca ese error en esta guía

---

## 🆘 Si Nada Funciona

Prueba este workflow mínimo:

1. Crea un nuevo workflow
2. Agrega solo el nodo **Webhook**
3. Actívalo
4. Copia la URL de producción
5. Envía el formulario
6. Si ves la ejecución en "Executions", el webhook funciona
7. Luego agrega Supabase paso a paso

---

## 💡 Tip: Debugging con Email

Para saber qué datos están llegando:
1. Agrega un nodo **Gmail** o **Send Email** después del Webhook
2. En el asunto pon: `Nuevo lead: {{ $json.body.name }}`
3. En el cuerpo pon: `{{ JSON.stringify($json) }}`
4. Así recibirás un email con TODOS los datos que llegan

---

## ❓ Preguntas Frecuentes

**P: ¿Cómo sé si el formulario se envió?**
R: El botón debe decir "¡Enviado con Éxito!" y ponerse verde.

**P: ¿Puedo ver los datos sin Supabase?**
R: Sí, en n8n → Executions → click en la ejecución → verás el JSON completo.

**P: ¿Qué pasa si cambio la URL del webhook?**
R: Debes actualizar `script.js` en GitHub con la nueva URL.

**P: ¿Cuánto tarda en llegar a Supabase?**
R: Instantáneo (menos de 1 segundo).
