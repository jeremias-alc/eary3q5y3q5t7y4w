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



function printListAsPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const listTitle = document.getElementById("listTitle").textContent || "Lista sin título";

    const productItems = document.querySelectorAll(".imageANDproducts-container .producto-item");
    const products = Array.from(productItems).map(item => {
        const name = item.querySelector(".producto-nombre").textContent.trim();
        const details = item.querySelector(".producto-info p").textContent
            .replace(/\n/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
        return { name, details };
    });

    if (products.length === 0) {
        alert("No se puede imprimir una lista vacía.");
        return;
    }

    const today = new Date();
    const formattedDate = today.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });

    doc.setFontSize(16);
    doc.text(`Lista: ${listTitle}`, 10, 20);
    doc.setFontSize(12);
    doc.text(`Fecha: ${formattedDate}`, 10, 30);

    let yOffset = 40;
    const lineHeight = 8;
    const pageHeight = 297;
    const marginBottom = 20;
    const maxWidth = 180;

    products.forEach((product, index) => {
        if (yOffset + lineHeight > pageHeight - marginBottom) {
            doc.addPage();
            yOffset = 10;
        }

        doc.setFont("helvetica", "bold");
        const productName = `${index + 1}. ${product.name}`;
        doc.text(productName, 10, yOffset);

        doc.setFont("helvetica", "normal");
        const detailsText = ` - ${product.details}`;
        const wrappedDetails = doc.splitTextToSize(detailsText, maxWidth);
        wrappedDetails.forEach(line => {
            yOffset += lineHeight;
            doc.text(line, 10, yOffset);
        });

        yOffset += 5;
    });

    doc.save(`${listTitle}.pdf`);
}



function toggleInfo() {
    const infoBox = document.getElementById('infoBox');
    if (infoBox.style.display === 'none' || infoBox.style.display === '') {
        infoBox.style.display = 'flex'; // Mostrar como modal
    } else {
        infoBox.style.display = 'none'; // Ocultar
    }
}


function showModal(listTitle) {
    const modal = document.getElementById("printModal");
    const modalTitle = document.getElementById("modal-list-title");
    modalTitle.textContent = listTitle; 
    modal.style.display = "flex"; 
}


document.addEventListener("DOMContentLoaded", () => {
    const printIcon = document.querySelector(".fa-print");
    if (printIcon) {
        printIcon.addEventListener("click", () => {
            const listTitle = document.getElementById("listTitle").textContent || "Lista sin título";
            showModal(listTitle);
        });
    }


    const printButton = document.getElementById("printButton");
    printButton.addEventListener("click", () => {
        printListAsPDF(); 
        document.getElementById("printModal").style.display = "none"; 
    });

   
    const cancelButton = document.getElementById("cancelButton");
    cancelButton.addEventListener("click", () => {
        document.getElementById("printModal").style.display = "none"; 
    });
});


// Restaurar el estado después de recargar
document.addEventListener('DOMContentLoaded', function () {
    
    const activeSectionId = sessionStorage.getItem('activeSection');
    if (activeSectionId) {
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });

        const activeSection = document.getElementById(activeSectionId);
        if (activeSection) {
            activeSection.classList.add('active');
        }
    }

    const listName = sessionStorage.getItem('listName');
    if (listName) {
        document.getElementById('listName').value = listName;
    }
});



// Función para cargar productos desde el archivo JSON
function loadProducts() {
    fetch('http://localhost:3000/products.json') 
        .then(response => response.json())
        .then(products => {
            const productosContainer = document.querySelector('.productos-container .producto-lista');
            productosContainer.innerHTML = ''; 

            products.forEach(product => {
                const li = document.createElement('li');
                li.innerHTML = `<i class="${product.icon}"></i> ${product.name}`;
                li.addEventListener('click', () => agregarProducto(product.name)); 
                productosContainer.appendChild(li); 
            });
        })
        .catch(error => console.error('Error al cargar los productos:', error));
}


document.addEventListener('DOMContentLoaded', function () {
    loadProducts(); 
});