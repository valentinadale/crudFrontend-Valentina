const API_URL = "http://localhost:8080/api/category"

//Funcion para acceder al endpoint GET
export async function getCategories(){
    const res = await fetch(`${API_URL}/getDataCategories`); //nombre del endpoint 
    return res.json();
}

export async function createCategories(data) { //data son los datos que se pide la funcion para ingresarlos en la base 
    await fetch(`${API_URL}/newCategory`, {
        metoth: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
}

export async function updateCategory(id, data){
    await fetch(`${API_URL}/updateCategory/${id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    });
}

export async function deleteCategory(id) {
    await fetch(`${API_URL}/deleteCategory/${id}`, {
        method: 'DELETE'
    });
}