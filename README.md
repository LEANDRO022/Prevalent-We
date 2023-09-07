# Boilerplate-web

## Name

Boilerplate Web

## Description

Este proyecto está destinado a la creación rápida de los proyectos de prevalentware, se recomienda actualizar a las ultimas versiones constantemente para estar a la vanguardia de las tecnologías.
Entre lo usado tenemos :

Apollo
Next js
Tailwind
Prisma
Aurora
Auth0
NextAuth
SES
Custom Resolvers
Hooks y Contexts
Componentes genéricos

## Requirements

Base de datos con usuario con permisos de creación de tablas y base de datos (de no tener el ultimo usar shadow_Database) y su respectivo string de conexión
Poder usar Yarn
Tener un proyecto creado en gitlab - github
Cuenta de amazon SES con sus respectivas credenciales
Tener un tenant de auth0 creado (si no se tiene creado - en la esquina superior derecha hacen clic en su tenant y luego en create tenant . Si luego quieren cambiar entre los dashboards de los diferentes tenants se dirigen al mismo menú pero esta vez seleccionan switch tenant . )
en el panel de auth0 , en applications , dar click en el botón "create application" y crear una que se llame Portal y seleccionar en las cards de abajo que será de tipo single page application
en el application portal recien creado, dirigirse a settings, dirigirse a allowed callback urls y poner http://localhost:3000/api/auth/callback/auth0 y guardar cambios
Dirigires al sideBar en la sección de application/application y crear una nueva dando click en el botón "create application" (si , es otra application diferente) , la siguiente se debe llamar "API USERS NombreDeproyecto" y en los cards de abajo seleccionar que sea de tipo Machine to Machine , posteriormente saldrá una ventana en la que seleccionaras la única api que esté en el dropdown y luego seleccionarás "All" para dar todos los permisos y dar al botón de autorizar.

## Installation

Usaremos Yarn como manejador de paquetes.
Cambiar en el package.json el nombre del proyecto(linea 2) y el link del repositorio(linea 5) y el autor(linea 6) a conveniencia
git init
yarn init
yarn install
yarn prepare
Crear archivo .env en el root del proyecto con string de conexión a db en variable database_url como se muestra en el .env.example
ejecutar yarn aurora (solo para rectificar que funcione correctamente)
ejecutar yarn cosmo (generamos base para custom resolvers )
ejecutar en la consola npx prisma migrate deploy para aplicar la migración ya existente a la db
añadir variables de entorno obtenidas del application portal en el .env
AUTH0_CLIENT_ID = se obtiene de el application portal - settings
AUTH0_CLIENT_SECRET = se obtiene de el application portal - settings
AUTH0_DOMAIN = se obtiene de el application portal - settings
NEXTAUTH_URL = "http://localhost:3000/"
NEXTAUTH_SECRET ="http://localhost:3000/"
ir a la carpeta utils/api y reemplazar en la variable dominioAuth0 el valor de el dominio del tenant creado anteriormente en todo el archivo (control F - control H)
tambien , buscar la función getAuth0Token y reemplazar client_id y client_secret de la application de users en auth0 creada anteriormente
para el envio correcto de emails,revisar en el .env las variables de entorno que comienzen por email, se está usando el servicio de amazon SES , para modificar la plantilla de email ir a la carpeta pages/api/sendmail y modificar el html de envío
recuerda crear roles para poder usar la vista de usuarios a plenitud, puedes usar npx prisma studio para esto.

## Customización

Aquí se exponen los pasos para customizar los diseños default del boilerplate

Para modificar el background-color del boiler plate, dirigirse a globals.scss y modificar la clase .background-app ,lo mismo con el background del sidebar en la clase css background-sidebar-dark,
para el resto de colores se crearon estilos reutilizables en globals.scss en la carpeta Styles y en el tailwind.config.js
ya vienen por defecto configuradas 3 fonts, si deseas reemplazar ya sea la primaria, secundaria o terciaria puedes ir a la carpeta public/fonts y cambiarlas (recuerda la extensión)
los links del sidebar se modificarán en la ruta components/Layout, donde en el elemento arrayLinks podrás modificarlos
El proyecto viene por defecto con la vista de usuarios y estilos predeterminados, sientete libre de cambiarlos como se desee

## Despliegue

Este paso a paso solo lo puede realizar un lider de proyecto

1. crear proyecto en vercel
2. ir al proyecto en gitlab y dirigirse a settings/general/ci-cd/variables y cambiar la clave SSH
3. en el gitlab-ci de este proyecto, reemplazar "git@gitlab.com:prevalentware/boilersplate/webboiler.git"
   por el git clone del respectivo proyecto en ssh
4. hacer yarn build en el proyecto y un commit con un push para desplegarlo de manera automática

## Authors and acknowledgment

Jesús García Barrera @JesusGarciaB9

## Project status

V1.0
