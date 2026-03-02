// Elementos del DOM
const dataTable = document.getElementById('dataTable');
const tableBody = document.getElementById('tableBody');
const noDataMessage = document.getElementById('noDataMessage');
const searchInput = document.getElementById('searchInput');
const filterType = document.getElementById('filterType');
const filterStatus = document.getElementById('filterStatus');
const btnAdd = document.getElementById('btnAdd');
const btnExport = document.getElementById('btnExport');
const recordModal = document.getElementById('recordModal');
const modalTitle = document.getElementById('modalTitle');
const recordForm = document.getElementById('recordForm');
const closeModalBtns = document.querySelectorAll('.close-modal, .close-modal-btn');

// Campos de Paciente
const recordTypeSelect = document.getElementById('recordType');
const patientSection = document.getElementById('patientSection');
const businessSection = document.getElementById('businessSection');
const agreementDates = document.getElementById('agreementDates');

// Campos condicionales generales
const patientNameGroup = document.getElementById('patientNameGroup');
const priorityGroup = document.getElementById('priorityGroup');
const businessNameLabel = document.querySelector('label[for="businessName"]');
const descriptionLabel = document.querySelector('label[for="description"]');
const inspectionResultLabel = document.querySelector('label[for="inspectionResult"]');

// Elementos de Login
const loginContainer = document.getElementById('loginContainer');
const appContainer = document.getElementById('appContainer');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const currentUserDisplay = document.getElementById('currentUserDisplay');
const btnLogout = document.getElementById('btnLogout');

// Usuarios autorizados (Simulación de base de datos)
const USERS = [
    { username: 'admin', password: '123', fullName: 'Administrador' },
    { username: 'ems', password: 'ems', fullName: 'Paramédico' },
    { username: 'lspd', password: 'lspd', fullName: 'Oficial LSPD' },
    { username: 'lsfd', password: 'lsfd', fullName: 'Bombero LSFD' },
    { username: 'safr', password: 'safr', fullName: 'Agente SAFR' },
    { username: 'Andrew Wallace', password: '0001', fullName: 'Andrew Wallace', rank: 'DIRECTOR SAFR' },
    { username: 'Claudia Cooper', password: '0002', fullName: 'Claudia Cooper', rank: 'DIRECTORA SAFR' },
    { username: 'Kano Rodriguez', password: '0003', fullName: 'Kano Rodriguez', rank: 'Medico' },
    { username: 'Nicolle Bollier', password: '0007', fullName: 'Nicolle Bollier', rank: 'Medico' },
    { username: 'Sofia Hardy', password: '0011', fullName: 'Sofia Hardy', rank: 'Paramedico' },
    { username: 'Lisa Spencer', password: '0016', fullName: 'Lisa Spencer', rank: 'Alumna' },
    { username: 'Matilda Carter', password: '0008', fullName: 'Matilda Carter', rank: 'Paramedica' },
    { username: 'Viksen Bauman', password: '0005', fullName: 'Viksen Bauman', rank: 'Alumno' },
    { username: 'Journey Cassidy', password: '0018', fullName: 'Journey Cassidy', rank: 'Paramedica' },
    { username: 'Thomas Muller', password: '0006', fullName: 'Thomas Muller', rank: 'Paramedico' },
    { username: 'Sofia Da Silva', password: '0014', fullName: 'Sofia Da Silva', rank: 'Aprueba' },
    { username: 'Valentina Ferreti', password: '0015', fullName: 'Valentina Ferreti', rank: 'Enfermera' },
    { username: 'Jackson Seong', password: '0010', fullName: 'Jackson Seong', rank: 'Senior Firefigther' },
    { username: 'Kevin Diaz', password: '0012', fullName: 'Kevin Diaz', rank: 'Engineer' },
    { username: 'Charlotte Moore', password: '0013', fullName: 'Charlotte Moore', rank: 'Senior Firefigther' },
    { username: 'Takeshi Honda', password: '0017', fullName: 'Takeshi Honda', rank: 'Firefigther' },
    { username: 'Giordano Santos', password: '0009', fullName: 'Giordano Santos', rank: 'Probationary Firegighter' }
];

let currentUser = null;

