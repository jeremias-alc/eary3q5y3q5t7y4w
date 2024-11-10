/*Conexion entre las funciones*/
function showSection(sectionId) {
    const sections = ['mainContainer', 'createListContainer', 'listContainer', 'TrashSec', 'helpSection', 'formContainer'];
    
    sections.forEach(section => {
        document.getElementById(section).style.display = (section === sectionId) ? 'block' : 'none';
    });
}

//para ponerle el nombre a la lista
function createList() {
    const listName = document.getElementById('listName').value; // Obtiene el nombre de la lista
    const listTitle = document.getElementById('listTitle'); // Selecciona el h2 que será cambiado
    
    if (listName.trim() !== "") {
        listTitle.textContent = listName; // Actualiza el texto del h2
    } else {
        alert('Por favor, ingresa un nombre para la lista.'); // Alerta si el input está vacío
    }
}

/*ocultar y aparecer input contenedor grande*/
function toggleSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput.style.visibility === 'hidden') {
        searchInput.style.visibility = 'visible'; // Muestra el input
    } else {
        searchInput.style.visibility = 'hidden'; // Oculta el input
    }
}

/*ocultar y aparecer input contenedor de los productos*/
function AskAprod() {
    const AskProduct = document.getElementById('AskProduct');
    const lupaButton = document.getElementById('lupa');
    if (AskProduct.style.visibility === 'hidden') {
        AskProduct.style.visibility = 'visible'; // Muestra el input
    } else {
        AskProduct.style.visibility = 'hidden'; // Oculta el input
    }
}  


/**agregar productos */

// Función para agregar un producto a la lista
function agregarProducto(nombreProducto) {
    const imageAndProductsContainer = document.querySelector('.imageANDproducts-container');
    let productoLista = imageAndProductsContainer.querySelector('.producto-lista');

    if (!productoLista) {
        imageAndProductsContainer.innerHTML = `
            <ul class="producto-lista"></ul>
        `;
        productoLista = imageAndProductsContainer.querySelector('.producto-lista');
    }

    const li = document.createElement('li');
    li.className = 'producto-item ';
    li.innerHTML = `
        <div class="checkbox-container">
            <input type="checkbox" id="${nombreProducto.replace(' ', '_')}">
        </div>
        <div class="producto-info">
            <span class="producto-nombre">${nombreProducto}</span>
        </div>
        <div class="producto-icono" onclick="showSection('formContainer')">
            <img src="grocery.png" alt="gorceries">
        </div>
    `;


    productoLista.appendChild(li);

  // Agregar event listener al icono de trash en el icon-container
  document.querySelector('.icon-container .fa-trash').addEventListener('click', function() {
    // Obtener todos los checkboxes marcados
    const checkedItems = document.querySelectorAll('.checkbox-container input[type="checkbox"]:checked');
    
    // Eliminar cada elemento seleccionado
    checkedItems.forEach(checkbox => {
        const productoItem = checkbox.closest('.producto-item');
        if (productoItem) {
            productoItem.remove();
        }
    });

    // Obtener el contenedor de productos
    const contenedorProductos = document.querySelector('.imageANDproducts-container');
    const productosRestantes = contenedorProductos.querySelectorAll('.producto-item');

    // Si no quedan productos, mostrar la imagen inicial
    if (productosRestantes.length === 0) {
        // Limpiar el contenedor
        contenedorProductos.innerHTML = '';
        
        // Crear y agregar la imagen inicial
        const imagenInicial = document.createElement('img');
        imagenInicial.src = 'CrearListas.jpg';
        imagenInicial.classList.add('centered-image');
        contenedorProductos.appendChild(imagenInicial);

        // Reiniciar la barra de progreso
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            progressBar.style.width = '0%';
        }
    } else {
        // Si aún quedan productos, actualizar la barra de progreso normalmente
        actualizarBarraProgreso();
    }
});


    // Actualizar event listeners y la barra de progreso
    inicializarBarraProgreso();
}

function inicializarEventosProductos() {
    const productosLista = document.querySelectorAll('.productos-container .producto-lista li');
    productosLista.forEach(producto => {
        producto.addEventListener('click', function() {
            const nombreProducto = this.textContent.trim();
            agregarProducto(nombreProducto);
        });
    });
}

function actualizarBarraProgreso() {
    const checkboxes = document.querySelectorAll('.checkbox-container input[type="checkbox"]');
    const progressBar = document.querySelector('.progress-bar');
    const totalCheckboxes = checkboxes.length;
    const checkedCheckboxes = Array.from(checkboxes).filter(checkbox => checkbox.checked).length;
    const porcentaje = (checkedCheckboxes / totalCheckboxes) * 100;
    progressBar.style.width = `${porcentaje}%`;
}

