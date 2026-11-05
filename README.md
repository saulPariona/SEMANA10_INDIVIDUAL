# Semana 10 - API REST de productos

Implementación del ejercicio con Node.js LTS, Express y MySQL usando arquitectura MVC.

## 1. Instalación

```powershell
npm install
Copy-Item .env.example .env
```

Edita `.env` con las credenciales locales de MySQL. En XAMPP, normalmente el usuario es
`root`, la contraseña está vacía y el puerto es `3306`.

## 2. Base de datos

Abre phpMyAdmin o la consola de MySQL e importa [database/schema.sql](database/schema.sql).
El script crea `db_lab10`, la tabla `productos` y un registro de ejemplo.

## 3. Ejecución

```powershell
npm run dev
```

La API estará disponible en `http://localhost:3000`.

También puedes abrir `http://localhost:3000/` en el navegador. El formulario envía
un `POST /api/productos` y la tabla carga los datos mediante `GET /api/productos`.

## 4. Endpoints para Postman

| Método | URL | Éxito | Uso |
|---|---|---:|---|
| GET | `/api/health` | 200 | Verificar que el servidor está activo |
| GET | `/api/productos` | 200 | Listar productos |
| GET | `/api/productos/1` | 200 / 404 | Obtener un producto |
| POST | `/api/productos` | 201 | Crear un producto |
| PUT | `/api/productos/1` | 200 / 404 | Actualizar campos enviados |
| DELETE | `/api/productos/1` | 204 / 404 | Eliminar un producto |

Para POST y PUT usa `Content-Type: application/json`.

```json
{
  "nombre": "Mouse inalámbrico",
  "descripcion": "Mouse ergonómico USB",
  "precio": 65.5,
  "stock": 20
}
```

El endpoint PUT permite actualización parcial, aunque conserva el verbo solicitado
por la guía. Las consultas usan parámetros preparados (`?`) para evitar inyección SQL.
Nunca subas `.env`; `.gitignore` ya lo excluye.

## 5. Evidencias sugeridas

1. Captura de `src/config`, `src/controllers` y `src/routes`.
2. Captura de `database/schema.sql` y de la tabla `productos` en phpMyAdmin.
3. Captura de GET con `200`, POST con `201`, un GET inexistente con `404` y una
   petición inválida con `400`.
4. Verifica con `git status` que `.env` no aparezca antes de publicar en GitHub.