function isDirector() {
    if (!currentUser || !currentUser.rank) return false;
    const rank = String(currentUser.rank).toUpperCase();
    return rank === 'DIRECTOR SAFR' || rank === 'DIRECTORA SAFR';
}

// Estado de la aplicación
let records = [];
const STORAGE_KEY = 'ems_safr_db_v1';

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    checkLogin();
    loadRecords();
    renderTable();
    setupEventListeners();
});

// Autenticación
function handleLogin(e) {
    e.preventDefault();
    const username = loginForm.username.value;
    const password = loginForm.password.value;

    const user = USERS.find(u => u.username === username && u.password === password);

    if (user) {
        // Login exitoso
        currentUser = user;
        localStorage.setItem('safr_user', JSON.stringify(user));
        showApp();
    } else {
        loginError.classList.remove('hidden');
    }
}

function handleLogout() {
    currentUser = null;
    localStorage.removeItem('safr_user');
    showLogin();
}

function checkLogin() {
    const storedUser = localStorage.getItem('safr_user');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
        showApp();
    } else {
        showLogin();
    }
}

function showApp() {
    loginContainer.classList.add('hidden');
    appContainer.classList.remove('hidden');
    loginError.classList.add('hidden');
    loginForm.reset();
    
    if (currentUser) {
        currentUserDisplay.textContent = `Usuario: ${currentUser.fullName}`;
    }
    updatePermissionsUI();
}

function showLogin() {
    loginContainer.classList.remove('hidden');
    appContainer.classList.add('hidden');
}

function updatePermissionsUI() {
    if (!btnExport) return;
    if (isDirector()) {
        btnExport.removeAttribute('disabled');
        btnExport.classList.remove('hidden');
    } else {
        btnExport.setAttribute('disabled', 'true');
        btnExport.classList.add('hidden');
    }
    renderTable();
}

// Cargar registros desde localStorage
function loadRecords() {
    const storedData = localStorage.getItem(STORAGE_KEY);
    if (storedData) {
        records = JSON.parse(storedData);
    } else {
        // Datos de ejemplo si está vacío
        records = [
            {
                id: '1',
                name: 'Ejemplo Incidente Civil',
                type: 'Civil',
                date: new Date().toISOString().split('T')[0],
                status: 'Activo',
                priority: 'Alta',
                description: 'Incidente de prueba generado automáticamente.',
                patientData: {
                    age: '30',
                    gender: 'M',
                    complaint: 'Dolor abdominal'
                }
            },
            {
                id: '2',
                name: 'Registro SAFR #001',
                type: 'SAFR',
                date: new Date().toISOString().split('T')[0],
                status: 'Cerrado',
                priority: 'Baja',
                description: 'Verificación de sistema completada.'
            }
        ];
        saveRecords();
    }
}

// Guardar registros en localStorage
function saveRecords() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    renderTable();
}

