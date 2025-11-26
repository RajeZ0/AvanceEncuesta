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

##  Tecnologías Utilizadas

### Frontend
- **Next.js 15** - Framework de React con App Router
- **React 19** - Biblioteca de interfaz de usuario
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Framework de estilos
- **Lucide React** - Iconos

### Backend
- **Prisma** - ORM para base de datos
- **SQLite** - Base de datos (desarrollo)
- **Next.js API Routes** - Endpoints del servidor



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

##  Instalación y Despliegue en Localhost

### Prerrequisitos

Antes de comenzar, asegúrate de tener instalado:

1. **Node.js** (versión 18 o superior)
   - Descarga desde: https://nodejs.org/
   - Verifica la instalación:
     ```bash
     node --version
     npm --version
     ```

2. **Git** (opcional, para clonar el repositorio)
   - Descarga desde: https://git-scm.com/

### Paso 1: Obtener el Proyecto

Si tienes Git instalado:
```bash
git clone <url-del-repositorio>
cd "Avance Proyecto"
```

O simplemente descarga y extrae el archivo ZIP del proyecto.

### Paso 2: Navegar a la Carpeta Frontend

```bash
cd front
```

### Paso 3: Instalar Dependencias

Instala todas las dependencias del proyecto:

```bash
npm install
```

Este comando descargará e instalará todas las bibliotecas necesarias listadas en `package.json`. Puede tomar algunos minutos.

### Paso 4: Configurar Variables de Entorno

El archivo `.env` ya debe estar configurado con:

```env
DATABASE_URL="file:../back/dev.db"
```

Esta ruta apunta a la base de datos SQLite en la carpeta `back`.

### Paso 5: Generar el Cliente de Prisma

Genera el cliente de Prisma que permite interactuar con la base de datos:

```bash
npx prisma generate
```

### Paso 6: Ejecutar Migraciones (Primera vez)

Si es la primera vez que ejecutas el proyecto, aplica las migraciones de la base de datos:

```bash
npx prisma migrate deploy
```

### Paso 7: Poblar la Base de Datos (Opcional)

Para crear datos de ejemplo (secciones y usuario admin):

1. Inicia el servidor de desarrollo (ver Paso 8)
2. Abre tu navegador y visita:
   ```
   http://localhost:3000/api/seed
   ```

Esto creará:
- Secciones de ejemplo con preguntas
- Usuario administrador:
  - **Usuario:** `admin`
  - **Contraseña:** `adminpassword`

### Paso 8: Iniciar el Servidor de Desarrollo

Ejecuta el servidor de desarrollo:

```bash
npm run dev
```

Verás un mensaje similar a:

```
▲ Next.js 15.x.x
- Local:        http://localhost:3000
- Ready in X.Xs
```

### Paso 9: Acceder a la Aplicación

Abre tu navegador web y visita:

```
http://localhost:3000
```

La aplicación te redirigirá automáticamente a la página de login.

##  Credenciales de Acceso

### Usuario Administrador (después del seed)
- **Usuario:** `admin`
- **Contraseña:** `adminpassword`

### Crear Nuevos Usuarios

Los nuevos usuarios deben crearse directamente en la base de datos. Puedes usar Prisma Studio:

```bash
npx prisma studio
```

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


