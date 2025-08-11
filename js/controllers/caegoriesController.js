//javascript modular, importar objetos
import{
    getCategories, 
    createCategories, //metodos del service
    updateCategory,
    deleteCategory
}from '../services/categoriesService.js'; //ruta de donde estoy sacando los metodos

document.addEventListener('DOMContentLoaded', ()=>{
    const tableBody = document.querySelector('#categoriesTable tbody');//querySelector permite agarrar un monton de elementos, cuando se utiliza querySelector el id tiene que ir con un #
    const form = document.getElementById('categoryForm'); //Tbody cuerpo de la tabla
    const modal = new bootstrap.Modal(document.getElementById('categoryModal'));//formulario dentro del modal
    const lblModal = document.getElementById('categoryModalLabel'); //titulo del modal
    const btnAdd = document.getElementById('btnAddCategory')//boton para abrir el modal para agregar una nueva categoria
    
    init(); //hay que crear este metodo

    //accion cuando el boton 'agregar nueva categoria' es presionado (abrir el modal)
    btnAdd.addEventListener('click', ()=>{
        form.reset();
        form.categoryId.value = '';
        lblModal.textContent = 'Agregar categoría';
        modal.show();
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault(); //evitamos que el formulario se envie al hacer submit
        const id = form.categoryId.value; //obtenemos el id del registro
        const data = { //obteniendo los datos que vienen del formulario
            nombreCategoria: form.categoryName.vale.trim(),
            descripcion: form.categoryDescription.value.trim()
        };

        try{
            //si hay un id se hara una actualización
            if(id){
                await updateCategory(id, data);
            }
            else{ //si no hay un id se esta haciendo una inserción
                await createCategories(data);
            }

            modal.hide(); //se oculta el formulario despues de agregar/actualizar
            await loadCategories(); //nos permite cargar las categorias
        }
        catch(err){
            console.error("Error: ", err);
        }
    });

    async function loadCategories(){

        try{
            const categories = await getCategories();
            tableBody.innerHTML = ""; //vaciamos la tabla

            if(!categories || categories.lenght == 0){
                tableBody.innerHTML = '<td colspan="5"> Actualmente no hay registros</td>';
                return; //evitamos que se ejecute el reso del codigo
            }

            categories.forEach((cat)=>{
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${cat.idCategoria}</td>
                    <td>${cat.nombreCategoria}</td>
                    <td>${cat.descripcion || ""}</td>
                    <td>${cat.fechaCreacion || ""}</td>
                    <td>${cat.idCategoria}</td>
                    <td>
                        <button class="btn btn-sm btn-outline-secondary edit-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="lucide lucide-square-pen">
                            <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/>
                            </svg>
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="lucide lucide-trash">
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                            <path d="M3 6h18"/>
                            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                        </button>
                    </td>
                `;

                //funcionaliad para botones de editar
                tr.querySelector(".edit-btn").addEventListener("click", ()=>{
                    form.categoryId.value = cat.idCategoria;
                    form.categoryName.value = cat.nombreCategoria;
                    form.categoryDescription.value = cat.descripcion;
                    lblModal.textContent = "Editar categoria";
                    modal.show();
                });

                //funcionalidad para botones de eliminar
                tr.querySelector(".delete-btn").addEventListener('click', () =>{
                    if(confirm("¿Desea eliminar esta categoria?")){
                        deleteCategory(cat.idCategoria).then(loadCategories);
                    }
                });

                tableBody.appendChild(tr); //al tbody se le concatena la nueva fila creada

            });
        }

        catch(err){
            console.error("Error cargando categorias: ", err);
        }
        
    }

    function init(){
        loadCategories();
    }

});
