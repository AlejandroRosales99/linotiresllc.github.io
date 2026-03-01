// --- Funciones Globales para el CRUD ---
window.abrirEditar = null;
window.eliminarProducto = null;
window.abrirEditarServicio = null;
window.eliminarServicio = null;

document.addEventListener('DOMContentLoaded', () => {
    console.log('Admin JS Iniciado');

    // Referencias UI
    const loginContainer = document.getElementById('login-container');
    const adminPanel = document.getElementById('admin-panel');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const logoutBtn = document.getElementById('logout-btn');

    // Nav y Secciones
    const navProductos = document.getElementById('nav-productos');
    const navServicios = document.getElementById('nav-servicios');
    const sectionProductos = document.getElementById('section-productos');
    const sectionServicios = document.getElementById('section-servicios');

    // Tablas/Grids
    const productsTable = document.getElementById('admin-products-table');
    const servicesTable = document.getElementById('admin-services-table');

    // Botones "Nuevo"
    const btnNuevoProducto = document.getElementById('btn-nuevo-producto');
    const btnNuevoServicio = document.getElementById('btn-nuevo-servicio');

    // Modales
    const productModal = document.getElementById('product-modal');
    const serviceModal = document.getElementById('service-modal');

    // Formularios
    const productForm = document.getElementById('product-form');
    const serviceForm = document.getElementById('service-form');

    // Verificación de sesión
    const activeSession = localStorage.getItem('lino_session');
    if (activeSession) { showAdminPanel(); }

    // --- LOGIN ---
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const user = document.getElementById('username').value;
            const pass = document.getElementById('password').value;

            if (user === 'admin' && pass === 'admin123') {
                localStorage.setItem('lino_session', 'true');
                showAdminPanel();
                loginError.style.display = 'none';
            } else { loginError.style.display = 'block'; }
        });
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('lino_session');
            window.location.reload();
        });
    }

    function showAdminPanel() {
        if (loginContainer) loginContainer.style.display = 'none';
        if (adminPanel) adminPanel.style.display = 'grid';
        renderAdminProducts();
        renderAdminServices();
    }

    // --- NAVEGACIÓN PANEL ---
    if (navProductos && navServicios) {
        navProductos.addEventListener('click', () => {
            navProductos.classList.add('active');
            navServicios.classList.remove('active');
            sectionProductos.style.display = 'block';
            sectionServicios.style.display = 'none';
        });

        navServicios.addEventListener('click', () => {
            navServicios.classList.add('active');
            navProductos.classList.remove('active');
            sectionProductos.style.display = 'none';
            sectionServicios.style.display = 'block';
        });
    }

    // --- CRUD PRODUCTOS ---
    function renderAdminProducts() {
        const productos = db.obtenerProductos();
        if (!productsTable) return;
        productsTable.innerHTML = '';

        productos.forEach(p => {
            const card = document.createElement('div');
            card.className = 'admin-card';
            card.innerHTML = `
                <div class="admin-card-img">
                    <img src="${p.imagen}" alt="${p.nombre}">
                    <div class="admin-card-badges">
                        <span class="badge ${p.activo ? 'badge-active' : 'badge-inactive'}">${p.activo ? 'Activo' : 'Inactivo'}</span>
                    </div>
                </div>
                <div class="admin-card-body">
                    <span class="admin-card-brand">${p.marca}</span>
                    <h3 class="admin-card-title">${p.nombre}</h3>
                </div>
                <div class="admin-card-footer">
                    <div class="admin-card-price">$${p.precio.toFixed(2)}</div>
                    <div class="admin-actions">
                        <button class="btn-icon-lg btn-edit-lg" data-id="${p.id}"><i class="fas fa-edit"></i></button>
                        <button class="btn-icon-lg btn-delete-lg" data-id="${p.id}"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            `;
            productsTable.appendChild(card);
        });
    }

    // --- CRUD SERVICIOS ---
    function renderAdminServices() {
        const servicios = db.obtenerServicios();
        if (!servicesTable) return;
        servicesTable.innerHTML = '';

        servicios.forEach(s => {
            const card = document.createElement('div');
            card.className = 'admin-card';
            card.innerHTML = `
                <div class="admin-card-img" style="height: 154px;">
                    <i class="${s.icon}" style="font-size: 4rem; color: var(--azul-principal);"></i>
                </div>
                <div class="admin-card-body">
                    <h3 class="admin-card-title">${s.titulo}</h3>
                    <p style="font-size: 0.85rem; color: #666;">${s.descripcion}</p>
                </div>
                <div class="admin-card-footer">
                    <div class="admin-actions">
                        <button class="btn-icon-lg btn-edit-serv" data-id="${s.id}"><i class="fas fa-edit"></i></button>
                        <button class="btn-icon-lg btn-delete-serv" data-id="${s.id}"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            `;
            servicesTable.appendChild(card);
        });
    }

    // --- EVENT DELEGATION ---
    if (productsTable) {
        productsTable.addEventListener('click', (e) => {
            const btnEdit = e.target.closest('.btn-edit-lg');
            const btnDelete = e.target.closest('.btn-delete-lg');
            if (btnEdit) window.abrirEditar(parseInt(btnEdit.getAttribute('data-id')));
            if (btnDelete) window.eliminarProducto(parseInt(btnDelete.getAttribute('data-id')));
        });
    }

    if (servicesTable) {
        servicesTable.addEventListener('click', (e) => {
            const btnEdit = e.target.closest('.btn-edit-serv');
            const btnDelete = e.target.closest('.btn-delete-serv');
            if (btnEdit) window.abrirEditarServicio(parseInt(btnEdit.getAttribute('data-id')));
            if (btnDelete) window.eliminarServicio(parseInt(btnDelete.getAttribute('data-id')));
        });
    }

    // --- MODALES ---
    function openM(m) { if (m) { m.style.display = 'flex'; m.classList.add('active'); document.body.style.overflow = 'hidden'; } }
    function closeM(m) { if (m) { m.style.display = 'none'; m.classList.remove('active'); document.body.style.overflow = 'auto'; } }

    if (btnNuevoProducto) btnNuevoProducto.addEventListener('click', () => {
        productForm.reset();
        document.getElementById('edit-product-id').value = '';
        document.getElementById('image-preview').src = 'assets/img/tires-stack.png';
        document.getElementById('prod-imagen').value = 'assets/img/tires-stack.png';
        document.getElementById('modal-title').textContent = 'Nuevo Producto';
        openM(productModal);
    });

    if (btnNuevoServicio) btnNuevoServicio.addEventListener('click', () => {
        serviceForm.reset();
        document.getElementById('edit-service-id').value = '';
        document.getElementById('service-modal-title').textContent = 'Nuevo Servicio';
        if (servIconPreview) servIconPreview.innerHTML = '<i class="fas fa-tools"></i>';
        openM(serviceModal);
    });

    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', () => { closeM(productModal); closeM(serviceModal); });
    });

    window.addEventListener('click', (e) => {
        if (e.target === productModal) closeM(productModal);
        if (e.target === serviceModal) closeM(serviceModal);
    });

    // --- FORM SUBMITS ---
    if (productForm) {
        productForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = {
                id: document.getElementById('edit-product-id').value ? parseInt(document.getElementById('edit-product-id').value) : null,
                nombre: document.getElementById('prod-nombre').value,
                precio: parseFloat(document.getElementById('prod-precio').value),
                marca: document.getElementById('prod-marca').value,
                medidas: document.getElementById('prod-medidas').value,
                tipo: document.getElementById('prod-tipo').value,
                imagen: document.getElementById('prod-imagen').value,
                descripcion: document.getElementById('prod-descripcion').value,
                destacado: document.getElementById('prod-destacado').checked,
                activo: document.getElementById('prod-activo').checked
            };
            if (data.id) db.actualizarProducto(data); else db.agregarProducto(data);
            closeM(productModal);
            renderAdminProducts();
        });
    }

    if (serviceForm) {
        serviceForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const data = {
                id: document.getElementById('edit-service-id').value ? parseInt(document.getElementById('edit-service-id').value) : null,
                titulo: document.getElementById('serv-titulo').value,
                descripcion: document.getElementById('serv-descripcion').value,
                icon: document.getElementById('serv-icon').value,
                whatsappMsg: document.getElementById('serv-whatsapp').value,
                destacado: document.getElementById('serv-destacado').checked
            };
            if (data.id) db.actualizarServicio(data); else db.agregarServicio(data);
            closeM(serviceModal);
            renderAdminServices();
        });
    }

    // --- GLOBAL WRAPPERS ---
    window.abrirEditar = (id) => {
        const p = db.obtenerProductos().find(x => x.id === id);
        if (!p) return;
        document.getElementById('edit-product-id').value = p.id;
        document.getElementById('prod-nombre').value = p.nombre;
        document.getElementById('prod-precio').value = p.precio;
        document.getElementById('prod-marca').value = p.marca;
        document.getElementById('prod-medidas').value = p.medidas;
        document.getElementById('prod-tipo').value = p.tipo;
        document.getElementById('image-preview').src = p.imagen;
        document.getElementById('prod-imagen').value = p.imagen;
        document.getElementById('prod-descripcion').value = p.descripcion || '';
        document.getElementById('prod-destacado').checked = p.destacado;
        document.getElementById('prod-activo').checked = p.activo;
        document.getElementById('modal-title').textContent = 'Editar Producto';
        openM(productModal);
    };

    window.eliminarProducto = (id) => { if (confirm('¿Eliminar producto?')) { db.eliminarProducto(id); renderAdminProducts(); } };

    window.abrirEditarServicio = (id) => {
        const s = db.obtenerServicios().find(x => x.id === id);
        if (!s) return;
        document.getElementById('edit-service-id').value = s.id;
        document.getElementById('serv-titulo').value = s.titulo;
        document.getElementById('serv-descripcion').value = s.descripcion;
        document.getElementById('serv-icon').value = s.icon;
        document.getElementById('serv-whatsapp').value = s.whatsappMsg;
        document.getElementById('serv-destacado').checked = s.destacado;
        document.getElementById('service-modal-title').textContent = 'Editar Servicio';
        if (servIconPreview) servIconPreview.innerHTML = `<i class="${s.icon}"></i>`;
        openM(serviceModal);
    };

    window.eliminarServicio = (id) => { if (confirm('¿Eliminar servicio?')) { db.eliminarServicio(id); renderAdminServices(); } };

    // Live icon preview for services
    const servIconInput = document.getElementById('serv-icon');
    const servIconPreview = document.getElementById('serv-icon-preview');

    if (servIconInput && servIconPreview) {
        servIconInput.addEventListener('input', (e) => {
            const val = e.target.value || 'fas fa-tools';
            servIconPreview.innerHTML = `<i class="${val}"></i>`;
        });

        // Click en iconos predeterminados
        document.querySelectorAll('.icon-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const iconClass = btn.getAttribute('data-icon');
                servIconInput.value = iconClass;
                servIconPreview.innerHTML = `<i class="${iconClass}"></i>`;

                // Feedback visual de selección
                document.querySelectorAll('.icon-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    // File Upload handling
    const fileInput = document.getElementById('prod-file');
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    document.getElementById('image-preview').src = event.target.result;
                    document.getElementById('prod-imagen').value = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }
});
