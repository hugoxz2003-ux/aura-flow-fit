# 🧘 Aura Flow Fit - Sistema Integral de Gestión (CRM + App)

Bienvenido a la solución definitiva para estudios de Pilates y Gimnasios de Lujo. Este ecosistema está diseñado para ofrecer una experiencia "Premium" desde la captación hasta la retención.

## 🚀 Componentes del Sistema

### 1. Landing Page Pro (`/landing_page/`)
- Diseño **Dark Luxury** con acentos **Calypso**.
- Captación de Leads integrada (Webhook n8n listo).
- Galería de servicios con efectos 3D y Glassmorphism.
- Acceso directo para socios y administración.

### 2. CRM Dashboard Administrativo (`/dashboard/`)
- **KPI Real-time**: Ingresos, Socios Activos, Ocupación y Leads.
- **Gestión de Socios**: Registro, Planes, Vencimientos y Métricas físicas.
- **Control de Clases**: Agendamiento, cupos automáticos y lista de espera.
- **Finanzas**: Tracking de pagos y membresías vencidas.
- **Seguridad**: Autenticación integrada con Supabase.

### 3. App Exclusiva para Socios (`/client-app/`)
- **PWA Ready**: Se puede instalar en el móvil como una App nativa.
- **Reservas en 2 Clicks**: Calendario dinámico para agendar clases.
- **Perfil de Evolución**: Visualización de peso, grasa y músculo.
- **Notificaciones**: Alertas de cupos liberados y recordatorios.

---

## 🛠️ Configuración Inicial (IMPORTANTE)

Para que el sistema funcione al 100%, debes realizar los siguientes pasos en tu instancia de **Supabase**:

### Paso 1: Configuración de la Base de Datos
1. Ve a tu **Supabase SQL Editor**.
2. Abre el archivo `FINAL_AURA_PRODUCTION_SETUP.sql` ubicado en la raíz del proyecto.
3. Copia y pega el contenido en el editor de Supabase y dale a **Run**.
   - *Esto creará las tablas, activará la seguridad (RLS) y cargará datos de prueba (incluyendo a la socia de prueba ana@example.com).*

### Paso 2: Variables de Entorno
Asegúrate de que el archivo `supabase-config.js` tenga tu **URL** y **ANON_KEY** correctas.

---

## 🧪 Datos de Prueba (Modo Demo)

Para probar el sistema de inmediato sin configurar Supabase (Modo Offline/Fallback):

- **Login CRM**: Admin / admin123 (en `dashboard/login.html`)
- **Login App Socios**: `ana@example.com` (en `client-app/login.html`)

---

## 🖼️ Recursos Visuales
Las imágenes del sitio han sido generadas específicamente para este proyecto:
- `images/showcase-pilates.jpg`: Interior de estudio premium.
- `images/showcase-gym.jpg`: Gimnasio funcional moderno.
- `images/app-mockup.png`: Mockup de la App de socios.

**© 2026 Aura Flow Fit - Advanced Agentic Coding Delivery**
