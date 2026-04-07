# Solución: Error "Window Buffer Memory" en n8n

## 🔴 El Problema
El nodo Webhook en n8n tiene una configuración de "buffer" que puede causar este error.

## ✅ Solución (2 minutos)

### Paso 1: Configurar el Webhook correctamente
1. En n8n, abre tu workflow
2. Haz doble click en el nodo **Webhook**
3. Busca la sección **"Options"** o **"Settings"**
4. Encuentra **"Response Mode"**
5. Cámbialo a: **"When Last Node Finishes"** (o "Respond When Workflow Finishes")
6. Guarda el nodo

### Paso 2: Alternativa si no funciona
Si el error persiste:

1. En el nodo Webhook, ve a **"Options"**
2. Busca **"Binary Data"** o **"Buffer"**
3. Desactiva cualquier opción de buffer
4. Guarda

### Paso 3: Configuración Recomendada del Webhook

**Configuración básica:**
- HTTP Method: `POST`
- Path: `aura-lead` (o el que prefieras)
- Authentication: `None`

**Opciones avanzadas:**
- Response Mode: `When Last Node Finishes`
- Response Code: `200`
- Response Data: `First Entry JSON`

### Paso 4: Verificar el Flujo

Tu workflow debe verse así:

```
[Webhook] → [Supabase]
```

**IMPORTANTE:** Asegúrate de que:
- Los nodos estén conectados con una línea
- El workflow esté ACTIVO (switch verde)
- No haya nodos intermedios innecesarios

---

## 🔧 Configuración Alternativa (Si aún falla)

Prueba esta configuración más simple:

### Webhook Node:
```
HTTP Method: POST
Path: lead-capture
Response Mode: Immediately
Response Code: 200
Response Body: {"status": "ok"}
```

### Supabase Node:
```
Operation: Insert
Table: leads
Columns:
  - name: {{ $json.body.name }}
  - email: {{ $json.body.email }}
  - message: {{ $json.body.message }}
```

---

## 🆘 Si Nada Funciona: Usar HTTP Request

Como última opción, usa el método directo de Supabase:

1. **Elimina el nodo de Supabase**
2. **Agrega un nodo "HTTP Request"**
3. Configúralo así:

```
Method: POST
URL: https://TU-PROYECTO.supabase.co/rest/v1/leads
Authentication: Generic Credential Type
  - Header Auth
  - Name: apikey
  - Value: TU_SERVICE_ROLE_KEY

Headers:
  - Name: Authorization
  - Value: Bearer TU_SERVICE_ROLE_KEY
  - Name: Content-Type
  - Value: application/json

Body:
{
  "name": "{{ $json.body.name }}",
  "email": "{{ $json.body.email }}",
  "message": "{{ $json.body.message }}"
}
```

---

## 📊 Verificar que Funciona

1. Activa el workflow
2. Envía el formulario desde tu web
3. Ve a n8n → Executions
4. Deberías ver una ejecución exitosa ✅ (verde)
5. Ve a Supabase → Table Editor → `leads`
6. Deberías ver la nueva fila

---

## 💡 Tip: Debugging

Si quieres ver exactamente qué datos llegan:

1. Agrega un nodo **"Code"** entre Webhook y Supabase
2. Pon este código:
```javascript
console.log('Datos recibidos:', $input.all());
return $input.all();
```
3. Ejecuta y revisa los logs
