document.addEventListener('DOMContentLoaded', () => {
  // Cambia esta URL por tu endpoint
  const API_URL = 'http://10.10.0.97:8080/api/products';

  const itemsTableBody = document.querySelector('#itemsTable tbody');
  const itemForm = document.getElementById('itemForm');
  const itemModalEl = document.getElementById('itemModal');
  const itemModal = new bootstrap.Modal(itemModalEl);
  const itemModalLabel = document.getElementById('itemModalLabel');
  const btnAdd = document.getElementById('btnAdd');

  // Inicializa
  cargarCategorias();
  cargarProductos();

  // Al hacer clic en "Agregar"
  btnAdd.addEventListener('click', () => {
    limpiarFormulario();
    itemModalLabel.textContent = 'Agregar Producto';
  });

  // Enviar formulario (create / update)
  itemForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('itemId').value;
    
    const payload = {
      nombre: document.getElementById('itemName').value.trim(),
      precio: parseFloat(document.getElementById('itemPrice').value),
      categoriaId: document.getElementById('itemCategory').value,
    };

    try {
      if (id) {
        // UPDATE
        await fetch(`${API_URL}/items/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        // CREATE
        await fetch(`${API_URL}/items`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      itemModal.hide();
      cargarProductos();
    } catch (err) {
      console.error('Error guardando:', err);
    }
  });

  // Leer y mostrar todos los productos
  async function cargarProductos() {
    try {
      const res = await fetch(`${API_URL}/getData`);
      const items = await res.json();
      itemsTableBody.innerHTML = '';
      items.forEach((item) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${item.id}</td>
            <td>${item.nombre}</td>
            <td>${item.descripcion}</td>
            <td>${item.stock}</td>
            <td>${item.fechaIngreso}</td>
            <td>$${item.precio.toFixed(2)}</td>
            <td>
              <button class="btn btn-sm btn-outline-secondary me-1 edit-btn">
                ✏️
              </button>
              <button class="btn btn-sm btn-outline-danger delete-btn">
                🗑️
              </button>
            </td>
          `;
        // Editar
        tr.querySelector('.edit-btn').addEventListener('click', () => {
          setFormulario(item);
        });
        // Eliminar
        tr.querySelector('.delete-btn').addEventListener('click', () => {
          if (confirm('¿Eliminar este producto?')) {
            eliminarProducto(item.id);
          }
        });
        itemsTableBody.appendChild(tr);
      });
    } catch (err) {
      console.error('Error cargando productos:', err);
    }
  }

  // Leer categorías para el select
  async function cargarCategorias() {
    try {
      const res = await fetch(`${API_URL}/categories`);
      const cats = await res.json();
      const select = document.getElementById('itemCategory');
      select.innerHTML = '<option value="">Seleccione...</option>';
      cats.forEach((c) => {
        select.innerHTML += `<option value="${c.id}">${c.nombre}</option>`;
      });
    } catch (err) {
      console.error('Error cargando categorías:', err);
    }
  }

  // Rellenar el formulario para editar
  function setFormulario(item) {
    document.getElementById('itemId').value = item.id;
    document.getElementById('itemName').value = item.nombre;
    document.getElementById('itemPrice').value = item.precio;
    document.getElementById('itemCategory').value = item.categoriaId;
    itemModalLabel.textContent = 'Editar Producto';
    itemModal.show();
  }

  // Limpiar formulario
  function limpiarFormulario() {
    itemForm.reset();
    document.getElementById('itemId').value = '';
  }

  // DELETE
  async function eliminarProducto(id) {
    try {
      await fetch(`${API_URL}/items/${id}`, { method: 'DELETE' });
      cargarProductos();
    } catch (err) {
      console.error('Error eliminando:', err);
    }
  }
});
