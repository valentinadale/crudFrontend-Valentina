document.addEventListener('DOMContentLoaded', () => {
    // Cambia esta URL por tu endpoint base
    const API_URL = 'https://TU_API/aqui';
  
    const tableBody = document.querySelector('#categoriesTable tbody');
    const form = document.getElementById('categoryForm');
    const modalEl = document.getElementById('categoryModal');
    const modal = new bootstrap.Modal(modalEl);
    const modalTitle = document.getElementById('categoryModalLabel');
    const btnAdd = document.getElementById('btnAddCategory');
  
    // Al arrancar
    cargarCategorias();
  
    // Click en "Agregar"
    btnAdd.addEventListener('click', () => {
      limpiarFormulario();
      modalTitle.textContent = 'Agregar Categoría';
    });
  
    // Submit del formulario
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('categoryId').value;
      const nombre = document.getElementById('categoryName').value.trim();
  
      try {
        if (id) {
          // EDITAR
          await fetch(`${API_URL}/categories/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre }),
          });
        } else {
          // CREAR
          await fetch(`${API_URL}/categories`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nombre }),
          });
        }
        modal.hide();
        cargarCategorias();
      } catch (err) {
        console.error('Error guardando categoría:', err);
      }
    });
  
    // Carga todas las categorías y pinta la tabla
    async function cargarCategorias() {
      try {
        const res = await fetch(`${API_URL}/categories`);
        const cats = await res.json();
        tableBody.innerHTML = '';
        cats.forEach(cat => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td>${cat.id}</td>
            <td>${cat.nombre}</td>
            <td class="text-end">
              <button class="btn btn-sm btn-outline-secondary edit-btn me-1">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-sm btn-outline-danger delete-btn">
                <i class="bi bi-trash"></i>
              </button>
            </td>
          `;
          // EDITAR
          tr.querySelector('.edit-btn').addEventListener('click', () => {
            setFormulario(cat);
          });
          // ELIMINAR
          tr.querySelector('.delete-btn').addEventListener('click', () => {
            if (confirm('¿Eliminar esta categoría?')) {
              eliminarCategoria(cat.id);
            }
          });
          tableBody.appendChild(tr);
        });
      } catch (err) {
        console.error('Error cargando categorías:', err);
      }
    }
  
    // Rellena el modal para editar
    function setFormulario(cat) {
      document.querySelector('#categoryId').value = cat.id;
      document.querySelector('#categoryName').value = cat.nombre;
      modalTitle.textContent = 'Editar Categoría';
      modal.show();
    }
  
    // Limpia el modal
    function limpiarFormulario() {
      form.reset();
      document.querySelector('#categoryId').value = '';
    }
  
    // Borra una categoría
    async function eliminarCategoria(id) {
      try {
        await fetch(`${API_URL}/categories/${id}`, { method: 'DELETE' });
        cargarCategorias();
      } catch (err) {
        console.error('Error eliminando categoría:', err);
      }
    }
  });
  