# Sistema de Evaluación Municipal

Sistema web para la evaluación y seguimiento de la gestión municipal. Permite a los municipios completar evaluaciones estructuradas por secciones y generar calificaciones automáticas.

## Descripción

Esta aplicación permite:
- Autenticación de usuarios (municipios y administradores)
- Evaluación por secciones con diferentes tipos de preguntas (escala, booleanas, texto)
- Cálculo automático de puntajes ponderados
- Panel administrativo para revisar envíos
- Interfaz con tema claro/oscuro
- Progressive Web App (PWA) para instalación en dispositivos

## Tecnologías Utilizadas

Para este proyecto, he seleccionado un conjunto de tecnologías modernas y robustas que garantizan tanto un excelente rendimiento como una gran experiencia de desarrollo. Aquí te explico qué he usado y por qué:

### Frontend (Interfaz de Usuario)

*   **Next.js 15:** He elegido este framework de React porque es el estándar actual para construir aplicaciones web rápidas y escalables. Me permite manejar el enrutamiento y optimizar el rendimiento desde el servidor, facilitando la creación de una aplicación robusta.
*   **React 19:** Es la biblioteca base que utilizo para construir la interfaz. Me permite crear componentes reutilizables (como las tarjetas de evaluación o los botones) y manejar el estado de la aplicación de forma fluida y reactiva.
*   **TypeScript:** Lo utilizo para añadir tipado estático a JavaScript. Esto es fundamental para evitar errores comunes durante el desarrollo y hace que el código sea mucho más seguro, legible y fácil de mantener.
*   **Tailwind CSS:** Para el diseño visual, he optado por Tailwind. Me permite construir interfaces modernas, bonitas y totalmente responsivas de manera muy rápida, utilizando clases utilitarias directamente en el código.
*   **Lucide React:** Es la librería de iconos que he integrado para dar una apariencia limpia y profesional a la interfaz gráfica.

### Backend (Servidor y Datos)

*   **Node.js:** Es el entorno de ejecución que potencia todo el servidor. Me permite utilizar JavaScript en el backend, unificando el lenguaje de programación en todo el proyecto.
*   **Prisma ORM:** Esta herramienta es clave para la comunicación con la base de datos. Me permite interactuar con los datos usando objetos de TypeScript en lugar de escribir consultas SQL complejas, lo que acelera el desarrollo y previene errores.
*   **SQLite:** He seleccionado SQLite como base de datos por su simplicidad y eficiencia. Al funcionar con un archivo local, elimina la necesidad de configurar servidores de base de datos complejos, facilitando el despliegue y la portabilidad del proyecto.
*   **Next.js API Routes:** Aprovecho la arquitectura de Next.js para construir la API del backend dentro del mismo proyecto. Aquí reside la lógica segura para autenticar usuarios, procesar las evaluaciones y calcular los puntajes.



##  Estructura del Proyecto

```
Avance Proyecto/
├── front/                          # Aplicación Frontend (Next.js)
│   ├── src/
│   │   ├── app/                   # App Router de Next.js
│   │   │   ├── api/               # API Routes
│   │   │   ├── dashboard/         # Panel de usuario
│   │   │   ├── login/             # Página de login
│   │   │   └── admin/             # Panel administrativo
│   │   ├── components/            # Componentes reutilizables
│   │   └── contexts/              # Contextos de React
│   ├── public/                    # Archivos estáticos
│   ├── .env                       # Variables de entorno
│   ├── package.json               # Dependencias del proyecto
│   └── next.config.ts             # Configuración de Next.js
│
└── back/                          # Backend (Base de datos)
    ├── prisma/
    │   ├── schema.prisma          # Esquema de la base de datos
    │   ├── migrations/            # Migraciones
    │   └── seed.ts                # Datos iniciales
    └── dev.db                     # Base de datos SQLite
```

##  Instalación y Despliegue

Tienes dos formas de correr el proyecto: la **Local** (Recomendada para desarrollo) y **Docker** (Recomendada para portabilidad).

### Opción 1: Desarrollo Local (¡Nuevo!)

Hemos simplificado todo a un **solo comando**.

1. **Clonar y Preparar**
   ```bash
   git clone https://github.com/RajeZ0/AvanceEncuesta
   cd AvanceEncuesta
   
   # Instala dependencias en la raíz y en front/back
   cd front && npm install
   cd ../back && npm install
   cd ..
   ```

