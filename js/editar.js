let currentAction = null;
let currentButton = null;

function openModal() {
    document.getElementById('userModal').style.display = 'flex';
}
function closeModal() {
    document.getElementById('userModal').style.display = 'none';
}

function openAlert(message, action, button) {
    document.getElementById('alertMessage').textContent = message;
    currentAction = action;
    currentButton = button;
    document.getElementById('alertModal').style.display = 'flex';
}

function closeAlert() {
    document.getElementById('alertModal').style.display = 'none';
}

function confirmAction(action, button) {
    const message = action === 'delete' ? '¿Está seguro de que desea eliminar este usuario?' : '¿Está seguro de que desea editar este usuario?';
    openAlert(message, action, button);
}

document.getElementById('alertConfirm').addEventListener('click', function () {
    if (currentAction === 'delete') {
        const row = currentButton.closest('tr');
        row.remove();
    } else if (currentAction === 'edit') {
        const row = currentButton.closest('tr');
        const cells = row.querySelectorAll('td');

        // Rellenar los datos en el formulario
        document.getElementById('cedula').value = cells[1].textContent;
        document.getElementById('nombre').value = cells[2].textContent;
        document.getElementById('apellido').value = cells[3].textContent;
        document.getElementById('direccion').value = cells[4].textContent;
        document.getElementById('email').value = cells[5].textContent;
        document.getElementById('contraseña').value = cells[6].textContent;
        document.getElementById('activo').value = cells[7].textContent;

        // Abrir el modal para editar
        openModal();

        // Remover la fila editada para que pueda ser reemplazada
        row.remove();
    }

    closeAlert();
    updateSerialNumbers();
});
//Funcion del formulario
document.getElementById('userForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Evitar recargar la página

    const errorDiv = document.getElementById('error');
    errorDiv.textContent = ''; // Limpiar errores anteriores

    const cedula = document.getElementById('cedula').value.trim();
    const nombre = document.getElementById('nombre').value.trim();
    const apellido = document.getElementById('apellido').value.trim();
    const direccion = document.getElementById('direccion').value.trim();
    const email = document.getElementById('email').value.trim();
    const contraseña = document.getElementById('contraseña').value.trim();
    const activo = document.getElementById('activo').value.trim();

    if (!cedula || !nombre || !apellido || !direccion || !email || !contraseña || !activo) {
        errorDiv.textContent = 'Por favor, complete todos los campos obligatorios.';
        return;
    }

    // Crear nueva fila con clases en cada celda
    const tableBody = document.getElementById('userTableBody');
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
                <td class="table-cell">${tableBody.children.length + 1}</td>
                <td class="table-cell">${cedula}</td>
                <td class="table-cell">${nombre}</td>
                <td class="table-cell">${apellido}</td>
                <td class="table-cell">${direccion}</td>
                <td class="table-cell">${email}</td>
                <td class="table-cell">${contraseña}</td>
                <td class="table-cell">${activo}</td>
                <td><button class="action-btn edit-btn edit" onclick="confirmAction('edit', this)">Editar</button></td>
                <td><button class="action-btn delete-btn delete" onclick="confirmAction('delete', this)">Eliminar</button></td>
            `;

    tableBody.appendChild(newRow);
    updateSerialNumbers();

    // Limpiar el formulario y cerrar el modal
    document.getElementById('userForm').reset();
    closeModal();
});



// Función para actualizar los números de serie (índices de fila)
function updateSerialNumbers() {
    const rows = document.querySelectorAll('#userTableBody tr');
    rows.forEach((row, index) => {
        row.cells[0].textContent = index + 1; // Asignar número de serie a cada fila
    });
}

//Funcion de busqueda
function searchTable() {
    const input = document.getElementById("searchInput");
    const filter = input.value.toUpperCase();
    const table = document.querySelector("table");
    const rows = table.getElementsByTagName("tr");

    for (let i = 1; i < rows.length; i++) {  // Start from 1 to skip the header row
        let cells = rows[i].getElementsByTagName("td");
        let match = false;

        // Iterate through all columns in each row
        for (let j = 0; j < cells.length - 1; j++) {  // -1 to exclude the action buttons column
            let cell = cells[j];
            if (cell) {
                let textValue = cell.textContent || cell.innerText;
                if (textValue.toUpperCase().indexOf(filter) > -1) {
                    match = true;
                    break;  // Stop searching in other cells if one matches
                }
            }
        }

        // Show or hide the row based on the match
        if (match) {
            rows[i].style.display = "";
        } else {
            rows[i].style.display = "none";
        }
    }
}

//Funcion de numero serial
function updateSerialNumbers() {
    const tableBody = document.getElementById("userTableBody");
    const rows = tableBody.getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {
        const serialCell = rows[i].getElementsByTagName("td")[0];
        serialCell.textContent = i + 1;
    }
}
document.addEventListener("DOMContentLoaded", updateSerialNumbers);

//funciones del selector de columnas
function showRows() {
    const rowLimit = document.getElementById("rowLimit").value; // Obtener el valor seleccionado
    const tableBody = document.getElementById("userTableBody");
    const rows = tableBody.getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {
        // Mostrar u ocultar las filas según el valor seleccionado
        if (rowLimit === "all" || i < rowLimit) {
            rows[i].style.display = ""; // Mostrar la fila
        } else {
            rows[i].style.display = "none"; // Ocultar la fila
        }
    }
}
// Mostrar todas las filas al cargar la página
document.addEventListener("DOMContentLoaded", () => showRows());

//Manejo de la paginacion

let rowsPerPage = "all"; // Mostrar todas las filas por defecto
let currentPage = 1;
let rows = [];
let totalPages = 0;

document.addEventListener('DOMContentLoaded', function () {
    rows = Array.from(document.querySelectorAll("#userTableBody tr"));
    totalPages = Math.ceil(rows.length / rowsPerPage);

    // Mostrar todas las filas si se selecciona 'all'
    function displayPage(page) {
        // Ocultar todas las filas
        rows.forEach(row => row.style.display = 'none');

        if (rowsPerPage === 'all') {
            // Si se selecciona 'Todas', mostrar todas las filas sin paginación
            rows.forEach(row => row.style.display = '');
            totalPages = 1;  // Solo hay una página
        } else {
            // Calcular el rango de filas para mostrar en la página actual
            const start = (page - 1) * rowsPerPage;
            const end = start + rowsPerPage;

            // Mostrar las filas correspondientes a la página actual
            for (let i = start; i < end && i < rows.length; i++) {
                rows[i].style.display = '';
            }
        }

        updatePagination(page);
    }

    // Actualizar botones de paginación
    function updatePagination(page) {
        const pageLinks = document.querySelectorAll('#pagination .page-item a');
        pageLinks.forEach(link => {
            const pageNumber = parseInt(link.textContent);
            if (pageNumber === page) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });

        document.querySelector('#pagination .page-item:first-child a').classList.toggle('disabled', page === 1);
        document.querySelector('#pagination .page-item:last-child a').classList.toggle('disabled', page === totalPages);
    }

    // Cambiar página
    function changePage(page) {
        if (page === 'prev' && currentPage > 1) {
            currentPage--;
        } else if (page === 'next' && currentPage < totalPages) {
            currentPage++;
        } else if (typeof page === 'number' && page >= 1 && page <= totalPages) {
            currentPage = page;
        }
        displayPage(currentPage);
    }

    // Función que actualiza el número de filas por página según la selección
    function updateRowsPerPage() {
        const selectedValue = document.getElementById('rowLimit').value;
        rowsPerPage = selectedValue;  // Guardar el valor de filas seleccionadas

        if (rowsPerPage === 'all') {
            totalPages = 1;  // Solo una página cuando se muestran todas las filas
            currentPage = 1;  // Reiniciar a la primera página
        } else {
            rowsPerPage = parseInt(rowsPerPage);  // Establecer filas por página
            totalPages = Math.ceil(rows.length / rowsPerPage);  // Calcular el número de páginas
        }

        displayPage(currentPage);  // Mostrar la página actual
    }

    // Inicializar la tabla con la primera página
    displayPage(currentPage);

    // Exponer funciones para cambiar de página
    window.changePage = changePage;
    window.updateRowsPerPage = updateRowsPerPage;
});

// MODAL DE ROLES.

function openModal() {
    document.getElementById('userModal').style.display = 'flex';
}
function closeModal() {
    document.getElementById('userModal').style.display = 'none';
}

function openAlert(message, action, button) {
    document.getElementById('alertMessage').textContent = message;
    currentAction = action;
    currentButton = button;
    document.getElementById('alertModal').style.display = 'flex';
}

function closeAlert() {
    document.getElementById('alertModal').style.display = 'none';
}

function confirmAction(action, button) {
    const message = action === 'delete' ? '¿Está seguro de que desea eliminar este usuario?' : '¿Está seguro de que desea editar este usuario?';
    openAlert(message, action, button);
}

document.getElementById('alertConfirm').addEventListener('click', function () {
    if (currentAction === 'delete') {
        const row = currentButton.closest('tr');
        row.remove();
    } else if (currentAction === 'edit') {
        const row = currentButton.closest('tr');
        const cells = row.querySelectorAll('td');

        // Rellenar los datos en el formulario
        document.getElementById('tipo').value = cells[1].textContent;
        document.getElementById('activo').value = cells[2].textContent;

        // Abrir el modal para editar
        openModal();

        // Remover la fila editada para que pueda ser reemplazada
        row.remove();
    }

    closeAlert();
    updateSerialNumbers();
});
//Funcion del formulario
document.getElementById('userForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Evitar recargar la página

    const errorDiv = document.getElementById('error');
    errorDiv.textContent = ''; // Limpiar errores anteriores

    const tipo = document.getElementById('tipo').value.trim();
    const activo = document.getElementById('activo').value.trim();

    if (!tipo || !activo) {
        errorDiv.textContent = 'Por favor, complete todos los campos obligatorios.';
        return;
    }

    // Crear nueva fila con clases en cada celda
    const tableBody = document.getElementById('userTableBody');
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
                <td class="table-cell">${tableBody.children.length + 1}</td>
                <td class="table-cell">${tipo}</td>
                <td class="table-cell">${activo}</td>
                <td><button class="action-btn edit-btn edit" onclick="confirmAction('edit', this)">Editar</button></td>
                <td><button class="action-btn delete-btn delete" onclick="confirmAction('delete', this)">Eliminar</button></td>
            `;

    tableBody.appendChild(newRow);
    updateSerialNumbers();

    // Limpiar el formulario y cerrar el modal
    document.getElementById('userForm').reset();
    closeModal();
});

