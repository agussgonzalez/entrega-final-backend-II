<h1 align="center">Welcome to Segunda PreEntrega de backend :)) 👋</h1> <p> <img alt="Version" src="https://img.shields.io/badge/version-1.1.0-blue.svg?cacheSeconds=2592000" /> <a href="#" target="_blank"> <img alt="License: ISC" src="https://img.shields.io/badge/License-ISC-yellow.svg" /> </a> </p>
En esta entrega, se han realizado varias mejoras en la funcionalidad del sistema, incluyendo la visualización y eliminación de productos en tiempo real, la adición de productos desde el front-end, gestión de carritos, paginación de productos, integración de MongoDB Atlas como base de datos, y manejo de tickets de compra. Además, hemos agregado autenticación por roles para usuarios y administradores. Aquí te dejamos algunos detalles sobre cómo interactuar con el sistema.

Nuevas Funcionalidades
Visualización en tiempo real de productos: Dirígete a localhost:8080/realtimeproducts para ver y eliminar productos en tiempo real utilizando WebSockets. Recuerda haber instalado las dependencias (npm install) y ejecutado el servidor (npm run dev).

Agregar productos desde el DOM: Para añadir productos, accede a localhost:8080/products/add, completa el formulario y vuelve a localhost:8080/realtimeproducts para ver cómo se cargan los nuevos productos en tiempo real.

Vistas de productos y carritos: Se han implementado vistas dedicadas para la gestión de productos y carritos de compra. Puedes acceder a la vista de productos en localhost:8080/products y a la vista del carrito en localhost:8080/cart.

Consultas con parámetros (Query Params): Ahora puedes realizar consultas utilizando parámetros como limit, page, sort, y filtros específicos para productos. Ejemplo:

bash
http://localhost:8080/api/products?limit=10&page=1&sort=asc&query={"category":"Tech"}
Paginación y ordenamiento: Los productos ahora se presentan con paginación y puedes ordenar los resultados en ascendente o descendente.

Manejo de tickets: Se ha añadido un sistema de tickets para gestionar compras. Los usuarios pueden generar tickets al finalizar su compra. Accede a localhost:8080/tickets para visualizar los tickets generados.

Autenticación con Passport:

Se ha añadido autenticación de usuarios y administradores.
Los administradores tienen acceso a funcionalidades adicionales como la ruta de realtimeproducts.
Instalación
sh
npm install
Uso
Ejecutar el servidor:

sh
npm run dev
Conectar a MongoDB Atlas: Asegúrate de tener configurada la variable de entorno MONGO_URI con la URL de conexión a MongoDB Atlas en el archivo .env.

Navegar por la aplicación:

localhost:8080/products: Ver productos con paginación.
localhost:8080/realtimeproducts: Visualización y eliminación de productos en tiempo real.
localhost:8080/cart: Vista de carrito.
localhost:8080/products/add: Agregar productos.
localhost:8080/tickets: Gestión de tickets de compra.
Autor
👤 Agustin

Github: @agussgonzalez
LinkedIn: @Agustin Gonzalez
Muestra tu apoyo
¡Dale una ⭐️ a este proyecto si te fue útil!

This README was generated with ❤️ by readme-md-generator