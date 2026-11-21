# Entrega proyecto final ITI
## Federico Tropiane TB2

### Profesor, en este archivo va a encontrar todo lo relacionado a la app, la informacion sobre el proyecto estará en el PDF correspondiente, espero cumplir las pautas.

### Frontend

El frontend es basico, HTML, CSS y JS. No utilicé frameworks como React o Angular, ya que es un proyecto chico.
Todo el funcionamiento en cuanto a formularios, tarjetas, botones e interacción con el backend, esta todo realizado en el archivo app.js, el HTL solo renderiza los datos traidos desde el backend.

Para inicializar la app, basta con hacer doble clic en index.html

### Backend

 #### Herramientas:NodeJS, Express, CookieParser, Cors,JWT, Bcrypt

El proyecto mantiene una arquitectura modular, en donde cada modulo es independiente de otro en cuanto a logica y manejo de datos, no hay información cruzada de dependa de un modulo externo.
Los modulos tienen la siguiente secuencia de acceso: DAO > Service >  Controller > Router > Server > App.

DAO (Data Access Object): Este archivo es el unico que mantiene contacto con la  base de datos, es su unica funcion.
Service: Contiene logica, validacion de datos y manejo de errores, mantiene contacto con el DAO para enviar datos limpios o modificados.
Controller: Obtiene datos desde el frontend y envia respuesta segun la respuesta obtenida por el Service. Este archivo no tiene logica ni maneja errores.
Router: Define los endpoints del modulo y maneja las respuesta del Controller.
Server: Mantiene activas las herramientas necesarias para el funcionamiento del backend, las rutas y el puerto del servidor.
App: Archivo principal donde se ejectuan todas las funciones de Server.

#### Consultas SQL:
Las consultas se encontrarán en el DAO de cada modulo.

#### Seguridad:
Las consultas y endpoint estan controlados por el modulo Middlewares. Este modulo se encarga de verificar que el usuario que hace la consulta tenga acceso de Administrador o Usuario, segun corresponda.
¿Como se verifica esto? Al iniciar sesion, se almacena un token de acceso creado con JWT. Al tratarse de un sistema de pruebas y trabajo interno, el token se almacena en el LocalStorage o Cookies, para mayor facilidad y menos logica en el backend, ya que no dispongo de tiempo suficiente para aplicar el estadar OAuth 2.0.

#### Iniciar el servidor:
Para activar el servidor, tenes que posicionarte en la carpeta "/backend" desde un terminal y ejecutar:
- npm install
- tsc
- cd dist (para posicionarte en la carpeta Dist)
- node app.js

De esta forma el servidor va a estar corriendo en el puerto 3000.

### La información sobre la base de datos, nombre, contraseña, nombre de la DB, puerto y demas información, están todos en el archivo example.env, igualmente, en caso de no modificarse, se van a utilizar los datos hardcodeados que estan en /src/config/env.

#### archivo env: Tiene una variable ENV que obtiene todas las variables de entorno necesarias y en caso de no estar asignada, le asigna una de forma hardcodeada.