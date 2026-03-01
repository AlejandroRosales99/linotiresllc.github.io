/* 
 * LINO TRUCK TIRES - Lógica de Tienda Cliente
 */

document.addEventListener('DOMContentLoaded', () => {
    const productsGrid = document.getElementById('main-products-grid');
    const resultsCount = document.getElementById('results-count');
    const typeFilters = document.querySelectorAll('input[name="tipo"]');
    const searchInput = document.getElementById('search-input');

    let currentProducts = db.obtenerProductos().filter(p => p.activo);
    let filteredProducts = [...currentProducts];

    // Renderizar Productos en el Grid
    function renderProducts(productsList) {
        productsGrid.innerHTML = '';

        if (productsList.length === 0) {
            productsGrid.innerHTML = '<div class="no-results"><h3>No se encontraron productos con esos criterios.</h3></div>';
        } else {
            productsList.forEach(p => {
                const card = `
                    <div class="card ${p.destacado ? 'destacado-border' : ''}">
                        <div class="card-img">
                            <img src="${p.imagen}" alt="${p.nombre}">
                        </div>
                        <div class="card-body">
                            <span class="card-tipo">${p.tipo}</span>
                            <h3 class="card-title">${p.nombre}</h3>
                            <p class="card-specs"><strong>Medida:</strong> ${p.medidas} | <strong>Marca:</strong> ${p.marca}</p>
                            <p class="card-description">${p.descripcion || ''}</p>
                            <div class="card-footer">
                                <span class="card-price">$${p.precio.toFixed(2)}</span>
                                <button class="btn btn-amarillo btn-sm btn-ver-detalles" data-id="${p.id}">Ver Detalles</button>
                            </div>
                        </div>
                    </div>
                `;
                productsGrid.innerHTML += card;
            });

            // Agregar listeners a los botones de detalles
            document.querySelectorAll('.btn-ver-detalles').forEach(btn => {
                btn.addEventListener('click', () => {
                    const id = parseInt(btn.getAttribute('data-id'));
                    const product = db.obtenerProductos().find(p => p.id === id);
                    if (product) {
                        openModal(product);
                    }
                });
            });
        }

        resultsCount.textContent = `Mostrando ${productsList.length} productos`;
    }

    // Modal Logic
    const modal = document.getElementById('product-modal');
    const closeModalBtn = document.querySelector('.close-modal');

    function openModal(p) {
        document.getElementById('modal-image').src = p.imagen;
        document.getElementById('modal-tipo').textContent = p.tipo;
        document.getElementById('modal-nombre').textContent = p.nombre;
        document.getElementById('modal-medidas').textContent = p.medidas;
        document.getElementById('modal-marca').textContent = p.marca;
        document.getElementById('modal-descripcion').textContent = p.descripcion || 'Sin descripción disponible.';
        document.getElementById('modal-precio').textContent = `$${p.precio.toFixed(2)}`;
        document.getElementById('modal-whatsapp').href = `https://wa.me/12345678?text=Hola,%20solicito%20cotización%20del%20neumático:%20${p.nombre}%20(${p.medidas})`;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Evitar scroll al estar el modal abierto
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    closeModalBtn.addEventListener('click', closeModal);

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Filtrar por Tipo
    function filterProducts() {
        const selectedType = document.querySelector('input[name="tipo"]:checked').value;
        const searchTerm = searchInput.value.toLowerCase();

        filteredProducts = currentProducts.filter(p => {
            const matchesType = (selectedType === 'todos' || p.tipo === selectedType);
            const matchesSearch = (p.nombre.toLowerCase().includes(searchTerm) || p.medidas.toLowerCase().includes(searchTerm));
            return matchesType && matchesSearch;
        });

        renderProducts(filteredProducts);
    }

    // Event Listeners
    typeFilters.forEach(radio => {
        radio.addEventListener('change', filterProducts);
    });

    searchInput.addEventListener('input', filterProducts);

    // Initial Render
    renderProducts(currentProducts);
});
