// js/controllers/productController.js
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService.js";

import { getCategories } from "../services/categoryService.js";

document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.querySelector("#itemsTable tbody");
  const form = document.getElementById("productForm");
  const modal = new bootstrap.Modal(document.getElementById("itemModal"));
  const modalLabel = document.getElementById("itemModalLabel");
  const btnAdd = document.getElementById("btnAdd");
  const select = document.getElementById("productCategory");

  btnAdd.addEventListener("click", () => {
    limpiarFormulario();
    modalLabel.textContent = "Agregar Producto";
    modal.show();
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    let id = form.productId.value;

    const payload = {
      nombre: form.productName.value.trim(),
      precio: Number(form.productPrice.value),
      descripcion: form.productDescription.value.trim(),
      stock: form.productStock.value.trim(),
      fechaIngreso: form.productDate.value,
      categoriaId: form.productCategory.value,
      usuarioId: 2
    };

    alert(JSON.stringify(payload) + " ,id:" + id);

    try {
      if (id) {
        await updateProduct(id, payload);
        id = null;
      } else {
        await createProduct(payload);
      }
      modal.hide();
      await cargarProductos();
    } catch (err) {
      console.error("Error guardando:", err);
    }
  });

  async function cargarProductos() {
    try {
      const items = await getProducts();
      tableBody.innerHTML = "";
      items.forEach((item) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${item.id}</td>
          <td>${item.nombre}</td>
          <td>${item.descripcion}</td>
          <td>${item.stock}</td>
          <td>${item.fechaIngreso}</td>
          <td>$${item.precio.toFixed(2)}</td>
          <td>
            <button class="btn btn-sm btn-outline-secondary me-1 edit-btn"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-pen-icon lucide-square-pen"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></svg></button>

            <button class="btn btn-sm btn-outline-danger delete-btn"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-icon lucide-trash"><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
          </td>
        `;
        tr.querySelector(".edit-btn").addEventListener("click", () =>
          setFormulario(item)
        );
        tr.querySelector(".delete-btn").addEventListener("click", () => {
          if (confirm("¿Eliminar este producto?")) {
            eliminarProducto(item.id);
          }
        });
        tableBody.appendChild(tr);
      });
    } catch (err) {
      console.error("Error cargando productos:", err);
    }
  }

  async function cargarCategorias() {
    try {
      const categories = await getCategories();
      select.innerHTML =
        '<option value="" disabled selected hidden>Seleccione...</option>';
      categories.forEach((c) => {
        select.innerHTML += `<option value="${c.idCategoria}" title="${c.descripcion}">${c.nombreCategoria}</option>`;
      });
    } catch (err) {
      console.error("Error cargando categorías:", err);
    }
  }

  function setFormulario(item) {
    form.productId.value = item.id;
    form.productName.value = item.nombre;
    form.productPrice.value = item.precio;
    form.productStock.value = item.stock;
    form.productDescription.value = item.descripcion;
    form.productCategory.value = item.categoriaId;
    form.productDate.value = item.fechaIngreso;
    modalLabel.textContent = "Editar Producto";
    modal.show();
  }

  function limpiarFormulario() {
    form.reset();
    form.productId.value = "";
  }

  async function eliminarProducto(id) {
    try {
      await deleteProduct(id);
      await cargarProductos();
    } catch (err) {
      console.error("Error eliminando:", err);
    }
  }

  // Cargar datos al inicio
  cargarCategorias();
  cargarProductos();
});
