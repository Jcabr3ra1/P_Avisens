# AVISENS — Documento Maestro del Proyecto
## Sistema de Gestión Avícola Inteligente | SaaS B2B

**Versión:** 1.0  
**Fecha:** 15 de Abril, 2026  
**Estado:** Pre-desarrollo — Listo para iniciar construcción

---

## CONTEXTO GENERAL

### ¿Qué es AVISENS?

AVISENS es una **plataforma SaaS de gestión avícola inteligente** diseñada para monitorear, automatizar y optimizar la operación de granjas de pollos de engorde (broilers). El sistema permite visualizar el estado de cada galpón en tiempo real, gestionar alertas, controlar equipos de automatización, llevar inventario de insumos, registrar mantenimiento de equipos y administrar usuarios con roles diferenciados.

**Modelo de negocio:** AVISENS opera como empresa que ofrece el servicio a múltiples granjas (multi-tenant). Cada granja es un cliente que paga suscripción mensual. AVISENS tiene acceso administrativo total a todas las granjas que gestiona.

### ¿Qué existe hoy?

Existe un **prototipo visual diseñado en Figma** que fue exportado como componentes React/TypeScript. Son archivos de referencia que sirven como guía de diseño, pero **NO son un proyecto funcional**. No hay `package.json`, no hay Vite configurado, no hay backend, no hay base de datos. El proyecto real se construye **desde cero**.

Los archivos de Figma incluyen:
- 23 componentes React (.tsx) con la UI completa de 8 módulos
- 48 componentes base de shadcn/ui
- Design tokens (colores, espaciados, tipografía)
- Datos mock (interfaces TypeScript con datos de ejemplo)
- Estilos globales CSS
- Documentación técnica (WORKFLOW-DOCUMENTATION.md — 2,702 líneas)

Estos archivos son **referencia visual**, no código para ejecutar directamente.

---

## MERCADO Y OPORTUNIDAD

### Industria Avícola

- **Colombia:** Mercado de ~$2 Billion USD, producción de 2M toneladas de pollo, crecimiento del 9.1% anual (2025)
- **Latinoamérica:** Mercado total de ~$320 Billion USD
- **Problema:** Más del 85% de las granjas gestionan con Excel, cuadernos o WhatsApp. Pierden $3,000-8,000 USD/año por ineficiencia
- **Oportunidad:** Menos del 15% de las granjas medianas/grandes usa software especializado

### Competidores Principales

| Competidor | Tipo | Precio | Debilidad clave |
|------------|------|--------|-----------------|
| **SmartBird** | App cloud básica | ~$15-30/mes | Sin IoT, sin automatización, UI genérica |
| **PoultryPlan** | ERP enterprise | Custom ($$$) | Caro, complejo, implementación larga |
| **Maximus** | Hardware+Software | $5,000+ por proyecto | Hardware propietario, no es SaaS |
| **BigFarmNet** | ERP+Hardware | Enterprise | Solo funciona con hardware Big Dutchman |
| **Chickin** | Mobile+IoT | Suscripción | Solo en Asia, no en LATAM |
| **Agrivi** | Farm Management | $30-100/mes | Genérico, no enfocado en avicultura |

### Diferenciadores de AVISENS

1. **Health Score™** — Puntuación única por galpón (0-100) que combina todas las variables ambientales, crecimiento y mortalidad en un solo número fácil de entender. Ningún competidor lo tiene.
2. **IoT accesible** — Diseñado para sensores baratos (ESP32 ~$3 USD, kit completo ~$15-20/galpón) vs hardware propietario de $5,000+
3. **UX Premium** — Diseño "Industrial Clean AgroTech" en modo oscuro con efectos neón, que los técnicos de campo aman usar
4. **Pricing LATAM** — $29-79 USD/mes vs $500+/mes de ERPs enterprise
5. **Multi-tenant nativo** — AVISENS gestiona múltiples granjas como empresa de servicio

### Modelo de Monetización

| Plan | Precio | Incluye |
|------|--------|---------|
| **Starter** | $29/mes | 1-2 galpones, 2 usuarios, dashboard, alertas, inventario, crecimiento |
| **Professional** | $79/mes | Hasta 8 galpones, 10 usuarios, todo Starter + panel financiero, reportes PDF, comparador, mantenimiento |
| **Enterprise** | $199+/mes | Ilimitado, API access, multi-granja, white-label, soporte dedicado |
| **IoT Add-on** | +$25/galpón/mes | Sensores físicos, control de actuadores, MQTT bridge |

---

## STACK TECNOLÓGICO DEFINITIVO

### Frontend (Construcción inmediata)

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **React** | 19 | Framework UI |
| **TypeScript** | 5.x | Tipado estático |
| **Vite** | 6.x | Build tool y dev server |
| **Tailwind CSS** | 4.x | Estilos utility-first |
| **shadcn/ui** | Latest | Componentes base accesibles |
| **React Router** | 7.x | Navegación SPA |
| **Zustand** | 5.x | State management |
| **Recharts** | 2.x | Gráficos (Line, Bar, Radar, Donut) |
| **Lucide React** | Latest | Iconos |
| **Framer Motion** | 12.x | Animaciones premium |
| **React Hook Form** | 7.x | Formularios |
| **Zod** | 3.x | Validación de esquemas |
| **date-fns** | 4.x | Formateo de fechas |
| **Sonner** | 2.x | Notificaciones toast |

### Backend (Fase siguiente)

| Tecnología | Versión | Propósito |
|-----------|---------|-----------|
| **Node.js** | 22 LTS | Runtime |
| **Hono** o **Express** | 4.x | Framework API |
| **PostgreSQL** | 16.x | Base de datos principal |
| **Prisma** | 6.x | ORM con TypeScript |
| **Supabase** | Cloud | Auth + DB + Realtime + Storage |
| **Redis** (Upstash) | Serverless | Cache y rate limiting |
| **Resend** | API | Email transaccional |

