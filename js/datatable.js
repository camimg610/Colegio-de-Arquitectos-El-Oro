//PAGINACION PERMISOS
window.addEventListener('DOMContentLoaded', event => {
    const usuariosTable = document.getElementById('tablapermisos');
    if (usuariosTable) {
        new simpleDatatables.DataTable(usuariosTable, {
            labels: {
                placeholder: "Buscar...", // Placeholder para el campo de búsqueda
                perPage: "Registros por página", // Opciones por página
                noRows: "No se encontraron registros", // Mensaje cuando no hay registros
                info: "Mostrando registros del {start} al {end} de un total de {rows}", // Información general
            },
            firstLast: true, // Habilita botones "Primero" y "Último" en la paginación
            perPageSelect: [5, 10, 25, 50, 100], // Opciones del selector de cantidad por página
        });
    }
});