# Biblioteca Digital — Taller ORM

API REST para gestión de una biblioteca digital construida con **NestJS + TypeORM + PostgreSQL (Supabase)**.

---

## Requisitos previos

- Node.js v18 o superior
- npm
- Proyecto creado en [Supabase](https://supabase.com)

---

## Instalación y configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Configurar variables de entorno

Copiar el archivo de ejemplo y completar con las credenciales de Supabase:

```bash
cp .env.example .env
```

Los datos de conexión se encuentran en el proyecto de Supabase en:
**Settings → Database → Session Pooler**

```env
DB_HOST=aws-1-us-east-2.pooler.supabase.com
DB_PORT=5432
DB_USERNAME=postgres.tu_project_ref
DB_PASSWORD=tu_password
DB_NAME=postgres
DB_SSL=true
PORT=3001
```

### 3. Crear las tablas (migraciones)

```bash
npm run migration:run
```

Esto crea en orden: `autores` → `usuarios` → `libros` → `libros_autores` → `prestamos`, y carga los datos de prueba (seed).

### 4. Iniciar el servidor

```bash
npm run start:dev
```

---

## Documentación interactiva (Swagger)

Con el servidor corriendo, abre en el navegador:

```
http://localhost:3001/docs
```

Desde ahí podés probar todos los endpoints sin necesidad de Postman.

---

## Endpoints disponibles

### Autores
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/autores` | Listar todos |
| GET | `/autores/:id` | Obtener uno |
| POST | `/autores` | Crear |
| PUT | `/autores/:id` | Actualizar |
| DELETE | `/autores/:id` | Eliminar |

### Libros
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/libros` | Listar activos (con autores, sin N+1) |
| GET | `/libros/:id` | Obtener uno |
| POST | `/libros` | Crear con autores |
| PUT | `/libros/:id` | Actualizar |
| DELETE | `/libros/:id` | Eliminar |

### Usuarios
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/usuarios` | Listar todos |
| GET | `/usuarios/:id` | Obtener uno |
| POST | `/usuarios` | Crear |
| PUT | `/usuarios/:id` | Actualizar |
| DELETE | `/usuarios/:id` | Eliminar |

### Préstamos
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/prestamos` | Listar todos |
| GET | `/prestamos/activos` | Solo préstamos sin devolver |
| GET | `/prestamos/:id` | Obtener uno |
| POST | `/prestamos` | Crear préstamo (transacción atómica) |
| PATCH | `/prestamos/:id/devolucion` | Registrar devolución (transacción atómica) |

---
