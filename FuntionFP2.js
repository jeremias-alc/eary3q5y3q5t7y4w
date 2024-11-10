// Variables globales
let lists = [];

// Función para mostrar/ocultar secciones
function showSection(sectionId) {
    const sections = ['mainContainer', 'createListContainer', 'listContainer', 'TrashSec', 'helpSection', 'formContainer'];
    sections.forEach(section => {
        document.getElementById(section).style.display = (section === sectionId) ? 'block' : 'none';
    });
}

// Funciones de búsqueda
function toggleSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.style.visibility = searchInput.style.visibility === 'hidden' ? 'visible' : 'hidden';
}

function AskAprod() {
    const AskProduct = document.getElementById('AskProduct');
    AskProduct.style.visibility = AskProduct.style.visibility === 'hidden' ? 'visible' : 'hidden';
}

function searchInList() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase();
    const productoItems = document.querySelectorAll('.producto-item');

    productoItems.forEach(item => {
        const productoNombre = item.querySelector('.producto-nombre').textContent.toLowerCase();
        item.style.display = productoNombre.includes(searchTerm) ? 'flex' : 'none';
    });
}

function searchProducts() {
    const searchInput = document.getElementById('AskProduct');
    const searchTerm = searchInput.value.toLowerCase();
    const productos = document.querySelectorAll('.productos-container .producto-lista li');

    productos.forEach(producto => {
        const productoTexto = producto.textContent.toLowerCase();
        producto.style.display = productoTexto.includes(searchTerm) ? 'flex' : 'none';
    });
}

// Función unificada para crear una nueva lista
function createList() {
    const listName = document.getElementById('listName').value;
    if (listName.trim() !== "") {
        const newList = {
            id: Date.now(),
            name: listName,
            items: []
        };
        lists.push(newList);
        saveLists();
        displayLists();
        document.getElementById('listName').value = '';
        showSection('listContainer');
        
        // Actualizar el título de la lista actual
        const listTitle = document.getElementById('listTitle');
        if (listTitle) {
            listTitle.textContent = listName;
        }
    } else {
        alert('Por favor, ingresa un nombre para la lista.');
    }
}

