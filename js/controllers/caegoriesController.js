import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
} from "../services/categoriesService.js";

document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.querySelector("#categoriesTable tbody"); //Tbody - Cuerpo de la tabla
    const form = document.getElementById("categoryForm"); //Formulario dentro del modal
    const modal = new bootstrap.Modal(document.getElementById("categoryModal")); //Modal
    const lblModal = document.getElementById("categoryModalLabel"); //Título del modal
    const btnAdd = document.getElementById("btnAddCategory"); //Botón para abrir el modal

    init(); //Este método permite cargar las categorías en la tabla

    //Acción cuando el boyón de Agregar Nueva categoria es presionado se abre el modal
    btnAdd.addEventListener("click", () => {
        form.reset();
        form.categoryId.value = ""; //No enviamos ID, ya que estamos agregando
        lblModal.textContent = "Agregar categoría"
        modal.show();
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault(); //Evitamos que el formulario se envíe al hacer "submit"
        const id = form.categoryId.value; //Obtenemos el ID del registro
        const data = {
            nombreCategoria: form.categoryName.value.trim(),
            descripcion: form.categoryDescription.value.trim()
        };

        try {
            //Si hay u ID, significa que estamos actualizando
            if (id) {
                await updateCategory(id, data);
            }
            else { //Si no hay un ID, significa que estamos agregando
                await createCategory(data);
            }
            modal.hide(); //Se oculta el formulario después de agregar/acctualizar
            await loadCategories(); //Nos permite cargar las categorias
        }
        catch (err) {
            console.error("Error: ", err);
        }
    });

    async function loadCategories() {
        try {
            const categories = await getCategories(); //Como en sevices se hace fetch aquí ponemos await, pi
            tableBody.innerHTML = ""; // Vaciamos la tabla
            //verificamos que si no hay categorias
            if (!categories || categories.length == 0) {
                tableBody.innerHTML = ' <td colspan="5"> Actualmente no hay registros</td>  ';
                return; //Evitamos que es ejecute el resto del código
            }

            categories.forEach((category) => {
                const tr = document.createElement("tr"); //Se crea el elemento con JS
                tr.innerHTML = `
                    <td>${category.idCategoria}</td>
                    <td>${category.nombreCategoria}</td>
                    <td>${category.descripcion || ""}</td>
                    <td>${category.fechaCreacion || ""}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-secondary edit-btn">
                        <svg xmlns="http://www.w3.org/2000/ svg" width="20" height="20"
                                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                                class="lucide lucide-square-pen">
                            <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/>
                        </svg>
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash2-icon lucide-trash-2"><path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                    </td>
                `;

                //Funcionalidad para botones de Editar
                tr.querySelector(".edit-btn").addEventListener("click", ()=>{
                    form.categoryId.value = category.idCategoria;
                    form.categoryName.value = category.nombreCategoria;
                    form.categoryDescription.value = category.descripcion;
                    lblModal.textContent = "Editar Categoría";

                    //El modal se carga hasta que el formulario ya tenga los datos cargados
                    modal.show();
                });

                //Funcionalidad para botones de Eliminar
                tr.querySelector(".delete-btn").addEventListener("click", ()=>{
                    if(confirm("¿Desea eliminar esta categoría?")){
                        deleteCategory(category.idCategoria).then(loadCategories);
                    }
                });

                tableBody.appendChild(tr); //Al tbody se le concatena la nueva fila creada
            });
        }
        catch(err){
            console.error("Error cargando categorías: ", err);
        }
    }

    function init(){
        loadCategories();
    }

}); // Esto no se toca aquí termina el evento