### IoT (Fase futura)

| Tecnología | Propósito |
|-----------|-----------|
| **MQTT (EMQX Cloud)** | Broker IoT |
| **ESP32-WROOM** | Microcontrolador WiFi (~$3 USD) |
| **DHT22** | Sensor temperatura + humedad (~$2 USD) |
| **MQ-135** | Sensor CO₂ (~$2 USD) |
| **MQ-137** | Sensor amoníaco (~$3 USD) |

### Deploy

| Servicio | Propósito | Costo |
|---------|-----------|-------|
| **Vercel** | Frontend hosting | Gratis → $20/mes |
| **Supabase** | PostgreSQL + Auth | Gratis → $25/mes |
| **CloudFlare** | CDN + DNS | Gratis |
| **Sentry** | Monitoreo errores | Gratis (5K events) |

**Costo total para empezar: $0/mes** — Todo tiene plan gratuito.

---

## ROLES Y PERMISOS (RBAC)

El sistema implementa 4 roles jerárquicos:

### Rol 1: Avisens (Super Admin) — 👑

**Descripción:** Personal de la empresa AVISENS que administra la plataforma. Acceso total a todas las granjas y todas las funciones.

**Permisos:** TODO — Dashboard, Sensores, Crecimiento, Alertas, Automatización, Inventario, Mantenimiento, Usuarios, Configuración, Panel Financiero, Reportes, Comparador.

**Credenciales demo:** `avisens` / `admin123`

### Rol 2: Administrador (admin) — 🏢

**Descripción:** Dueño o cliente de la granja. Ve información general, gestiona insumos, usuarios y bitácora. No accede a mantenimiento técnico.

**Permisos:** Dashboard, Sensores, Crecimiento, Alertas, Automatización, Inventario, Usuarios, Panel Financiero, Reportes, Comparador.

**Sin acceso a:** Mantenimiento.

**Credenciales demo:** `admin` / `admin123`

### Rol 3: Supervisor/Encargado (supervisor) — 👨‍💼

**Descripción:** Encargado operativo de campo. Gestiona insumos, alertas, registros de crecimiento y actividad por galpón.

**Permisos:** Dashboard, Sensores, Crecimiento, Alertas, Automatización, Inventario.

**Sin acceso a:** Mantenimiento, Usuarios, Panel Financiero.

**Credenciales demo:** `supervisor` / `super123`

### Rol 4: Operador/Operario (operador) — 👷

**Descripción:** Personal de campo con acceso limitado. Visualiza información general y puede hacer activaciones manuales.

**Permisos:** Dashboard (solo lectura), Alertas (solo lectura), Automatización (solo control manual, no puede crear reglas).

**Sin acceso a:** Sensores, Crecimiento, Inventario, Mantenimiento, Usuarios, Financiero.

**Credenciales demo:** `operador` / `oper123`

### Matriz de Permisos Completa

| Módulo | Avisens | Admin | Supervisor | Operador |
|--------|:-------:|:-----:|:----------:|:--------:|
| Dashboard | ✅ Full | ✅ Full | ✅ Full | ✅ Lectura |
| Sensores | ✅ | ✅ | ✅ | ❌ |
| Curvas de Crecimiento | ✅ | ✅ | ✅ | ❌ |
| Alertas | ✅ Full | ✅ Full | ✅ Full | ✅ Lectura |
| Automatización | ✅ Full | ✅ Full | ✅ Full | ✅ Solo manual |
| Inventario | ✅ | ✅ | ✅ | ❌ |
| Mantenimiento | ✅ | ❌ | ❌ | ❌ |
| Usuarios | ✅ | ✅ | ❌ | ❌ |
| Panel Financiero | ✅ | ✅ | ❌ | ❌ |
| Reportes | ✅ | ✅ | ❌ | ❌ |
| Comparador | ✅ | ✅ | ✅ | ❌ |

---

## ESTRUCTURA DE LA APLICACIÓN

### Flujo General del Usuario

```
Usuario visita avisens.com
        │
        ▼
┌──────────────────┐
│   LANDING PAGE   │ ← Página pública con SEO
│   (marketing)    │    Hero, features, pricing, demo, testimonios
└───────┬──────────┘
        │ Click "Iniciar Sesión" o "Probar Gratis"
        ▼
┌──────────────────┐
│   LOGIN          │ ← Selector de rol, usuario, contraseña
│                  │    Usuarios demo disponibles
└───────┬──────────┘
        │ Autenticación exitosa
        ▼
┌──────────────────┐
│   DASHBOARD      │ ← App principal (SPA tras autenticación)
│   (app)          │    Sidebar + Header + Contenido
│                  │    Módulos según rol del usuario
└──────────────────┘
```

### Navegación de la App (11 módulos en 4 secciones)

```
📊 PRINCIPAL
├── Dashboard ────────── Vista general con Health Score por galpón, KPIs de negocio, alertas recientes
├── Centro de Sensores ── Lista de sensores, lectura actual, gráficos históricos 24h
└── Curvas de Crecimiento ── Peso real vs ideal, consumo alimento, selector de ciclos

📈 ANALYTICS  
├── Comparador de Galpones ── Radar chart comparando 2-4 galpones, recomendaciones automáticas
├── Panel Financiero ──────── ROI, costo/ave, proyección de ganancias, conversión alimenticia
└── Reportes ──────────────── Templates PDF (diario, semanal, mensual), preview visual

⚙️ OPERACIONES
├── Alertas ──────────── 3 niveles (crítica/advertencia/info), filtros, resolver, historial
├── Automatización ───── Modo auto/manual, controles ON/OFF, reglas configurables
├── Inventario ──────── Stock de alimentos/medicamentos/insumos, alertas stock bajo, consumo semanal
└── Mantenimiento ───── Tareas preventivas/correctivas, calendario, asignación de técnicos

👥 ADMINISTRACIÓN
├── Usuarios ─────────── CRUD completo, roles, estados, búsqueda
└── Configuración ────── Planes de suscripción, preferencias, perfil de granja
```

