const API_URL = 'http://localhost:8080/api/products';

export async function getProducts(page = 0, size = 10) {
    const res = await fetch(`${API_URL}/getAllProducts?page=${page}&size=${size}`);
    return res.json();
}

export async function createProduct(data) {
    await fetch(`${API_URL}/newProduct`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    });
}

export async function updateProduct(id, data) {
    await fetch(`${API_URL}/updateProduct/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data),
    });    
}

export async function deleteProduct(id) {
    await fetch(`${API_URL}/deleteProduct/${id}`, {method: 'DELETE'});
}