// Renderizar la tabla
function renderTable() {
    const searchTerm = searchInput.value.toLowerCase();
    const typeFilter = filterType.value;
    const statusFilter = filterStatus.value;

    const filteredRecords = records.filter(record => {
        const matchesSearch = record.name.toLowerCase().includes(searchTerm) || 
                              record.description.toLowerCase().includes(searchTerm) ||
                              record.id.toLowerCase().includes(searchTerm);
        const matchesType = typeFilter === '' || record.type === typeFilter;
        const matchesStatus = statusFilter === '' || record.status === statusFilter;

        return matchesSearch && matchesType && matchesStatus;
    });

    tableBody.innerHTML = '';

    if (filteredRecords.length === 0) {
        noDataMessage.classList.remove('hidden');
        dataTable.classList.add('hidden');
    } else {
        noDataMessage.classList.add('hidden');
        dataTable.classList.remove('hidden');

        filteredRecords.forEach(record => {
            const row = document.createElement('tr');
            
            // Indicador de paciente
            let patientIcon = '';
            if (record.type === 'Civil' && record.patientData && (record.patientData.age || record.patientData.complaint)) {
                patientIcon = `<i class="fas fa-user-injured text-primary" title="Paciente: ${record.patientData.age || '?'} años - ${record.patientData.complaint || 'Sin queja'}"></i> `;
            }

            // Nombre a mostrar
            let displayName = record.name;
            if ((record.type === 'Convenio' || record.type === 'Fiscalización') && record.businessData && record.businessData.name) {
                displayName = record.businessData.name;
            } else if (!displayName && record.businessData && record.businessData.name) {
                 displayName = record.businessData.name;
            }

            // Badge de prioridad (ocultar si no aplica)
            let priorityBadge = `<span class="badge badge-priority-${record.priority.toLowerCase()}">${record.priority}</span>`;
            if (record.type === 'Convenio' || record.type === 'Fiscalización') {
                priorityBadge = '<span class="text-muted">-</span>';
            }

            const actionsHtml = isDirector()
                ? `<button class="btn btn-sm btn-primary" onclick="editRecord('${record.id}')"><i class="fas fa-edit"></i></button>
                   <button class="btn btn-sm btn-danger" onclick="deleteRecord('${record.id}')"><i class="fas fa-trash"></i></button>`
                : `<button class="btn btn-sm btn-secondary" onclick="viewRecord('${record.id}')"><i class="fas fa-eye"></i></button>`;

            row.innerHTML = `
                <td>${record.id}</td>
                <td>${record.medic || '—'}</td>
                <td>${patientIcon}${displayName}</td>
                <td><span class="badge">${record.type}</span></td>
                <td>${formatDate(record.date)}</td>
                <td><span class="badge badge-status-${record.status.toLowerCase()}">${record.status}</span></td>
                <td>${priorityBadge}</td>
                <td>${truncateText(record.description, 30)}</td>
                <td>${actionsHtml}</td>
            `;
            tableBody.appendChild(row);
        });
    }
}

// Configurar Event Listeners
function setupEventListeners() {
    // Login Listeners
    loginForm.addEventListener('submit', handleLogin);
    btnLogout.addEventListener('click', handleLogout);

    btnAdd.addEventListener('click', () => openModal());
    
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', () => closeModal());
    });

    // Cerrar modal al hacer clic fuera
    window.addEventListener('click', (e) => {
        if (e.target === recordModal) {
            closeModal();
        }
    });

    recordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        saveRecordFromForm();
    });

    searchInput.addEventListener('input', renderTable);
    filterType.addEventListener('change', renderTable);
    filterStatus.addEventListener('change', renderTable);
    
    btnExport.addEventListener('click', exportToCSV);
    
    // Toggle campos
    recordTypeSelect.addEventListener('change', toggleSections);
}

function toggleSections() {
    const type = recordTypeSelect.value;
    
    // Ocultar todo primero
    patientSection.classList.add('hidden');
    businessSection.classList.add('hidden');
    agreementDates.classList.add('hidden');
    
    // Resetear visibilidad de campos generales
    patientNameGroup.classList.remove('hidden');
    priorityGroup.classList.remove('hidden');
    businessNameLabel.textContent = 'Nombre del Local';
    inspectionResultLabel.textContent = 'Resultado / Estado del Convenio';
    descriptionLabel.textContent = 'Descripción / Notas';

    if (type === 'Civil') {
        patientSection.classList.remove('hidden');
    } else if (type === 'Convenio') {
        businessSection.classList.remove('hidden');
        agreementDates.classList.remove('hidden');
        
        // Ocultar campos innecesarios para Convenio
        patientNameGroup.classList.add('hidden');
        priorityGroup.classList.add('hidden');
        
        // Cambiar etiquetas
        businessNameLabel.textContent = 'Nombre de la Institución';
    } else if (type === 'Fiscalización') {
        businessSection.classList.remove('hidden');
        agreementDates.classList.remove('hidden');

        // Ocultar campos innecesarios para Fiscalización
        patientNameGroup.classList.add('hidden');
        priorityGroup.classList.add('hidden');

        // Cambiar etiquetas
        businessNameLabel.textContent = 'Nombre del Local';
        inspectionResultLabel.textContent = 'Resultado de la Fiscalización';
        descriptionLabel.textContent = 'Detalles de la Fiscalización';
    }
}