//MODAL DE PERMISOS.

function openModal() {
    document.getElementById('userModal').style.display = 'flex';
}
function closeModal() {
    document.getElementById('userModal').style.display = 'none';
}

function openAlert(message, action, button) {
    document.getElementById('alertMessage').textContent = message;
    currentAction = action;
    currentButton = button;
    document.getElementById('alertModal').style.display = 'flex';
}

function closeAlert() {
    document.getElementById('alertModal').style.display = 'none';
}

function confirmAction(action, button) {
    const message = action === 'delete' ? '¿Está seguro de que desea eliminar este usuario?' : '¿Está seguro de que desea editar este usuario?';
    openAlert(message, action, button);
}

document.getElementById('alertConfirm').addEventListener('click', function () {
    if (currentAction === 'delete') {
        const row = currentButton.closest('tr');
        row.remove();
    } else if (currentAction === 'edit') {
        const row = currentButton.closest('tr');
        const cells = row.querySelectorAll('td');

        // Rellenar los datos en el formulario
        document.getElementById('usuario').value = cells[1].textContent;
        document.getElementById('rol').value = cells[2].textContent;
        document.getElementById('fechaA').value = cells[3].textContent;

        // Abrir el modal para editar
        openModal();

        // Remover la fila editada para que pueda ser reemplazada
        row.remove();
    }

    closeAlert();
    updateSerialNumbers();
});
//Funcion del formulario
document.getElementById('userForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Evitar recargar la página

    const errorDiv = document.getElementById('error');
    errorDiv.textContent = ''; // Limpiar errores anteriores

    const usuario = document.getElementById('usuario').value.trim();
    const rol = document.getElementById('rol').value.trim();
    const fechaA = document.getElementById('fechaA').value.trim();

    if (!usuario || !rol || !fechaA) {
        errorDiv.textContent = 'Por favor, complete todos los campos obligatorios.';
        return;
    }

    // Crear nueva fila con clases en cada celda
    const tableBody = document.getElementById('userTableBody');
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
                <td class="table-cell">${tableBody.children.length + 1}</td>
                <td class="table-cell">${usuario}</td>
                <td class="table-cell">${rol}</td>
                <td class="table-cell">${fechaA}</td>
                <td><button class="action-btn edit-btn edit" onclick="confirmAction('edit', this)">Editar</button></td>
                <td><button class="action-btn delete-btn delete" onclick="confirmAction('delete', this)">Eliminar</button></td>
            `;

    tableBody.appendChild(newRow);
    updateSerialNumbers();

    // Limpiar el formulario y cerrar el modal
    document.getElementById('userForm').reset();
    closeModal();
});

//MODAL DE INSCRIPCIONES.

function openModal() {
    document.getElementById('userModal').style.display = 'flex';
}
function closeModal() {
    document.getElementById('userModal').style.display = 'none';
}

function openAlert(message, action, button) {
    document.getElementById('alertMessage').textContent = message;
    currentAction = action;
    currentButton = button;
    document.getElementById('alertModal').style.display = 'flex';
}

function closeAlert() {
    document.getElementById('alertModal').style.display = 'none';
}

function confirmAction(action, button) {
    const message = action === 'delete' ? '¿Está seguro de que desea eliminar este usuario?' : '¿Está seguro de que desea editar este usuario?';
    openAlert(message, action, button);
}

document.getElementById('alertConfirm').addEventListener('click', function () {
    if (currentAction === 'delete') {
        const row = currentButton.closest('tr');
        row.remove();
    } else if (currentAction === 'edit') {
        const row = currentButton.closest('tr');
        const cells = row.querySelectorAll('td');

        // Rellenar los datos en el formulario
        document.getElementById('fechaI').value = cells[1].textContent;
        document.getElementById('estado').value = cells[2].textContent;

        // Abrir el modal para editar
        openModal();

        // Remover la fila editada para que pueda ser reemplazada
        row.remove();
    }

    closeAlert();
    updateSerialNumbers();
});
//Funcion del formulario
document.getElementById('userForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Evitar recargar la página

    const errorDiv = document.getElementById('error');
    errorDiv.textContent = ''; // Limpiar errores anteriores

    const fechaI = document.getElementById('fechaI').value.trim();
    const estado = document.getElementById('estado').value.trim();

    if (!fechaI || !estado) {
        errorDiv.textContent = 'Por favor, complete todos los campos obligatorios.';
        return;
    }

    // Crear nueva fila con clases en cada celda
    const tableBody = document.getElementById('userTableBody');
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
                <td class="table-cell">${tableBody.children.length + 1}</td>
                <td class="table-cell">${fechaI}</td>
                <td class="table-cell">${estado}</td>
                <td><button class="action-btn edit-btn edit" onclick="confirmAction('edit', this)">Editar</button></td>
                <td><button class="action-btn delete-btn delete" onclick="confirmAction('delete', this)">Eliminar</button></td>
            `;

    tableBody.appendChild(newRow);
    updateSerialNumbers();

    // Limpiar el formulario y cerrar el modal
    document.getElementById('userForm').reset();
    closeModal();
});

