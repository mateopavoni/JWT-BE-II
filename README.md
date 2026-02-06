# JWT-BE-II

Proyecto backend desarrollado como parte del curso de **Backend II**. Implementación de un sistema de **autenticación y autorización** para un e-commerce, utilizando **JWT**, **Passport** y **bcrypt**.

---

## Tecnologías utilizadas

- **Node.js**
- **Express**
- **MongoDB + Mongoose**
- **Passport (Local + JWT)**
- **bcrypt (hashSync)**
- **JSON Web Tokens (JWT)**
- **cookie-parser**
- **dotenv**

---

## Endpoints de la API

### Sessions (`/api/sessions`)

| Método | Ruta                         | Descripción                                      |
|--------|------------------------------|--------------------------------------------------|
| POST   | `/api/sessions/register`     | Registra un nuevo usuario y genera JWT            |
| POST   | `/api/sessions/login`        | Inicia sesión y genera JWT en cookie              |
| GET    | `/api/sessions/current`      | Valida el JWT y retorna los datos del usuario     |
| POST   | `/api/sessions/logout`       | Cierra sesión (limpia la cookie)                  |

### Users - CRUD (`/api/users`)

| Método | Ruta                | Descripción                              |
|--------|---------------------|------------------------------------------|
| GET    | `/api/users/`       | Lista todos los usuarios (admin)         |
| GET    | `/api/users/:uid`   | Obtiene un usuario por ID                |
| PUT    | `/api/users/:uid`   | Actualiza un usuario                     |
| DELETE | `/api/users/:uid`   | Elimina un usuario (admin)               |

---

## Modelo de Usuario

| Campo        | Tipo     | Detalle                          |
|--------------|----------|----------------------------------|
| `first_name` | String   | Requerido                        |
| `last_name`  | String   | Requerido                        |
| `email`      | String   | Requerido, único                 |
| `age`        | Number   | Requerido                        |
| `password`   | String   | Hash con bcrypt                  |
| `cart`       | ObjectId | Referencia a Carts               |
| `role`       | String   | Default: `'user'`                |

---

## Estrategias de Passport

| Estrategia   | Tipo  | Descripción                                                              |
|--------------|-------|--------------------------------------------------------------------------|
| `register`   | Local | Registra usuario nuevo con contraseña hasheada y crea un carrito asociado |
| `login`      | Local | Valida email y contraseña del usuario                                     |
| `current`    | JWT   | Extrae el token de la cookie, valida y retorna el usuario asociado        |

---

## Instalación

```bash
npm install
```

---

## Configuración

Completar las variables en el archivo `.env`:

```env
PORT=8080
MONGO_URI=mongodb+srv://<usuario>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
JWT_SECRET=tu_clave_secreta_jwt
JWT_COOKIE_NAME=coderCookieToken
```

---

## Ejecución

```bash
# Producción
npm start

# Desarrollo (con nodemon)
npm run dev
```

---

## Ejemplo de uso con Postman

**Registro:**
```json
POST /api/sessions/register
Content-Type: application/json

{
    "first_name": "Juan",
    "last_name": "Pérez",
    "email": "juan@mail.com",
    "age": 25,
    "password": "abc123"
}
```

**Login:**
```json
POST /api/sessions/login
Content-Type: application/json

{
    "email": "juan@mail.com",
    "password": "abc123"
}
```

**Current (requiere cookie con JWT):**
```
GET /api/sessions/current
```

---

## Cómo clonar el repositorio

```bash
git clone https://github.com/mateopavoni/JWT-BE-II.git
cd JWT-BE-II
```

---

## Contacto

Creado por **Mateo Pavoni**
[mateopavoni6@gmail.com]