// Funciones del Modal
function openModal(record = null) {
    recordModal.classList.remove('hidden');
    if (record) {
        if (!isDirector()) {
            alert('No tienes permisos para editar registros.');
            recordModal.classList.add('hidden');
            return;
        }
        modalTitle.textContent = 'Editar Registro';
        document.getElementById('recordId').value = record.id;
        document.getElementById('medicName').value = record.medic || '';
        document.getElementById('fullName').value = record.name;
        document.getElementById('recordType').value = record.type;
        document.getElementById('recordDate').value = record.date;
        document.getElementById('recordStatus').value = record.status;
        document.getElementById('recordPriority').value = record.priority;
        document.getElementById('description').value = record.description;

        // Cargar datos de paciente si existen
        if (record.patientData) {
            document.getElementById('patientAge').value = record.patientData.age || '';
            document.getElementById('patientGender').value = record.patientData.gender || '';
            document.getElementById('chiefComplaint').value = record.patientData.complaint || '';
        } else {
            clearPatientFields();
        }

        // Cargar datos de negocio si existen
        if (record.businessData) {
            document.getElementById('businessName').value = record.businessData.name || '';
            document.getElementById('department').value = record.businessData.department || '';
            document.getElementById('inspectionResult').value = record.businessData.result || '';
            document.getElementById('startDate').value = record.businessData.startDate || '';
            document.getElementById('endDate').value = record.businessData.endDate || '';
        } else {
            clearBusinessFields();
        }

    } else {
        modalTitle.textContent = 'Nuevo Registro';
        recordForm.reset();
        document.getElementById('recordId').value = '';
        
        // Autocompletar con el usuario logueado
        if (currentUser) {
            document.getElementById('medicName').value = currentUser.fullName;
            document.getElementById('medicName').readOnly = true; // Opcional: Bloquear edición
        } else {
            document.getElementById('medicName').value = '';
        }

        document.getElementById('recordDate').value = new Date().toISOString().split('T')[0];
        clearPatientFields();
        clearBusinessFields();
    }
    setFormReadOnly(false);
    const btnSave = document.getElementById('btnSave');
    if (btnSave) btnSave.classList.remove('hidden');
    toggleSections(); // Asegurar estado correcto al abrir
}

function clearPatientFields() {
    document.getElementById('patientAge').value = '';
    document.getElementById('patientGender').value = '';
    document.getElementById('chiefComplaint').value = '';
}

function clearBusinessFields() {
    document.getElementById('businessName').value = '';
    document.getElementById('department').value = '';
    document.getElementById('inspectionResult').value = '';
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
}

function closeModal() {
    recordModal.classList.add('hidden');
    setFormReadOnly(false);
    const btnSave = document.getElementById('btnSave');
    if (btnSave) btnSave.classList.remove('hidden');
}

// CRUD
function saveRecordFromForm() {
    const id = document.getElementById('recordId').value;
    const medic = document.getElementById('medicName').value;
    let name = document.getElementById('fullName').value;
    const type = document.getElementById('recordType').value;
    const date = document.getElementById('recordDate').value;
    const status = document.getElementById('recordStatus').value;
    const priority = document.getElementById('recordPriority').value;
    const description = document.getElementById('description').value;

    // Si es Convenio o Fiscalización, usar el nombre del local como nombre principal
    if (type === 'Convenio' || type === 'Fiscalización') {
        name = document.getElementById('businessName').value;
    }

    // Recoger datos de paciente si es tipo Civil
    let patientData = {};
    if (type === 'Civil') {
        patientData = {
            age: document.getElementById('patientAge').value,
            gender: document.getElementById('patientGender').value,
            complaint: document.getElementById('chiefComplaint').value
        };
    }

    // Recoger datos de negocio si es Convenio o Fiscalización
    let businessData = {};
    if (type === 'Convenio' || type === 'Fiscalización') {
        businessData = {
            name: document.getElementById('businessName').value,
            department: document.getElementById('department').value,
            result: document.getElementById('inspectionResult').value,
            startDate: document.getElementById('startDate').value,
            endDate: document.getElementById('endDate').value
        };
    }

    if (id) {
        if (!isDirector()) {
            alert('No tienes permisos para editar registros.');
            return;
        }
        // Editar existente
        const index = records.findIndex(r => r.id === id);
        if (index !== -1) {
            records[index] = { 
                ...records[index], 
                medic, name, type, date, status, priority, description,
                patientData, // Guardar objeto de paciente
                businessData // Guardar objeto de negocio
            };
        }
    } else {
        // Nuevo registro
        const newRecord = {
            id: Date.now().toString(), // ID simple basado en timestamp
            medic,
            name,
            type,
            date,
            status,
            priority,
            description,
            patientData,
            businessData
        };
        records.push(newRecord);
    }

    saveRecords();
    closeModal();
}

