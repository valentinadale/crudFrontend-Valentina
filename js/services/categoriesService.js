const API_URL = "http://localhost:8080/api/category"

export async function getCategories(){
    const res = await fetch(`${API_URL}/getDataCategories`);
    return res.json();
}

export async function createCategory(data) { //"data" son los datos que se guardan
    await fetch(`${API_URL}/newCategory`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });
}

export async function updateCategory(id, data) {
    await fetch(`${API_URL}/updateCategory/${id}`, {
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data)
    });
}

export async function deleteCategory (id) {
    await fetch(`${API_URL}/deleteCategory/${id}`, {
        method: "DELETE"
    });
}