// Funciones de LocalStorage
function saveLists() {
    localStorage.setItem('shoppingLists', JSON.stringify(lists));
}

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
    const listImage = document.getElementById('listContainerImage');
    if (!listContainer) return;

    listContainer.innerHTML = '';
    
    if (lists.length === 0) {
        if (listImage) {
            listImage.style.display = 'block';
            listImage.style.margin = '0 auto'; // Centra horizontalmente
            listImage.style.maxWidth = '600px'; // Ajusta el ancho máximo si es necesario
            listImage.style.marginTop = '20px';
        }
        return;
    }

    if (listImage && lists.length > 0) {
        listImage.style.display = 'none';
    }

    lists.forEach(list => {
        const listElement = document.createElement('div');
        listElement.className = 'list-card';
        const completedItems = list.items.filter(item => item.completed).length;
        const progressPercentage = list.items.length > 0 ? (completedItems / list.items.length) * 100 : 0;

        listElement.innerHTML = `
            <div class="list-header">
                <h3>${list.name}</h3>
                <p>${list.items.length} items</p>
            </div>
            <div class="progress-container progressbarcolor">
                <div class="progress-bar" style="width: ${progressPercentage}%"></div>
            </div>
            <div class="list-buttons">
                <button onclick="openList(${list.id})" class="btn-open">
                   <i class="fas fa-pencil-alt"></i> 
                </button>
                <button onclick="deleteList(${list.id})" class="btn-delete">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        listContainer.appendChild(listElement);
    });
}

// Función para abrir una lista específica
function openList(listId) {
    const list = lists.find(l => l.id === listId);
    if (list) {
        showSection('createListContainer');
        document.getElementById('listName').value = list.name;
        document.getElementById('listTitle').textContent = list.name;
        displayCurrentItems(list);
    }
}

// Función para mostrar los items de la lista actual
function displayCurrentItems(list) {
    const itemsContainer = document.querySelector('.imageANDproducts-container');
    if (!itemsContainer) return;

    if (list.items.length === 0) {
        itemsContainer.innerHTML = '<img src="CrearListas.jpg" alt="Imagen Crear Listas" class="centered-image">';
        return;
    }

    itemsContainer.innerHTML = '';
    const ul = document.createElement('ul');
    ul.className = 'producto-lista';

    list.items.forEach(item => {
        const li = createProductItem(item);
        ul.appendChild(li);
    });

    itemsContainer.appendChild(ul);
    actualizarBarraProgreso();
}

// Función para crear un elemento de producto
function createProductItem(item) {
    const li = document.createElement('li');
    li.className = 'producto-item';
    li.innerHTML = `
        <div class="checkbox-container">
            <input type="checkbox" id="${item.name.replace(' ', '_')}" ${item.completed ? 'checked' : ''}>
        </div>
        <div class="producto-info">
            <span class="producto-nombre">${item.name}</span>
        </div>
        <div class="producto-icono" onclick="showSection('formContainer')">
            <img src="grocery.png" alt="groceries">
        </div>
    `;

    const checkbox = li.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', () => {
        item.completed = checkbox.checked;
        saveLists();
        actualizarBarraProgreso();
    });

    return li;
}

// Función para eliminar una lista
function deleteList(listId) {
    if (confirm('¿Estás seguro de que deseas eliminar esta lista?')) {
        lists = lists.filter(l => l.id !== listId);
        saveLists();
        displayLists();
    }
}

// Función para agregar un producto a la lista actual
function agregarProducto(nombreProducto) {
    const currentList = getCurrentList();
    if (currentList) {
        // Verificar si el producto ya existe en la lista
        if (!currentList.items.some(item => item.name === nombreProducto)) {
            const newItem = { name: nombreProducto, completed: false };
            currentList.items.push(newItem);
            saveLists();
            displayCurrentItems(currentList);
        }
    } else {
        alert('Por favor, crea o selecciona una lista primero.');
    }
}

// Función para obtener la lista actual
function getCurrentList() {
    const listName = document.getElementById('listName').value;
    return lists.find(l => l.name === listName);
}



// Función para actualizar la barra de progreso
// Completar la función actualizarBarraProgreso
function actualizarBarraProgreso() {
    const currentList = getCurrentList();
    if (currentList) {
        const totalItems = currentList.items.length;
        const completedItems = currentList.items.filter(item => item.completed).length;
        const progressBar = document.querySelector('.progress-bar');
        if (progressBar) {
            const percentage = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;
            progressBar.style.width = `${percentage}%`;
        }
    }
}

// Función para eliminar un producto de la lista
function removeItem(itemName) {
    const currentList = getCurrentList();
    if (currentList) {
        currentList.items = currentList.items.filter(item => item.name !== itemName);
        saveLists();
        displayCurrentItems(currentList);
    }
}

// Función para manejar el formulario de detalles
function handleDetailsForm(itemName) {
    const form = document.getElementById('detailsForm');
    const currentList = getCurrentList();
    const item = currentList.items.find(i => i.name === itemName);

    if (item) {
        // Actualizar detalles del producto
        item.category = form.category.value;
        item.amount = form.amount.value;
        item.unit = form.unit.value;
        item.price = form.price.value;
        item.description = form.description.value;
        
        saveLists();
        showSection('createListContainer');
    }
}

// Event Listeners iniciales
document.addEventListener('DOMContentLoaded', function() {
    loadLists();



    // Event listeners para los productos sugeridos
    const productosLista = document.querySelectorAll('.productos-container .producto-lista li');
    productosLista.forEach(producto => {
        producto.addEventListener('click', function() {
            const nombreProducto = this.textContent.replace('add', '').trim();
            agregarProducto(nombreProducto);
        });
    });

    // Event listeners para búsqueda
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', searchInList);
    }

    const askProduct = document.getElementById('AskProduct');
    if (askProduct) {
        askProduct.addEventListener('input', searchProducts);
    }

    // Event listener para el formulario de detalles
    const detailsForm = document.getElementById('detailsForm');
    if (detailsForm) {
        detailsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleDetailsForm();
        });
    }

    // Event listener para cerrar el formulario
    const closeFormButton = document.getElementById('closeFormButton');
    if (closeFormButton) {
        closeFormButton.addEventListener('click', () => {
            document.getElementById('formContainer').style.display = 'none';
        });
    }
});



// Función para eliminar productos seleccionados cuando se hace clic en el ícono de la papelera
function setupTrashIconListener() {
    const trashIcon = document.querySelector('.icon-container .fa-trash');
    
    
    if (trashIcon) {
        trashIcon.addEventListener('click', function() {
            // Obtener la lista actual
            const currentList = getCurrentList();
            
            if (currentList) {
                // Obtener todos los checkboxes marcados
                const checkedItems = document.querySelectorAll('.checkbox-container input[type="checkbox"]:checked');
                
                if (checkedItems.length === 0) {
                    alert('No hay productos seleccionados para eliminar.');
                    return;
                }

                // Eliminar cada elemento seleccionado en la interfaz y de la lista actual
                checkedItems.forEach(checkbox => {
                    const productoItem = checkbox.closest('.producto-item');
                    
                    if (productoItem) {
                        // Obtener el nombre del producto
                        const productoNombre = productoItem.querySelector('.producto-nombre').textContent;

                        // Eliminar el producto de la lista actual
                        currentList.items = currentList.items.filter(item => item.name !== productoNombre);

                        // Eliminar el elemento de la interfaz
                        productoItem.remove();
                    }
                });

                // Guardar los cambios en LocalStorage
                saveLists();

                const contenedorProductos = document.querySelector('.imageANDproducts-container');
                if (currentList.items.length === 0 && contenedorProductos) {
                    // Limpiar el contenedor y mostrar la imagen inicial
                    contenedorProductos.innerHTML = '';
                    const imagenInicial = document.createElement('img');
                    imagenInicial.src = 'CrearListas.jpg';
                    imagenInicial.classList.add('centered-image');
                    contenedorProductos.appendChild(imagenInicial);
                }

                // Actualizar la barra de progreso o cualquier otra visualización si es necesario
                actualizarBarraProgreso();
            } else {
                alert('No hay ninguna lista seleccionada.');
            }
        });
    } else {
        console.error('El ícono de papelera no se encontró en el DOM.');
    }
}

// Llamar a la función dentro de DOMContentLoaded para asegurarnos de que el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    loadLists();
    
    // Otros event listeners iniciales (botones de crear, búsqueda, etc.)
    // ...

    // Configurar el listener para el ícono de la papelera
    setupTrashIconListener();
});


/*let productos = [];

// Función para cargar productos desde el archivo JSON
function cargarProductos() {
    fetch('productos.json') 
        .then(response => response.json())
        .then(data => {
            productos = data.productos;
            mostrarProductos();
        })
        .catch(error => console.error('Error al cargar productos:', error));
}

// Función para mostrar productos en el contenedor
function mostrarProductos() {
    const productosContainer = document.querySelector('.productos-container .producto-lista');
    
    // Añade un console.log para depuración
    console.log('Productos a mostrar:', productos);
    console.log('Contenedor de productos:', productosContainer);

    if (productosContainer) {
        productosContainer.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevos productos
        productos.forEach(producto => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fas fa-plus-circle"></i> ${producto}`;
            
            // Añade un event listener para agregar el producto cuando se hace clic
            li.addEventListener('click', function() {
                const nombreProducto = this.textContent.replace('add', '').trim();
                agregarProducto(nombreProducto);
            });

            productosContainer.appendChild(li);
        });
    } else {
        console.error('No se encontró el contenedor de productos');
    }
}

// Llama a la función de carga cuando el documento esté listo
document.addEventListener('DOMContentLoaded', cargarProductos);*/