---

## MÓDULOS — DETALLE FUNCIONAL

### 1. Landing Page (PRIMERA en construirse)

**Propósito:** Página pública que vende el producto. Es la primera impresión.

**Secciones:**
- **Hero:** Título impactante + subtítulo + CTA "Empieza Gratis" + imagen/mockup del dashboard
- **Logos de confianza:** "Usado por X granjas en Colombia"
- **Problema/Solución:** 3 cards mostrando el dolor del cliente y cómo AVISENS lo resuelve
- **Features:** 6-8 funcionalidades principales con iconos y descripciones
- **Health Score:** Sección especial explicando esta métrica innovadora
- **Dashboard Preview:** Screenshot interactivo o video del dashboard real
- **Pricing:** 3 planes (Starter, Pro, Enterprise) con toggle mensual/anual
- **Testimonios:** Reviews de clientes (placeholder inicial)
- **FAQ:** Preguntas frecuentes
- **CTA Final:** "Transforma tu granja hoy"
- **Footer:** Links, redes sociales, contacto

**Diseño:** Modo oscuro (#0a1612), estilo AgroTech premium, animaciones de scroll, responsive mobile-first.

### 2. Dashboard Principal

**Propósito:** Vista ejecutiva del estado de toda la granja en un vistazo.

**Elementos:**
- **Barra KPIs:** Aves activas, tasa de mortalidad, conversión alimenticia, ROI estimado (contadores animados)
- **Cards de Galpón (x4):** Cada card muestra:
  - Health Score (anillo SVG animado 0-100 con gradiente rojo→ámbar→verde)
  - 4 mini-métricas: temperatura, humedad, CO₂, NH₃ con semáforo
  - Población de aves, edad del lote, ocupación %
  - Estado general (Óptimo/Advertencia/Crítico) con efecto glow
- **Gráfico de Tendencias 24h:** Área chart con las 4 métricas ambientales
- **Panel de Alertas Recientes:** Últimas 5 alertas con indicador de severidad
- **Versión Mobile:** Layout completamente diferente optimizado para táctil

### 3. Centro de Sensores

**Propósito:** Monitoreo detallado de todos los sensores instalados.

**Elementos:**
- Stats: Total sensores, online, offline
- Lista de sensores con: ID, nombre, tipo, zona, estado (online/offline), batería
- Seleccionar sensor → lectura actual grande + gráfico histórico 24h (LineChart)
- Tipos: temperatura (°C), humedad (%), CO₂ (ppm), amoníaco NH₃ (ppm)
- 9 sensores mock distribuidos en 3 zonas (Norte, Centro, Sur)

### 4. Curvas de Crecimiento

**Propósito:** Comparar el crecimiento real de las aves vs curvas estándar de la raza.

**Elementos:**
- KPIs: Peso actual (g), desviación (%), proyección día 42, día del ciclo
- Selector de ciclos (actual + históricos)
- Gráfico principal: Curva Real (verde sólida) vs Curva Ideal (gris punteada)
- Gráfico secundario: Consumo de alimento acumulado (BarChart)
- Tabla de métricas detalladas por día
- Razas soportadas: Ross 308, Cobb 500, Hubbard

### 5. Alertas

**Propósito:** Gestión centralizada de todas las alertas del sistema.

**Elementos:**
- 4 tarjetas resumen: Críticas (rojo), Advertencias (ámbar), Información (azul), Resueltas hoy (verde)
- Búsqueda por texto
- Filtro por tipo + toggle "mostrar resueltas"
- Cards de alerta con: icono, título, descripción, timestamp, zona, botones resolver/detalles
- 3 niveles de severidad: critical 🔴, warning 🟡, info 🔵

### 6. Automatización

**Propósito:** Control de equipos del galpón (ventiladores, iluminación, comederos).

**Elementos:**
- KPIs: Modo actual (Auto/Manual), equipos activos, reglas activas
- Selector de modo con cards descriptivas
- 8 equipos controlables con toggle ON/OFF + slider de potencia (0-100%)
- 5 reglas de automatización: Control temp (>26°C), humedad (<50%), CO₂ (>4000ppm), iluminación programada (06-20h), alimentación automática (08:00, 14:00, 20:00)
- En modo auto: equipos controlados por reglas, sliders deshabilitados
- En modo manual: control directo

### 7. Inventario

**Propósito:** Gestión de stock de alimentos, medicamentos e insumos.

**Elementos:**
- KPIs: Total items, stock bajo, consumo diario (kg), valor total ($)
- Alerta prominente cuando hay items bajo mínimo
- Filtro por categoría: Todos/Alimentos/Medicamentos/Insumos
- Tabla: nombre, categoría, stock actual (con barra progreso), estado, proveedor, último restock, valor
- Gráfico: Consumo semanal (BarChart por categoría)
- 3 categorías: feed, medicine, supplies
- 3 estados: Bueno (verde), Bajo (ámbar), Crítico (rojo)

### 8. Mantenimiento (Solo Avisens)

**Propósito:** Bitácora de mantenimiento de equipos.

**Elementos:**
- KPIs: Pendientes, en progreso, completadas, prioridad alta
- Filtros: estado + prioridad
- Cards de tarea: equipo, tipo (preventivo/correctivo/inspección), prioridad, estado, fecha, técnico, notas
- Calendario semanal con indicadores de tareas
- Botones de acción: Iniciar → Completar → Ver Detalles / Editar

### 9. Gestión de Usuarios

**Propósito:** CRUD de usuarios del sistema.

**Elementos:**
- KPIs: Total usuarios, activos, administradores, botón agregar
- Búsqueda por nombre, username o email
- Filtros: rol + estado
- Tabla con badges de color por rol + estado activo/inactivo
- Modal completo para crear/editar: nombre, username, email, rol, estado, contraseña

### 10. Panel Financiero (NUEVO — diferenciador clave)

**Propósito:** Demostrar el ROI del sistema. Es la razón por la que los clientes pagan.

**Elementos:**
- KPIs: Costo por ave, ROI del ciclo, ingresos estimados, ganancia neta
- Gráfico Donut: Desglose de costos (alimento, salud, energía, mano de obra)
- Gráfico Área: Proyección de ganancias con 3 escenarios
- Tabla: Comparativa de últimos 5 ciclos
- Indicador de eficiencia: Conversión alimenticia (kg alimento / kg carne)

### 11. Comparador de Galpones (NUEVO)

**Propósito:** Comparar rendimiento entre galpones lado a lado.

**Elementos:**
- Selector multi-galpón (2-4)
- Radar Chart con 6 ejes: Temperatura, Humedad, CO₂, Crecimiento, Mortalidad, Eficiencia
- Tabla comparativa con code-colors
- Recomendaciones automáticas generadas

---

## SISTEMA DE DISEÑO

### Identidad Visual

- **Estilo:** "Industrial Clean AgroTech"
- **Modo:** Oscuro exclusivamente
- **Concepto:** Minimalista industrial con toques agrícolas y efectos neón

### Paleta de Colores

| Uso | Color | Hex |
|-----|-------|-----|
| Fondo principal | Verde muy oscuro | `#0a1612` |
| Fondo secundario | Verde oscuro | `#0d1a16` |
| Fondo cards | Verde oscuro claro | `#0f1e19` |
| Bordes | Verde gris | `#1a2e26` |
| Texto principal | Blanco verdoso | `#e8f5f1` |
| Texto secundario | Gris verdoso | `#9db3ab` |
| Verde neón (Óptimo) | Verde brillante | `#10b981` |
| Ámbar neón (Advertencia) | Ámbar brillante | `#f59e0b` |
| Rojo neón (Crítico) | Rojo brillante | `#ef4444` |
| Azul (Información) | Azul brillante | `#3b82f6` |

### Sistema de Estados (Semáforo)

- 🟢 **Óptimo:** Verde con glow `rgba(16, 185, 129, 0.3)` — Todo normal
- 🟡 **Advertencia:** Ámbar con glow `rgba(245, 158, 11, 0.3)` — Requiere atención
- 🔴 **Crítico:** Rojo con glow `rgba(239, 68, 68, 0.3)` + pulso animado — Acción inmediata

### Breakpoints Responsive

| Nombre | Tamaño | Layout |
|--------|--------|--------|
| Mobile | < 768px | 1 columna, navegación inferior, padding 12px |
| Tablet | ≥ 768px | 2 columnas, sidebar opcional |
| Desktop | ≥ 1024px | Sidebar visible, 3-4 columnas, max-width 1600px |

### Componentes de Animación Clave

- **Contadores animados:** Números que animan de 0 al valor al cargar
- **Health Score Ring:** Anillo SVG que se llena con animación + gradiente de color
- **Skeleton loading:** Shimmer effect mientras cargan datos
- **Transiciones entre vistas:** Fade + slide suave
- **Hover en cards:** Elevación con sombra dinámica
- **Indicadores pulsantes:** Status "critical" con glow intermitente

### Rangos Óptimos de Sensores

| Variable | Óptimo | Crítico | Unidad |
|----------|--------|---------|--------|
| Temperatura | 22-26 | <18 o >30 | °C |
| Humedad | 50-70 | <40 o >80 | % |
| CO₂ | <3,000 | >5,000 | ppm |
| Amoníaco (NH₃) | <20 | >35 | ppm |

---

## HEALTH SCORE — ALGORITMO

El Health Score es la métrica innovadora de AVISENS. Combina todas las variables en un solo número de 0 a 100.

```
Health Score = (
    Temp Score     × 0.25 +   ← 25% peso
    Humidity Score × 0.20 +   ← 20% peso
    CO₂ Score      × 0.20 +   ← 20% peso
    NH₃ Score      × 0.15 +   ← 15% peso
    Growth Score   × 0.10 +   ← 10% peso
    Mortality Score × 0.10     ← 10% peso
)

Interpretación:
  90-100 → Excelente (verde brillante)
  70-89  → Bueno (verde)
  50-69  → Atención (ámbar)
  30-49  → Problema (naranja)
  0-29   → Crítico (rojo)
```

Cada sub-score se calcula comparando el valor actual contra el rango óptimo. Si está dentro del rango = 100 puntos. Si se aleja del rango, el score baja proporcionalmente hasta 0 cuando alcanza el rango crítico.

---

## BASE DE DATOS — MODELO

### Tablas Principales (9)

1. **users** — id, username, password_hash, name, email, role (ENUM), is_active, timestamps
2. **sheds** — id, name, capacity, current_chickens, breed, batch_start_date, status, created_by (FK)
3. **sensor_readings** — id, shed_id (FK), sensor_type (ENUM), value, unit, timestamp
4. **alerts** — id, shed_id (FK), severity (ENUM), message, is_resolved, resolved_by (FK), timestamps
5. **automation_rules** — id, shed_id (FK), device_type, action, trigger_condition, schedule (JSON), is_active
6. **automation_logs** — id, shed_id (FK), device, action, mode (auto/manual), triggered_by (FK), timestamp
7. **inventory_items** — id, shed_id (FK), item_type (ENUM), name, quantity, unit, min_threshold, supplier
8. **growth_records** — id, shed_id (FK), measurement_date, average_weight, sample_size, mortality_count
9. **maintenance_logs** — id, shed_id (FK), equipment, type (ENUM), description, performed_by (FK), cost, next_due_date

### ENUMs

- **user_role:** avisens, admin, supervisor, operador
- **sensor_type:** temperature, humidity, co2, ammonia
- **alert_severity:** critical, warning, info
- **item_type:** feed, medicine, supplies
- **maintenance_type:** preventive, corrective, inspection
- **automation_mode:** auto, manual

---

## DATOS MOCK DE REFERENCIA

### 4 Galpones

| Galpón | Temp | Humedad | CO₂ | NH₃ | Aves | Edad | Estado |
|--------|:----:|:-------:|:---:|:---:|:----:|:----:|--------|
| Galpón 1 | 22°C | 65% | 2200 ppm | 18 ppm | 15,000 | 28 días | Óptimo |
| Galpón 2 | 26°C | 58% | 2800 ppm | 22 ppm | 14,500 | 35 días | Advertencia |
| Galpón 3 | 20°C | 72% | 1800 ppm | 15 ppm | 15,200 | 21 días | Óptimo |
| Galpón 4 | 28°C | 48% | 3200 ppm | 28 ppm | 14,800 | 42 días | Crítico |

### Curva de Crecimiento (Ross 308)

| Día | Peso Ideal (g) | Peso Real (g) | Consumo Acumulado (g) |
|-----|:--------------:|:-------------:|:---------------------:|
| 0 | 42 | 42 | 10 |
| 7 | 170 | 165 | 180 |
| 14 | 450 | 440 | 520 |
| 21 | 900 | 880 | 1,100 |
| 28 | 1,450 | 1,420 | 1,820 |
| 35 | 2,000 | — | 2,450 |
| 42 | 2,500 | — | 3,200 |

### 5 Usuarios Mock

| Nombre | Username | Email | Rol | Estado |
|--------|----------|-------|-----|--------|
| Avisens Admin | avisens | admin@avisens.com | Avisens | Activo |
| Juan Martínez | admin | juan@empresa.com | Admin | Activo |
| María López | supervisor | maria@empresa.com | Supervisor | Activo |
| Carlos Ruiz | operador | carlos@empresa.com | Operador | Activo |
| Ana Torres | ana.torres | ana@empresa.com | Supervisor | Inactivo |

---

## ORDEN DE EJECUCIÓN

### Paso 1: Setup + Landing Page (Semana 1-2)

1. Inicializar proyecto: `npm create vite@latest avisens -- --template react-ts`
2. Instalar dependencias: Tailwind, shadcn/ui, React Router, Zustand, Framer Motion, Recharts, Lucide, date-fns
3. Configurar estructura de carpetas profesional
4. Construir la **Landing Page** completa (la cara del producto)
5. Sistema de diseño (tokens, componentes base, animaciones)

### Paso 2: App Principal (Semana 3-6)

6. Login con selector de roles
7. Layout principal: Sidebar + Header + Content
8. Dashboard con Health Score
9. Los 8 módulos operativos (migrar diseños Figma)
10. 3 módulos nuevos: Financiero, Comparador, Reportes
11. Responsive completo (mobile + desktop)

### Paso 3: Backend + Integración (Semana 7-10)

12. Setup Supabase (PostgreSQL + Auth)
13. Schema de base de datos con Prisma
14. API endpoints
15. Conectar frontend ↔ backend
16. Reemplazar datos mock con datos reales

### Paso 4: IoT + Producción (Semana 11-15)

17. MQTT Broker
18. Integración con sensores físicos
19. PWA + Modo offline
20. Deploy a producción
21. Primeros clientes beta

---

## ESTRUCTURA DE CARPETAS RECOMENDADA

```
/avisens
├── /src
│   ├── /components
│   │   ├── /landing          ← Componentes de la landing page
│   │   ├── /dashboard        ← Dashboard, ShedCard, HealthScoreRing
│   │   ├── /sensors          ← SensorsView, SensorDetail
│   │   ├── /growth           ← GrowthView, GrowthChart
│   │   ├── /alerts           ← AlertsView, AlertCard
│   │   ├── /automation       ← AutomationView, EquipmentCard, RuleCard
│   │   ├── /inventory        ← InventoryView, ConsumptionChart
│   │   ├── /maintenance      ← MaintenanceView, TaskCard, Calendar
│   │   ├── /users            ← UserManagementView, UserModal
│   │   ├── /financial        ← FinancialView, CostBreakdown, ROIChart
│   │   ├── /comparison       ← ComparisonView, RadarChart
│   │   ├── /reports          ← ReportsView, PDFPreview
│   │   ├── /layout           ← Sidebar, Header, BottomNav, NotificationCenter
│   │   ├── /shared           ← AnimatedCounter, SkeletonLoader, StatusBadge
│   │   └── /ui               ← shadcn/ui components
│   ├── /hooks                ← useAuth, useShedData, useAlerts, useMediaQuery
│   ├── /store                ← authStore, shedStore, alertStore, uiStore (Zustand)
│   ├── /services             ← api.ts, auth.ts (preparado para backend real)
│   ├── /types                ← Todas las interfaces TypeScript centralizadas
│   ├── /utils                ← healthScore.ts, formatters.ts, constants.ts
│   ├── /config               ← design-tokens.ts, api-config.ts
│   ├── /styles               ← globals.css
│   ├── /assets               ← logo, imágenes, SVGs
│   ├── App.tsx
│   └── main.tsx
├── /public
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.ts
└── README.md
```

---

## NOTAS IMPORTANTES PARA EL DESARROLLO

1. **Los archivos de Figma son REFERENCIA VISUAL, no código ejecutable.** Los imports tipo `figma:asset/...` no funcionan fuera de Figma Make. Usar URLs reales o archivos locales para el logo.

2. **Los datos mock deben estar en archivos separados en `/services/`** con la misma estructura de interfaces que usará la API real. Así el switch de mock a API real es cambiar una línea.

3. **Los colores deben unificarse.** El prototipo de Figma usa tanto `#10b981` como `#00ff88` para verde. Elegir uno y mantener consistencia. Recomendación: `#10b981` (Tailwind emerald-500) para elementos sólidos, `#00ff88` solo para efectos glow/neón.

4. **La landing page va ANTES del dashboard.** Es lo primero que ve un potencial cliente. Debe impresionar.

5. **El Health Score es el diferenciador principal.** Debe ser visualmente impactante — anillo SVG animado con gradiente, número grande, efecto satisfactorio al cargar.

6. **Mobile es crítico.** Los técnicos de campo usan el celular. La versión mobile no es "la misma versión más chica" — es una experiencia completamente diferente optimizada para uso con una mano.

7. **Todo debe funcionar con datos mock primero.** El backend se construye después. La app debe ser 100% demostrable sin backend.

---

## ESTUDIO DE MERCADO 2026 — ANÁLISIS COMPETITIVO PROFUNDO

*Actualizado: Abril 2026 — Basado en investigación activa del mercado*

### Análisis Detallado de Competidores

#### SmartBird (smartbirdapp.com)
- **Lo que hace bien:** Entrada rápida de datos en móvil, dashboards automáticos, reportes básicos, multi-especie
- **Lo que NO tiene:** Sin IoT real, sin control de actuadores, sin automatización, sin Health Score, sin módulo financiero avanzado, sin predicciones IA
- **Vacíos explotables:** Vacunación y gestión de galera aún marcados como "Coming Soon" — tardanza en entrega
- **Precio:** ~$15-30/mes — mercado económico, no premium

#### PoultryPlan
- **Lo que hace bien:** Desarrollado por organización avícola real (no IT company), orientado a cadena de valor, toma de decisiones basada en datos
- **Lo que NO tiene:** UI anticuada, no tiene IoT nativo, implementación compleja, no pensado para LATAM
- **Vacíos explotables:** No tiene experiencia de usuario moderna, no tiene app mobile optimizada

#### BigFarmNet (Big Dutchman)
- **Lo que hace bien:** Integración hardware-software perfecta, control ambiental completo
- **Lo que NO tiene:** Solo funciona con hardware Big Dutchman ($5,000+ por galpón), no es SaaS accesible, sin plan LATAM
- **Vacíos explotables:** Lock-in de hardware = oportunidad para solución IoT agnóstica y barata

#### mTech Systems / Chickin (Asia)
- **Lo que hace bien:** IoT + App mobile, sensores ambientales, alertas
- **Lo que NO tiene:** Sin presencia LATAM, idioma, soporte local, cumplimiento normativo colombiano
- **Vacíos explotables:** Todo el mercado LATAM desatendido por soluciones asiáticas

#### Agrivi / Farm Management genéricos
- **Lo que hace bien:** Amplio, multi-crop, bien financiado
- **Lo que NO tiene:** No especializado en avicultura, sin módulos de bienestar animal, sin curvas de crecimiento broiler
- **Vacíos explotables:** Ser el especialista de nicho siempre gana al generalista en conversiones B2B

### Brechas del Mercado (Oportunidades Reales)

1. **Cero soluciones LATAM con IoT accesible** — El mercado hispanohablante no tiene un software nativo con sensores baratos
2. **Bienestar animal no está digitalizado** — Colombia exige cada vez más estándares (ICA, FENAVI), ningún software lo gestiona
3. **Trazabilidad de lote a rastro** — Nadie conecta la granja con la planta de beneficio
4. **Antibiótico-free tracking** — Tendencia global; las granjas que quieren certificarse no tienen herramienta
5. **WhatsApp como canal de alertas** — El avicultor colombiano vive en WhatsApp; ningún software lo integra
6. **Predicción de rentabilidad** — Los granjeros quieren saber hoy cuánto van a ganar en 3 semanas; nadie lo predice

---

## FUNCIONALIDADES DIFERENCIADORAS — ROADMAP DE INNOVACIÓN

*Organizadas por impacto vs esfuerzo. Implementar en orden.*

### TIER 1 — Alto Impacto, Esfuerzo Bajo (implementar pronto)

#### 1. Alertas por WhatsApp 🟢 DIFERENCIADOR #1
- Integración con WhatsApp Business API (o Twilio) para enviar alertas críticas directamente al celular del granjero
- El avicultor no necesita abrir la app — recibe el mensaje donde ya vive
- **Mensaje tipo:** "🚨 CRÍTICO — Galpón 4: Temperatura 31°C (máx 30°C). Revisar ventilación. [Ver dashboard]"
- Ningún competidor directo en LATAM lo tiene
- **Stack:** Twilio WhatsApp API o Meta Cloud API (gratis hasta 1,000 conversaciones/mes)

#### 2. Bitácora de Bioseguridad Digital
- Registro de cada visita al galpón: quién entró, a qué hora, qué protocolos siguió
- Registro de desinfecciones, fumigaciones, cambios de ropa
- Log de vehículos que entran a la granja
- Generación de reporte para auditorías ICA/INVIMA
- **Por qué importa:** Brotes de Newcastle o Influenza Aviar obligan a demostrar protocolos — nadie tiene esto digitalizado

#### 3. Plan Vacunal con Recordatorios
- Calendario de vacunación configurable por raza (Ross 308, Cobb 500, Hubbard)
- Alertas automáticas 24h antes de cada vacunación
- Registro de lote del biológico, dosis aplicada, operario responsable
- Trazabilidad completa del historial vacunal por lote
- **Por qué importa:** SmartBird lo tiene como "Coming Soon" desde hace más de un año — hay mercado esperando esto

#### 4. Calculadora FCR en Tiempo Real (Feed Conversion Ratio)
- Calcula automáticamente kg de alimento / kg de carne producida con los datos ya ingresados
- Compara contra el estándar de la raza y contra ciclos anteriores
- Alerta si el FCR se desvía más del 5% del objetivo
- **Benchmark:** Ross 308 objetivo = 1.65 FCR a día 42
- Es el KPI #1 que los granjeros profesionales monitorean — actualmente lo calculan en Excel

#### 5. Predicción de Peso Final (día 42)
- Modelo de proyección lineal/polinomial basado en la curva de crecimiento actual
- Muestra: "A este ritmo, tus aves pesarán X gramos el día 42"
- Calcula la desviación vs objetivo y el impacto económico estimado
- Visible en el dashboard como KPI adicional
- **Por qué importa:** Permite anticipar si habrá problema de peso antes de que sea tarde para corregirlo

#### 6. Modo PWA Offline Completo
- La app funciona sin internet — datos se sincronizan cuando vuelve la conexión
- Las granjas rurales colombianas tienen conectividad intermitente
- Operarios pueden registrar mortalidad, pesos, consumo sin señal
- **Stack:** Service Workers + IndexedDB + background sync

---

### TIER 2 — Alto Impacto, Esfuerzo Medio (implementar en fase 2)

#### 7. Módulo de Trazabilidad de Lote
- Seguimiento completo desde "día 1" (llegada del pollito) hasta la venta
- Registro de: origen del pollito (incubadora), raza, peso inicial, número de guía
- Al cierre del ciclo: peso promedio final, mortalidad total, alimento consumido, medicamentos usados
- Generación de "Pasaporte del Lote" en PDF para presentar al rastro/planta de beneficio
- **Por qué importa:** Plantas de beneficio exigen cada vez más esta trazabilidad para pagar precio premium

#### 8. Módulo de Bienestar Animal (Animal Welfare Score)
- Score 0-100 basado en los 5 dominios del bienestar animal (adaptados a broilers)
- Indicadores: densidad de aves/m², score de cojera estimado, acceso a agua, calidad de cama
- Cumplimiento con estándares ICA Colombia y Global Animal Partnership (GAP)
- Reporte de bienestar para auditorías
- **Por qué importa:** Normativa colombiana se endurece; certificaciones de bienestar animal permiten cobrar 15-20% más

#### 9. Panel de Sostenibilidad y Huella de Carbono
- Calcula emisiones CO₂ estimadas por lote (basado en consumo energético, alimento, agua)
- Calcula consumo de agua por kg de carne producida
- Recomendaciones para reducir huella
- Certificado de lote "bajo en carbono"
- **Por qué importa:** Grandes compradores (supermercados, exportaciones) piden esto; diferencia al granjero en precio

#### 10. Alertas Predictivas con IA (Detección Temprana)
- Analiza patrones de temperatura, humedad y mortalidad de los últimos 7 días
- Detecta cuando la tendencia indica que habrá un problema en las próximas 24-48 horas
- Alerta: "Patrón detectado: En las últimas 6h la temperatura sube 0.5°C/hora. Si no se actúa, superará 30°C en ~4 horas"
- **Stack:** Reglas de tendencia simple + regresión lineal en el cliente (no requiere ML complejo)

#### 11. Comparador de Ciclos Históricos
- Compara el ciclo actual contra los 3-5 ciclos anteriores en el mismo galpón
- Gráfico: "Esta semana estás 8% por encima de tu mejor ciclo histórico"
- Identifica qué ciclos fueron más rentables y en qué condiciones ambientales ocurrieron
- **Por qué importa:** Los granjeros quieren aprender de su propio historial, no solo ver datos actuales

#### 12. Registro de Mortalidad con Causa
- Al ingresar mortalidad, el operario selecciona la causa: respiratoria, digestiva, aplastamiento, ascitis, calor, otra
- Dashboard de causas de mortalidad por semana/ciclo (donut chart)
- Identifica si hay patrón (ej. mortalidad por calor siempre los martes = problema con ventilación en ese turno)
- Exportable para reportes veterinarios

#### 13. Integración con Proveedores (Solicitudes de Insumos)
- Cuando el stock de un insumo llega al mínimo, se genera automáticamente una solicitud de compra
- El sistema envía un correo/WhatsApp al proveedor configurado con la cantidad necesaria
- El dueño aprueba o edita antes de enviar
- Registro del historial de compras por proveedor con precio promedio
- **Por qué importa:** Automatiza la gestión de insumos que hoy se hace por WhatsApp manual

---

### TIER 3 — Máximo Diferenciación, Esfuerzo Alto (implementar en fase 3-4)

#### 14. Asistente IA Conversacional ("Pregúntale a AVISENS")
- Chat integrado donde el granjero pregunta en lenguaje natural: "¿Cómo está el galpón 2?" "¿Cuánto alimento necesito comprar esta semana?"
- Responde con datos reales del sistema + recomendaciones
- **Stack:** Claude API (claude-sonnet-4-6) con acceso a los datos de la granja como context
- **Por qué importa:** Elimina la curva de aprendizaje del software — si puedes preguntar, no necesitas saber usar dashboards

#### 15. Computer Vision — Conteo Automático de Aves
- Integración con cámara IP económica (~$30 USD) instalada en el galpón
- Algoritmo de visión (YOLOv8) que estima la población de aves y detecta comportamiento anormal (aglomeración, inactividad, distribución irregular)
- Alerta si las aves se acumulan en una zona (indica problema de temperatura o ventilación)
- **Stack:** YOLOv8 + ONNX (modelo ligero que corre en Edge/ESP32-S3 o en el servidor)
- **Por qué importa:** La investigación 2026 muestra esto como el futuro del precision poultry farming — nadie en LATAM lo tiene

#### 16. Marketplace de Insumos
- Directorio de proveedores verificados de Colombia (alimentos, medicamentos, insumos)
- Comparación de precios en tiempo real para los insumos más comunes
- Compra directa integrada con pago en línea
- **Modelo de negocio adicional:** Comisión del 2-3% por transacción o suscripción premium para proveedores
- **Por qué importa:** Crea un efecto de red — entre más granjas usen AVISENS, más poder de negociación colectiva

#### 17. API para Plantas de Beneficio y Rastros
- API REST documentada que permite a plantas de procesamiento consultar datos de trazabilidad de lotes
- Webhook cuando el lote está listo para recoger (día 35-42, peso objetivo alcanzado)
- Integración con sistemas de logística para coordinar transporte
- **Modelo de negocio:** Cobrar a las plantas por acceso API ($99-299/mes)

#### 18. Módulo Antibiótico-Free y Certificaciones
- Registro de todos los medicamentos aplicados al lote con nombre, dosis, periodo de retiro
- Alerta si se aplica un antibiótico restringido para granjas que quieren certificación
- Genera documento de "Declaración libre de antibióticos" para el ciclo
- Integración con certificadoras (BASC, GlobalG.A.P.)
- **Por qué importa:** Premium de precio 15-25% para carne antibiotic-free en supermercados premium y exportaciones

#### 19. Dashboard Ejecutivo Multi-Granja para Integradores
- Vista consolidada para empresas integradoras que manejan 10-50 granjas de contrato
- Ranking de granjas por Health Score, FCR, rentabilidad
- Asignación automática de técnicos de campo según alertas
- Generación de informes de producción para la planta integradora
- **Por qué importa:** Los integradores avícolas son el cliente enterprise — un solo contrato = 20-50 granjas

---

### FUNCIONALIDADES UX — PEQUEÑAS PERO MUY VALORADAS

#### Micro-funcionalidades de alto impacto:

| Función | Descripción | Esfuerzo |
|---------|-------------|---------|
| **Tour de onboarding** | Guía interactiva en el primer login, paso a paso | Bajo |
| **Modo nocturno adaptativo** | Ya es modo oscuro, pero que reduzca más el brillo entre 10pm-6am | Muy Bajo |
| **Atajos de teclado** | Para usuarios avanzados (admin de granja) que ingresan datos diariamente | Bajo |
| **Notas por galpón** | Campo de texto libre por galpón para anotar observaciones del día | Muy Bajo |
| **Foto del día** | Adjuntar foto desde móvil al registro diario del galpón | Bajo |
| **Resumen diario por email** | Email automático a las 7am con el estado de todos los galpones | Medio |
| **Modo quiosco para operario** | Pantalla simplificada tipo tablet fija en el galpón solo con controles | Medio |
| **Exportación a Excel/CSV** | Cualquier tabla del sistema exportable con un click | Bajo |
| **Comparativa año anterior** | "Este día del año pasado, el galpón 1 tenía X temperatura" | Medio |
| **Widget de clima externo** | Temperatura y clima exterior de la ciudad de la granja (OpenWeather API gratis) | Muy Bajo |

---

## POSICIONAMIENTO ESTRATÉGICO REVISADO

### El único software avícola en LATAM que:
1. **Conecta** sensores IoT baratos con automatización real
2. **Predice** problemas antes de que ocurran (no solo alerta cuando ya pasó)
3. **Comunica** por WhatsApp (donde vive el avicultor colombiano)
4. **Certifica** bienestar animal, trazabilidad y antibiótico-free en un solo lugar
5. **Habla** el idioma del granjero (español, sin tecnicismos, UX simple)

### Mensaje de venta único (USP):
> "Mientras tus competidores usan Excel y WhatsApp para gestionar sus granjas, AVISENS te da el mismo sistema que usan las mejores granjas del mundo — a precio colombiano, en español, y que te avisa al celular antes de que el pollo muera."

---

## PRIORIZACIÓN DE IMPLEMENTACIÓN (ACTUALIZADA)

| Prioridad | Funcionalidad | Impacto | Esfuerzo | Fase |
|-----------|--------------|---------|---------|------|
| 🔴 P1 | Alertas WhatsApp | Muy Alto | Bajo | Fase 2 |
| 🔴 P1 | Plan Vacunal + recordatorios | Alto | Bajo | Fase 2 |
| 🔴 P1 | FCR en tiempo real | Alto | Muy Bajo | Fase 1 (prototipo) |
| 🟡 P2 | Predicción peso final | Alto | Bajo | Fase 2 |
| 🟡 P2 | Modo PWA offline | Alto | Medio | Fase 3 |
| 🟡 P2 | Trazabilidad de lote | Alto | Medio | Fase 3 |
| 🟡 P2 | Bienestar animal score | Medio | Medio | Fase 3 |
| 🟡 P2 | Alertas predictivas IA | Alto | Medio | Fase 3 |
| 🟢 P3 | Asistente IA (Claude API) | Muy Alto | Medio | Fase 4 |
| 🟢 P3 | Computer Vision | Muy Alto | Alto | Fase 4 |
| 🟢 P3 | Marketplace insumos | Alto | Alto | Fase 5 |
| 🟢 P3 | API para rastros/plantas | Medio | Alto | Fase 5 |

---

**FIN DEL DOCUMENTO MAESTRO**

*Este documento contiene toda la información necesaria para construir AVISENS desde cero. Cualquier persona o IA que lo lea tiene el contexto completo del proyecto.*
