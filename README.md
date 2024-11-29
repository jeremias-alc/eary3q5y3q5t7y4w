Documentación del Proyecto JavySorts

Índice
Descripción del Proyecto
Tecnologías Utilizadas
Estructura del Proyecto
Instalación y Configuración
Uso de la Aplicación
Funciones del Frontend
Funciones del Backend
API REST
Contribuciones
Licencia

Descripción del Proyecto

JavySorts es una aplicación web diseñada para ayudar a los usuarios a crear y gestionar l
istas de compras de productos de supermercado. Permite a los usuarios crear listas, agregar productos,
editar detalles de los productos y visualizar el progreso de sus compras. La aplicación está dividida en un
frontend y un backend, donde el frontend se encarga de la interfaz de usuario y la interacción, mientras que
el backend gestiona la lógica de negocio y el almacenamiento de datos.

Tecnologías Utilizadas

Frontend
HTML
CSS
JavaScript
Frameworks: jQuery (opcional)
Librerías: jsPDF (para la generación de PDFs), Font Awesome (para los iconos)

Backend
Node.js
Express.js
MongoDB (como base de datos)
Mongoose (para la interacción con MongoDB)

Estructura del Proyecto: asi lo tenia antes de subir a github puedes tenerlo de la misma forma o unirlos y cambiar direcciones

/Escritorio
│
├── /frontend
│   ├── index.html
│   ├── StyleFP.css
│   ├── FuntionFP.js
│   ├── FuntionFrontE.js
│   ├── FormsStyle.css

│   ├── CrearListas.jpg
│   ├── CrearListas.png
│   ├── grocery.png
│   ├── ListasCreadas.jpg
│   ├── LogoBody.png
│   ├── LogoHeader.png
│   ├── LogoJavySorts.png
│   ├── Trash.jpg
│   └── ...
│
└── /Node API
    ├── models
    │   ├── List.js
    │   └── productModel.js
    ├── server.js
    ├── package.json
    └── ...
    
Instalación y Configuración
Requisitos Previos
Node.js y npm (Node Package Manager) instalados en tu máquina.
MongoDB instalado y en ejecución.

Instalación
Clona el repositorio:
git clone <url-del-repositorio>
cd JavySorts

Instala las dependencias:
Configura la conexión a la base de datos MongoDB en el archivo server.js.

Inicia el servidor:

Uso de la Aplicación
Crear una Nueva Lista: En la sección "Crear Nueva Lista", ingresa el nombre de la lista y haz clic en "Crear".
Agregar Productos: Busca productos en la sección "Agregar productos" y añádelos a la lista.
Visualizar Progreso: La barra de progreso se actualizará automáticamente a medida que se marquen los productos como completados.
Modificar Productos: Selecciona un producto para editar sus detalles.
Imprimir Lista: Utiliza el icono de imprimir para generar un PDF de la lista actual.

Funciones del Frontend

Interfaz de usuario intuitiva para crear y gestionar listas.
Funcionalidad de búsqueda para encontrar productos rápidamente.
Generación de PDF para la lista de compras.
Visualización del progreso de la lista de compras.

Funciones del Backend

API RESTful para gestionar listas y productos.
Conexión a MongoDB para almacenamiento de datos.
Rutas para CRUD (Crear, Leer, Actualizar, Eliminar) operaciones en listas y productos.
API REST
Rutas Principales

Listas

GET /lists: Obtener todas las listas.
POST /lists: Crear una nueva lista.
PUT /lists/:id: Actual
