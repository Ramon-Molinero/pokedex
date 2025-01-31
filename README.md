<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Pokedex API 🚀

API RESTful construida con **NestJS** y **MongoDB**, diseñada para manejar información sobre pokémon. Proporciona funcionalidades de consulta, creación y eliminación de registros en la base de datos. Ideal para integraciones en proyectos de desarrollo.

---

## **Características principales** 🌟

- ✏️ **Gestión de Pokémons**: Crear, listar, actualizar y eliminar pokémons.
- 🔗 **Integración con PokeAPI**: Inicializa la base de datos con información de la API pública.
- 🔄 **Semillas de datos**: Herramientas para reconstruir la base de datos rápidamente.
- 📦 **Construcción optimizada**: Soporte para entornos de desarrollo y producción.

---

## **Requisitos previos** 📋

- **Node.js** y **npm** instalados.
- **Nest CLI** instalado:
  ```bash
  npm i -g @nestjs/cli
  ```
- **Docker** para manejar la base de datos MongoDB.

---

## **Pasos de instalación** ⚙️

1. **Clonar el repositorio**
```bash
git clone https://github.com/ramon-molinero/pokedex-api.git && cd pokedex-api
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**

Clonar el archivo de ejemplo `.env.template` y renombrarlo a `.env`, ajustando los valores necesarios:
```bash
cp .env.template .env
```

4. **Levantar la base de datos con Docker**
```bash
docker-compose up -d
```
Esto creará un contenedor MongoDB accesible en `localhost:27017`.

5. **Ejecutar en desarrollo**
```bash
npm run start:dev
```

6. **Reconstruir la base de datos (opcional)**
Visita la siguiente URL para ejecutar las semillas de datos:
```bash
http://localhost:3000/api/v2/seed
```

---

## **Comandos útiles** 💻

**Levantar el servidor en producción**

1. Crear el archivo `.env.prod` con las variables de entorno de producción.
2. Construir la imagen Docker:
```bash
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build
```
3. Para levantar el contenedor sin construir nuevamente:
```bash
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up -d
```

---

## **Stack de tecnologías** 🛠️

- **NestJS**: Framework backend robusto.
- **MongoDB**: Base de datos NoSQL.
- **Docker**: Contenedorización de servicios.
- **Axios**: Cliente HTTP.
- **Mongoose**: ODM para la gestión de la base de datos.

---

## **Endpoints principales** 🔍

- **GET** `/api/v2/pokemon`: Listar pokémons.
- **POST** `/api/v2/pokemon`: Crear nuevo pokémon.
- **PATCH** `/api/v2/pokemon/:id`: Actualizar pokémon.
- **DELETE** `/api/v2/pokemon/:id`: Eliminar pokémon.

---

## **Notas** 📚

El proyecto está desplegado en **Render** y puede ser accesible en:
```bash
https://pokedex-as40.onrender.com/api/v2/pokemon
```
