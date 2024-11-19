<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Ejecutar en desarrollo

1. Clonar el repositorio

2. Ejecutar
````
npm i
````
3. Tener Nest CLI instalado
````
npm i -g @nestjs/cli
````
4. Levantar la base de datos
````
docker-compose up -d
````
5. Clonar archivo ```.env.template``` y renombrar copia a ```.env```

6. Levantar el proyecto en dev
````
npm run start:dev
````
7. Reconstruir db con semilla
````
http://localhost:3000/api/v2/seed
````



# Stack utilizado
* MongoDb
* Nest

# Production Build
1. Crear archivo ```.env.prod```
2. Llenar las variables de entorno de producción
3. Crear y configurar ```docker-compose.prod.yaml```
4. Construir la nueva imagen
```
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up --build
```
5. Si se destruye el contenedor pero no hay cambios en la aplicación usaremos este comando
```
docker-compose -f docker-compose.prod.yaml --env-file .env.prod up -d
```

# Notas

  Desplegado en ```Render```
````
https://pokedex-as40.onrender.com/api/v2/pokemon
````