function inicializarBarraProgreso() {
    const checkboxes = document.querySelectorAll('.checkbox-container input[type="checkbox"]');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', actualizarBarraProgreso);
    });
    actualizarBarraProgreso(); // Llamar para asegurar el estado inicial
}

document.addEventListener('DOMContentLoaded', function() {
    inicializarEventosProductos();
    inicializarBarraProgreso(); // Asegurarse de iniciar la barra al cargar la página
});


document.addEventListener('DOMContentLoaded', function() {
    // Obtener el botón de cerrar
    const closeFormButton = document.getElementById('closeFormButton');
    // Obtener el contenedor del formulario
    const formContainer = document.getElementById('formContainer');

    // Agregar el evento click al botón
    closeFormButton.addEventListener('click', function() {
        // Ocultar el formulario
        formContainer.style.display = 'none';
    });
});

// Función para el buscador de la lista principal
function searchInList() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase();
    const productoItems = document.querySelectorAll('.producto-item');

    productoItems.forEach(item => {
        const productoNombre = item.querySelector('.producto-nombre').textContent.toLowerCase();
        if (productoNombre.includes(searchTerm)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Función para el buscador de productos
function searchProducts() {
    const searchInput = document.getElementById('AskProduct');
    const searchTerm = searchInput.value.toLowerCase();
    const productList = document.querySelector('.productos-container .producto-lista');
    const productos = productList.getElementsByTagName('li');

    Array.from(productos).forEach(producto => {
        const productoTexto = producto.textContent.toLowerCase();
        if (productoTexto.includes(searchTerm)) {
            producto.style.display = 'flex';
        } else {
            producto.style.display = 'none';
        }
    });
}

// Agregar los event listeners cuando se carga el documento
document.addEventListener('DOMContentLoaded', function() {
    // Event listener para el buscador de la lista principal
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', searchInList);
    }

    // Event listener para el buscador de productos
    const askProduct = document.getElementById('AskProduct');
    if (askProduct) {
        askProduct.addEventListener('input', searchProducts);
    }
});


/**front para almacenar listas */

// Variables globales
let lists = [];

// Función para crear una nueva lista
function createList() {
    const listName = document.getElementById('listName').value;
    if (listName.trim() !== "") {
        const newList = {
            id: Date.now(), // Usamos la fecha actual como ID único
            name: listName,
            items: []
        };
        lists.push(newList);
        saveLists();
        displayLists();
        document.getElementById('listName').value = ''; // Limpiar el input
        showSection('listContainer'); // Mostrar la sección de listas
    } else {
        alert('Por favor, ingresa un nombre para la lista.');
    }
}

// Función para guardar las listas en localStorage
function saveLists() {
    localStorage.setItem('shoppingLists', JSON.stringify(lists));
}

// Función para cargar las listas desde localStorage
function loadLists() {
    const savedLists = localStorage.getItem('shoppingLists');
    if (savedLists) {
        lists = JSON.parse(savedLists);
        displayLists();
    }
}

// Función para mostrar las listas en el contenedor
function displayLists() {
    const listContainer = document.getElementById('savedLists');
    listContainer.innerHTML = ''; // Limpiar el contenedor

    lists.forEach(list => {
        const listElement = document.createElement('div');
        listElement.className = 'list-card';
        listElement.innerHTML = `
            <div class="list-header">
                <h3>${list.name}</h3>
                <p>${list.items.length} items</p>
            </div>
            <div class="progress-container">
                <div class="progress-bar" style="width: 0%"></div>
            </div>
            <div class="list-buttons">
                <button onclick="openList(${list.id})" class="btn-open">Abrir</button>
                <button onclick="deleteList(${list.id})" class="btn-delete">Eliminar</button>
            </div>
        `;
        listContainer.appendChild(listElement);
    });
}

// Función para abrir una lista específica
function openList(listId) {
    const list = lists.find(l => l.id === listId);
    if (list) {
        // Mostrar la sección de crear lista pero con los items existentes
        showSection('createListContainer');
        document.getElementById('listName').value = list.name;
        
        // Aquí puedes mostrar los items de la lista
        const itemsContainer = document.getElementById('selectedItems');
        itemsContainer.innerHTML = '';
        list.items.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'selected-item';
            itemElement.innerHTML = `
                <span>${item}</span>
                <button onclick="removeItem('${item}', ${listId})">×</button>
            `;
            itemsContainer.appendChild(itemElement);
        });
    }
}

// Función para eliminar una lista
function deleteList(listId) {
    if (confirm('¿Estás seguro de que deseas eliminar esta lista?')) {
        lists = lists.filter(l => l.id !== listId);
        saveLists();
        displayLists();
    }
}

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    loadLists();

    // Conectar el botón "Crear" con la función createList
    document.getElementById('create').addEventListener('click', createList);
});

