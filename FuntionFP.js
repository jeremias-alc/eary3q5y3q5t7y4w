// Variables globales
let lists = [];
let list = [];


async function actualizarListaEnBackend(list) {
    if (!list || !list.id) {
        console.error("Error: La lista no es válida o no tiene un ID.");
        return;
    }

    try {
        await fetch(`http://localhost:3000/lists/${list.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: list.items }),
        });
        console.log(`Lista con ID ${list.id} actualizada en el backend.`);
    } catch (error) {
        console.error("Error al actualizar la lista en el backend:", error);
    }
}



function createList() {
    const listName = document.getElementById('listName').value;
    if (listName.trim() !== "") {
        const newList = {
            name: listName,
            items: []
        };

        fetch('http://localhost:3000/lists', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newList),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Lista creada:', data);

            const transformedList = { ...data, id: data._id };
            delete transformedList._id; 

            
            lists.push(transformedList);
            displayLists();
        })
        .catch((error) => {
            console.error('Error al crear la lista:', error);
        });

        
        document.getElementById('listName').value = '';
        showSection('listContainer');
    } else {
        alert('Por favor, ingresa un nombre para la lista.');
    }
}


async function saveLists(list) {
    if (!list || !list.id) {
        console.error("Error: La lista no es válida o no tiene un ID.");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/lists/${list.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(list), // Envía la lista actualizada
        });

        if (!response.ok) {
            throw new Error(`Error al actualizar la lista: ${response.status}`);
        }

        console.log(`Lista con ID ${list.id} actualizada en el backend.`);
    } catch (error) {
        console.error("Error al actualizar la lista en el backend:", error);
    }
}


document.addEventListener('DOMContentLoaded', function () {
    loadLists(); 
});

function loadLists() {
    fetch('http://localhost:3000/lists')
        .then(response => response.json())
        .then(data => {
            lists = data.map(list => ({
                ...list,
                items: initializeCompleted(list.items) 
            }));
            displayLists();
        })
        .catch(error => console.error('Error al cargar listas:', error));
}

function initializeCompleted(items) {
    return items.map(item => ({
        ...item,
        completed: item.completed ?? false 
    }));
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
            listImage.style.margin = '0 auto'; 
            listImage.style.maxWidth = '600px'; 
            listImage.style.marginTop = '20px';
        }
        return;
    }

    if (listImage) {
        listImage.style.display = 'none';
    }

    // Renderizar cada lista
    lists.forEach(list => {
        
        if (!list.id) {
            console.error('Error: La lista no tiene un campo id:', list);
            return;
        }
        
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
                <button onclick="openList('${list.id}')" class="btn-open">
                   <i class="fas fa-pencil-alt"></i> 
                </button>
                <button onclick="deleteList('${list.id}')" class="btn-delete">
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
    li.setAttribute('data-id', item._id || item.id);
    li.innerHTML = `
        <div class="checkbox-container">
            <input type="checkbox" class="item-checkbox" ${item.completed ? 'checked' : ''}>
        </div>
        <div class="producto-info">
            <span class="producto-nombre">${item.name}</span>
            <p>Categoría: ${item.category || ''}, 
               Cantidad: ${item.amount || ''},
               Unidad: ${item.unit || ''},
               Precio: $${item.price || ''}, 
               Descripción: ${item.description || ''}</p>
        </div>
        <div class="producto-icono" onclick="openDetailsForm('${item._id || item.id}')">
            <img src="grocery.png" alt="groceries">
        </div>
    `;

    const checkbox = li.querySelector('input[type="checkbox"]');
    checkbox.addEventListener('change', () => {
        item.completed = checkbox.checked;
    
        
        fetch(`http://localhost:3000/products/${item._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ completed: item.completed })
        })
        .then(response => response.json())
        .then(() => {
            actualizarBarraProgreso(); 
        })
        .catch(error => console.error('Error al actualizar el producto:', error));
    });
    return li;
}

// Función para abrir el formulario de detalles y cargar los datos del producto
function openDetailsForm(productId) {
    const currentList = getCurrentList(); 
    const item = currentList.items.find(i => i._id === productId || i.id === productId);

    if (item) {
       
        document.getElementById('category').value = item.category || '';
        document.getElementById('amount').value = item.amount || '';
        document.getElementById('unit').value = item.unit || '';
        document.getElementById('price').value = item.price || '';
        document.getElementById('description').value = item.description || '';


        document.getElementById('formContainer').style.display = 'block';


        const form = document.getElementById('detailsForm');
        form.onsubmit = function(event) {
            event.preventDefault(); 

            
            item.category = form.category.value;
            item.amount = form.amount.value;
            item.unit = form.unit.value;
            item.price = form.price.value;
            item.description = form.description.value;

            
            fetch(`http://localhost:3000/products/${item._id || item.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(item),
            })
            .then(response => response.json())
            .then(updatedItem => {
            
                const productElement = document.querySelector(`.producto-item[data-id="${updatedItem._id || updatedItem.id}"]`);
                if (productElement) {
                    const detailsParagraph = productElement.querySelector('.producto-info p');
                    if (detailsParagraph) {
                        detailsParagraph.textContent = `
                            Categoría: ${updatedItem.category || ''}, 
                            Cantidad: ${updatedItem.amount || ''} ${updatedItem.unit || ''}, 
                            Unidad: ${updatedItem.unit || ''},
                            Precio: $${updatedItem.price || ''}, 
                            Descripción: ${updatedItem.description || ''}`;
                    }
                }

                
                form.reset();
                document.getElementById('formContainer').style.display = 'none';
            })
            .catch(error => console.error('Error al actualizar el producto:', error));
        };
    } else {
        console.error("Producto no encontrado:", productId);
    }
}



function deleteList(id) {
    console.log("Intentando eliminar la lista con ID:", id);

    if (!id) {
        console.error('Error: El ID de la lista es inválido o no fue proporcionado.');
        return;
    }

    if (!confirm('¿Estás seguro de que deseas eliminar esta lista?')) return;

    fetch(`http://localhost:3000/lists/${id}`, {
        method: 'DELETE',
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error(`Error al eliminar la lista: ${response.status}`);
        }
        return response.json();
    })
    .then(() => {
        console.log(`Lista con ID ${id} eliminada del backend`);
        
        lists = lists.filter((list) => list.id !== id);
        displayLists(); 
    })
    .catch((error) => console.error('Error al eliminar la lista:', error));
}