//MODAL DE EVENTOS.

function openModal() {
    document.getElementById('userModal').style.display = 'flex';
}
function closeModal() {
    document.getElementById('userModal').style.display = 'none';
}

function openAlert(message, action, button) {
    document.getElementById('alertMessage').textContent = message;
    currentAction = action;
    currentButton = button;
    document.getElementById('alertModal').style.display = 'flex';
}

function closeAlert() {
    document.getElementById('alertModal').style.display = 'none';
}

function confirmAction(action, button) {
    const message = action === 'delete' ? '¿Está seguro de que desea eliminar este usuario?' : '¿Está seguro de que desea editar este usuario?';
    openAlert(message, action, button);
}

document.getElementById('alertConfirm').addEventListener('click', function () {
    if (currentAction === 'delete') {
        const row = currentButton.closest('tr');
        row.remove();
    } else if (currentAction === 'edit') {
        const row = currentButton.closest('tr');
        const cells = row.querySelectorAll('td');

        // Rellenar los datos en el formulario
        document.getElementById('nombre').value = cells[1].textContent;
        document.getElementById('descripcion').value = cells[2].textContent;
        document.getElementById('fecha').value = cells[3].textContent;
        document.getElementById('horaI').value = cells[4].textContent;
        document.getElementById('horaF').value = cells[5].textContent;
        document.getElementById('salon').value = cells[6].textContent;

        // Abrir el modal para editar
        openModal();

        // Remover la fila editada para que pueda ser reemplazada
        row.remove();
    }

    closeAlert();
    updateSerialNumbers();
});
//Funcion del formulario
document.getElementById('userForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Evitar recargar la página

    const errorDiv = document.getElementById('error');
    errorDiv.textContent = ''; // Limpiar errores anteriores

    const nombre = document.getElementById('nombre').value.trim();
    const descripcion = document.getElementById('descripcion').value.trim();
    const fecha = document.getElementById('fecha').value.trim();
    const horaI = document.getElementById('horaI').value.trim();
    const horaF = document.getElementById('horaF').value.trim();
    const salon = document.getElementById('salon').value.trim();

    if (!nombre || !descripcion ||!fecha || !horaI || !horaF || !salon) {
        errorDiv.textContent = 'Por favor, complete todos los campos obligatorios.';
        return;
    }

    // Crear nueva fila con clases en cada celda
    const tableBody = document.getElementById('userTableBody');
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
                <td class="table-cell">${tableBody.children.length + 1}</td>
                <td class="table-cell">${nombre}</td>
                <td class="table-cell">${descripcion}</td>
                <td class="table-cell">${fecha}</td>
                <td class="table-cell">${horaI}</td>
                <td class="table-cell">${horaF}</td>
                <td class="table-cell">${salon}</td>
                <td><button class="action-btn edit-btn edit" onclick="confirmAction('edit', this)">Editar</button></td>
                <td><button class="action-btn delete-btn delete" onclick="confirmAction('delete', this)">Eliminar</button></td>
            `;

    tableBody.appendChild(newRow);
    updateSerialNumbers();

    // Limpiar el formulario y cerrar el modal
    document.getElementById('userForm').reset();
    closeModal();
});

//MODAL DE ALQUILER.

function openModal() {
    document.getElementById('userModal').style.display = 'flex';
}
function closeModal() {
    document.getElementById('userModal').style.display = 'none';
}

function openAlert(message, action, button) {
    document.getElementById('alertMessage').textContent = message;
    currentAction = action;
    currentButton = button;
    document.getElementById('alertModal').style.display = 'flex';
}

function closeAlert() {
    document.getElementById('alertModal').style.display = 'none';
}

function confirmAction(action, button) {
    const message = action === 'delete' ? '¿Está seguro de que desea eliminar este usuario?' : '¿Está seguro de que desea editar este usuario?';
    openAlert(message, action, button);
}

document.getElementById('alertConfirm').addEventListener('click', function () {
    if (currentAction === 'delete') {
        const row = currentButton.closest('tr');
        row.remove();
    } else if (currentAction === 'edit') {
        const row = currentButton.closest('tr');
        const cells = row.querySelectorAll('td');

        // Rellenar los datos en el formulario
        document.getElementById('fecha').value = cells[1].textContent;
        document.getElementById('horaI').value = cells[2].textContent;
        document.getElementById('horaF').value = cells[3].textContent;
        document.getElementById('costo').value = cells[4].textContent;

        // Abrir el modal para editar
        openModal();

        // Remover la fila editada para que pueda ser reemplazada
        row.remove();
    }

    closeAlert();
    updateSerialNumbers();
});
//Funcion del formulario
document.getElementById('userForm').addEventListener('submit', function (event) {
    event.preventDefault(); // Evitar recargar la página

    const errorDiv = document.getElementById('error');
    errorDiv.textContent = ''; // Limpiar errores anteriores

    const fecha = document.getElementById('fecha').value.trim();
    const horaI = document.getElementById('horaI').value.trim();
    const horaF = document.getElementById('horaF').value.trim();
    const salon = document.getElementById('costo').value.trim();

    if (!fecha || !horaI || !horaF || !salon) {
        errorDiv.textContent = 'Por favor, complete todos los campos obligatorios.';
        return;
    }

    // Crear nueva fila con clases en cada celda
    const tableBody = document.getElementById('userTableBody');
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
                <td class="table-cell">${tableBody.children.length + 1}</td>
                <td class="table-cell">${fecha}</td>
                <td class="table-cell">${horaI}</td>
                <td class="table-cell">${horaF}</td>
                <td class="table-cell">${salon}</td>
                <td><button class="action-btn edit-btn edit" onclick="confirmAction('edit', this)">Editar</button></td>
                <td><button class="action-btn delete-btn delete" onclick="confirmAction('delete', this)">Eliminar</button></td>
            `;

    tableBody.appendChild(newRow);
    updateSerialNumbers();

    // Limpiar el formulario y cerrar el modal
    document.getElementById('userForm').reset();
    closeModal();
});