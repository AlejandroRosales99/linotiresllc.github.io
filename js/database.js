/* 
 * LINO TRUCK TIRES - Product Database (Simulada)
 * Descripción: Gestiona los productos usando LocalStorage para persistencia.
 */

const PRODUCTOS_INICIALES = [
    // ... (already there, but I'll keep the structure clean)
    { id: 1, nombre: "Heavy Duty King 3000", precio: 450.00, marca: "Bridgestone", medidas: "295/85 R22.5", tipo: "Carga Pesada", imagen: "assets/img/tires-stack.png", destacado: true, activo: true, descripcion: "Diseñado para máxima tracción en terrenos difíciles." },
    { id: 2, nombre: "Eco-Route Long Haul", precio: 380.00, marca: "Michelin", medidas: "275/80 R22.5", tipo: "Larga Distancia", imagen: "assets/img/tires-stack.png", destacado: true, activo: true, descripcion: "Eficiencia de combustible optimizada para carretera." },
    { id: 3, nombre: "Urban Master Pro", precio: 320.00, marca: "Goodyear", medidas: "255/70 R22.5", tipo: "Urbano", imagen: "assets/img/tires-stack.png", destacado: true, activo: true, descripcion: "Resistencia superior a frenazos y arranques constantes." },
    { id: 4, nombre: "Traction X-Treme", precio: 510.00, marca: "Continental", medidas: "315/80 R22.5", tipo: "Carga Pesada", imagen: "assets/img/tires-stack.png", destacado: false, activo: true, descripcion: "Surcos profundos para evitar el hidroplaneo en carga." },
    { id: 5, nombre: "Smooth Ride Fleet", precio: 290.00, marca: "Hankook", medidas: "11R 22.5", tipo: "Urbano", imagen: "assets/img/tires-stack.png", destacado: false, activo: true, descripcion: "Ideal para flotas de distribución local." },
    { id: 6, nombre: "Desert Storm Heavy", precio: 485.00, marca: "Yokohama", medidas: "12R 22.5", tipo: "Carga Pesada", imagen: "assets/img/tires-stack.png", destacado: false, activo: true, descripcion: "Extra reforzado para climas extremadamente cálidos." },
    { id: 7, nombre: "Highway Star Plus", precio: 415.00, marca: "Pirelli", medidas: "295/75 R22.5", tipo: "Larga Distancia", imagen: "assets/img/tires-stack.png", destacado: false, activo: true, descripcion: "Conducción silenciosa y estable a altas velocidades." },
    { id: 8, nombre: "Steel Edge City", precio: 345.00, marca: "Firestone", medidas: "10R 22.5", tipo: "Urbano", imagen: "assets/img/tires-stack.png", destacado: false, activo: true, descripcion: "Paredes laterales reforzadas contra impactos en aceras." }
];

const SERVICIOS_INICIALES = [
    {
        id: 1,
        titulo: "Venta de Neumáticos",
        descripcion: "Amplio stock de las mejores marcas mundiales: Michelin, Bridgestone, Goodyear y más.",
        icon: "fas fa-truck",
        whatsappMsg: "Hola, me gustaría consultar por la venta de neumáticos.",
        destacado: false
    },
    {
        id: 2,
        titulo: "Servicio en Carretera 24/7",
        descripcion: "Respuesta inmediata en cualquier punto. Cambios y reparaciones técnicas al instante.",
        icon: "fas fa-tools",
        whatsappMsg: "¡AUXILIO! Necesito servicio en carretera ahora mismo.",
        destacado: true
    },
    {
        id: 3,
        titulo: "Atención a Flotas",
        descripcion: "Programas de mantenimiento preventivo y precios preferenciales para flotas corporativas.",
        icon: "fas fa-users-cog",
        whatsappMsg: "Hola, quiero información sobre el servicio para flotas.",
        destacado: false
    }
];

class Database {
    constructor() {
        if (!localStorage.getItem('lino_productos')) {
            localStorage.setItem('lino_productos', JSON.stringify(PRODUCTOS_INICIALES));
        }
        if (!localStorage.getItem('lino_servicios')) {
            localStorage.setItem('lino_servicios', JSON.stringify(SERVICIOS_INICIALES));
        }
    }

    // --- PRODUCTOS ---
    obtenerProductos() {
        return JSON.parse(localStorage.getItem('lino_productos'));
    }

    guardarProductos(productos) {
        localStorage.setItem('lino_productos', JSON.stringify(productos));
    }

    agregarProducto(producto) {
        const productos = this.obtenerProductos();
        producto.id = Date.now();
        productos.push(producto);
        this.guardarProductos(productos);
    }

    actualizarProducto(productoActualizado) {
        let productos = this.obtenerProductos();
        productos = productos.map(p => p.id === productoActualizado.id ? productoActualizado : p);
        this.guardarProductos(productos);
    }

    eliminarProducto(id) {
        let productos = this.obtenerProductos();
        productos = productos.filter(p => p.id !== id);
        this.guardarProductos(productos);
    }

    // --- SERVICIOS ---
    obtenerServicios() {
        return JSON.parse(localStorage.getItem('lino_servicios'));
    }

    guardarServicios(servicios) {
        localStorage.setItem('lino_servicios', JSON.stringify(servicios));
    }

    agregarServicio(servicio) {
        const servicios = this.obtenerServicios();
        servicio.id = Date.now();
        servicios.push(servicio);
        this.guardarServicios(servicios);
    }

    actualizarServicio(servicioActualizado) {
        let servicios = this.obtenerServicios();
        servicios = servicios.map(s => s.id === servicioActualizado.id ? servicioActualizado : s);
        this.guardarServicios(servicios);
    }

    eliminarServicio(id) {
        let servicios = this.obtenerServicios();
        servicios = servicios.filter(s => s.id !== id);
        this.guardarServicios(servicios);
    }
}

const db = new Database();