function agregarProducto(nombreProducto) {
    if (!nombreProducto || nombreProducto.trim() === "") {
        alert("El nombre del producto no es válido.");
        return;
    }

    const currentList = getCurrentList(); 
    if (!currentList) {
        alert("Por favor, selecciona o crea una lista primero.");
        return;
    }

    // Buscar o crear el producto en el backend
    fetch(`http://localhost:3000/products?name=${encodeURIComponent(nombreProducto)}`)
        .then(response => {
            if (!response.ok) {
                if (response.status === 404) {
                    
                    return fetch(`http://localhost:3000/products`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ name: nombreProducto, category: "Otros", price: 0 }),
                    }).then(res => res.json());
                } else {
                    throw new Error("Error al buscar el producto.");
                }
            }
            return response.json();
        })
        .then(product => {
            if (!product || !product._id) {
                throw new Error("Error al obtener o crear el producto.");
            }

            
            currentList.items.push(product._id);
            return fetch(`http://localhost:3000/lists/${currentList.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items: currentList.items }),
            });
        })
        .then(response => response.json())
        .then(updatedList => {
            console.log("Lista actualizada:", updatedList);

            
            displayCurrentItems(updatedList);
        })
        .catch(error => {
            console.error("Error al agregar producto:", error);
        });
}




// Función para obtener la lista actual
function getCurrentList() {
    const listName = document.getElementById('listName').value;
    return lists.find(l => l.name === listName);
}



// Función para actualizar la barra de progreso
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

function removeItem(itemName) {
    const currentList = getCurrentList();
    if (currentList) {
        currentList.items = currentList.items.filter(item => item.name !== itemName);

        // Actualizar la lista en el backend
        fetch(`http://localhost:3000/lists/${currentList.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ items: currentList.items }),
        })
        .then(response => response.json())
        .then(data => {
            console.log('Producto eliminado:', data);
            loadLists(); // Cargar las listas nuevamente
        })
        .catch((error) => {
            console.error('Error:', error);
        });
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
        trashIcon.addEventListener('click', async function () {
           
            const currentList = getCurrentList();

            if (currentList) {
                // Obtener todos los checkboxes marcados
                const checkedItems = document.querySelectorAll('.checkbox-container input[type="checkbox"]:checked');

                if (checkedItems.length === 0) {
                    alert('No hay productos seleccionados para eliminar.');
                    return;
                }

                
                const productosAEliminar = [];

               
                checkedItems.forEach(checkbox => {
                    const productoItem = checkbox.closest('.producto-item');

                    if (productoItem) {
                        const productoNombre = productoItem.querySelector('.producto-nombre').textContent;
                       
                        productosAEliminar.push(productoNombre);
                        
                        currentList.items = currentList.items.filter(item => item.name !== productoNombre);

                        productoItem.remove();
                    }
                });

             
                saveLists();

                // Actualizar el backend eliminando los productos seleccionados
                try {
                    await fetch(`http://localhost:3000/lists/${currentList.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ items: currentList.items }), 
                    });

                    console.log(`Productos eliminados del backend: ${productosAEliminar.join(', ')}`);
                } catch (error) {
                    console.error('Error al eliminar productos del backend:', error);
                }

                // Si no quedan productos, mostrar la imagen inicial
                const contenedorProductos = document.querySelector('.imageANDproducts-container');
                if (currentList.items.length === 0 && contenedorProductos) {
                    contenedorProductos.innerHTML = '';
                    const imagenInicial = document.createElement('img');
                    imagenInicial.src = 'CrearListas.jpg';
                    imagenInicial.classList.add('centered-image');
                    contenedorProductos.appendChild(imagenInicial);
                }

                
                actualizarBarraProgreso();
            } else {
                alert('No hay ninguna lista seleccionada.');
            }
        });
    } else {
        console.error('El ícono de papelera no se encontró en el DOM.');
    }
}

document.addEventListener('DOMContentLoaded', function () {
    loadLists();

    setupTrashIconListener();
});