window.editRecord = function(id) {
    if (!isDirector()) {
        alert('No tienes permisos para editar registros.');
        return;
    }
    const record = records.find(r => r.id === id);
    if (record) {
        openModal(record);
    }
};

window.viewRecord = function(id) {
    const record = records.find(r => r.id === id);
    if (!record) return;
    recordModal.classList.remove('hidden');
    modalTitle.textContent = 'Detalles del Registro';
    document.getElementById('recordId').value = record.id;
    document.getElementById('medicName').value = record.medic || '';
    document.getElementById('fullName').value = record.name || '';
    document.getElementById('recordType').value = record.type || '';
    document.getElementById('recordDate').value = record.date || '';
    document.getElementById('recordStatus').value = record.status || '';
    document.getElementById('recordPriority').value = record.priority || '';
    document.getElementById('description').value = record.description || '';

    if (record.patientData) {
        document.getElementById('patientAge').value = record.patientData.age || '';
        document.getElementById('patientGender').value = record.patientData.gender || '';
        document.getElementById('chiefComplaint').value = record.patientData.complaint || '';
    } else {
        clearPatientFields();
    }

    if (record.businessData) {
        document.getElementById('businessName').value = record.businessData.name || '';
        document.getElementById('department').value = record.businessData.department || '';
        document.getElementById('inspectionResult').value = record.businessData.result || '';
        document.getElementById('startDate').value = record.businessData.startDate || '';
        document.getElementById('endDate').value = record.businessData.endDate || '';
    } else {
        clearBusinessFields();
    }

    toggleSections();
    setFormReadOnly(true);
    const btnSave = document.getElementById('btnSave');
    if (btnSave) btnSave.classList.add('hidden');
};

function setFormReadOnly(readonly) {
    const elements = recordForm.querySelectorAll('input, select, textarea');
    elements.forEach(el => {
        if (el.id === 'recordId') {
            el.disabled = true;
            return;
        }
        if (readonly) {
            el.setAttribute('disabled', 'true');
        } else {
            el.removeAttribute('disabled');
        }
    });
}

window.deleteRecord = function(id) {
    if (!isDirector()) {
        alert('No tienes permisos para borrar registros.');
        return;
    }
    if (confirm('¿Estás seguro de que deseas eliminar este registro?')) {
        records = records.filter(r => r.id !== id);
        saveRecords();
    }
};

// Utilidades
function formatDate(dateString) {
    if (!dateString) return '';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
}

function truncateText(text, maxLength) {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    }
    return text;
}

function exportToCSV() {
    if (!isDirector()) {
        alert('No tienes permisos para exportar.');
        return;
    }
    if (records.length === 0) {
        alert('No hay datos para exportar.');
        return;
    }

    const headers = ['ID', 'Médico/Oficial', 'Paciente/Sujeto', 'Tipo', 'Fecha', 'Estado', 'Prioridad', 'Descripción', 'Edad Paciente', 'Género', 'Queja Principal', 'Nombre Local', 'Departamento', 'Resultado Inspección', 'Fecha Inicio', 'Fecha Término'];
    const csvContent = [
        headers.join(','),
        ...records.map(r => {
            const p = r.patientData || {};
            const b = r.businessData || {};
            
            return [
                r.id,
                `"${r.medic || ''}"`,
                `"${r.name}"`,
                r.type,
                r.date,
                r.status,
                r.priority,
                `"${r.description.replace(/"/g, '""')}"`, // Escapar comillas dobles
                p.age || '',
                p.gender || '',
                `"${(p.complaint || '').replace(/"/g, '""')}"`,
                `"${(b.name || '').replace(/"/g, '""')}"`,
                b.department || '',
                b.result || '',
                b.startDate || '',
                b.endDate || ''
            ].join(',');
        })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `ems_safr_data_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