2. **Iniciar Todo (Frontend + Base de Datos)**
   Simplemente corre este comando en la raíz:
   ```bash
   npm run dev:all
   ```

   Esto abrirá automáticamente:
   - **Aplicación Web**: [http://localhost:3000](http://localhost:3000)
   - **Visor de Base de Datos**: [http://localhost:5555](http://localhost:5555)

---

### Opción 2: Docker (Portabilidad Total)

Si quieres correr esto en cualquier otra computadora sin instalar Node.js, usa Docker.

1. **Requisitos**: Tener Docker Desktop instalado y corriendo.
2. **Ejecutar**:
   ```bash
   docker-compose up --build
   ```
   
   ¡Listo! Podrás acceder a:
   - **Aplicación**: [http://localhost:3000](http://localhost:3000)
   - **Base de Datos**: [http://localhost:5555](http://localhost:5555)

---

##  Credenciales de Acceso

> [!NOTE]
> La base de datos ya incluye un usuario administrador pre-configurado.

### Usuario Administrador
- **Usuario:** `admin` (o `admin@meplansus.com`)
- **Contraseña:** `admin123`

### Crear Nuevos Usuarios
Puedes hacerlo fácilmente desde **Prisma Studio** que ya está corriendo si usaste `npm run dev:all`.

1. Ve a [http://localhost:5555](http://localhost:5555)
2. Selecciona la tabla `User`
3. Agrega un nuevo registro:

> [!TIP]
> **Nota:** Debes ejecutar este comando en una **nueva terminal** sin detener el servidor de la aplicación.

Esto abrirá una interfaz web en `http://localhost:5555` donde puedes:
1. Ir a la tabla `User`
2. Agregar nuevos registros con:
   - `username`: nombre del municipio
   - `password`: contraseña (texto plano en desarrollo)
   - `role`: `USER` o `ADMIN`

## Uso de la Aplicación

### Para Usuarios (Municipios)

1. **Iniciar Sesión**
   - Ingresa con tu usuario y contraseña
   - usuario: admin
   - contraseña: adminpassword

2. **Dashboard**
   - Verás todas las secciones de evaluación disponibles
   - Cada sección muestra el número de preguntas y su peso

3. **Completar Secciones**
   - Haz clic en una sección para responder las preguntas
   - Las respuestas se guardan automáticamente
   - Puedes regresar y modificar respuestas antes de finalizar

4. **Finalizar Evaluación**
   - Una vez completadas todas las secciones, haz clic en "Finalizar Evaluación"
   - Se calculará tu calificación final automáticamente
   - **Nota:** No podrás modificar respuestas después de finalizar

### Para Administradores

1. **Panel Admin**
   - Accede desde el botón "Panel Admin" en el dashboard
   - Visualiza todos los envíos de los municipios
   - Revisa calificaciones y respuestas

##  Características Adicionales

### Tema Claro/Oscuro
- Usa el botón de sol/luna en la esquina superior derecha
- La preferencia se guarda en el navegador

### Modo de Enfoque
- Reduce distracciones visuales
- Actívalo desde los controles de tema

### Progressive Web App (PWA)
- En producción, la app se puede instalar en dispositivos
- Funciona offline con service workers

##  Comandos Útiles

### Desarrollo
```bash
npm run dev          # Inicia servidor de desarrollo
npm run build        # Construye para producción
npm start            # Inicia servidor de producción
```

### Base de Datos
```bash
npx prisma studio              # Abre interfaz visual de la BD
npx prisma generate            # Regenera cliente de Prisma
npx prisma migrate dev         # Crea nueva migración
npx prisma migrate deploy      # Aplica migraciones
```

### Linting
```bash
npm run lint         # Verifica errores de código
```
```


##  Modelo de Datos

### User (Usuario)
- `id`: Identificador único
- `username`: Nombre del municipio
- `password`: Contraseña
- `role`: Rol (USER o ADMIN)

### Section (Sección)
- `id`: Identificador único
- `title`: Título de la sección
- `description`: Descripción
- `weight`: Peso en la calificación (%)
- `order`: Orden de visualización

### Question (Pregunta)
- `id`: Identificador único
- `text`: Texto de la pregunta
- `type`: Tipo (SCALE, BOOLEAN, TEXT)
- `weight`: Peso en la sección
- `sectionId`: Sección a la que pertenece

### Submission (Envío)
- `id`: Identificador único
- `userId`: Usuario que envió
- `status`: Estado (IN_PROGRESS, SUBMITTED)
- `score`: Calificación final

### Answer (Respuesta)
- `id`: Identificador único
- `submissionId`: Envío al que pertenece
- `questionId`: Pregunta respondida
- `value`: Valor de la respuesta
- `score`: Puntaje calculado


