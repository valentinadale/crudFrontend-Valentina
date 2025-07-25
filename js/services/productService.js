// js/services/productService.js
const API_URL = 'http://10.10.0.97:8080/api/products';

export async function getProducts() {
  const res = await fetch(`${API_URL}/getDataProducts`);
  return res.json();
}

export async function createProduct(payload) {
  await fetch(`${API_URL}/newProduct`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function updateProduct(id, payload) {
  await fetch(`${API_URL}/updateProduct/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

export async function deleteProduct(id) {
  await fetch(`${API_URL}/deleteProduct/${id}`, { method: 'DELETE' });
}
