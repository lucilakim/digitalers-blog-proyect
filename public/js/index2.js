const moreButton = document.querySelectorAll('.more')

for (let i = 0; i < moreButton.length; i++) {
    moreButton[i].addEventListener('click', () => {
        moreButton[i].children[1].classList.toggle('d-none');
    })
}

// Delete Modal
const deleteModal = document.getElementById('deleteModal')
deleteModal.addEventListener('show.bs.modal', event => {

    const button = event.relatedTarget
    
    //consumiendo data
    const id = button.getAttribute('data-bs-id') // obtenemos el atributo 
    const deleted = "?_method=DELETE"
    const title = button.getAttribute('data-bs-title')

    //cambiando el titulo al modal
    const modalTitle = deleteModal.querySelector('.modal-title span')
    modalTitle.textContent = `  -  "${title}"`

    //mod form
    let deleteForm = deleteModal.querySelector('#deleteForm') // buscamos algun elmento para hacerle algo
    let action = deleteForm.getAttribute("data-bs-action")

    //para limpiar el action, y que no se concantene entre ellos
    deleteForm.setAttribute("action",action+id+deleted)
})

// Back Button
const backButton = document.querySelector('#backButton')
backButton.addEventListener('click', (e)=>{
    history.back();
})
// Next Button 
const nextButton = document.querySelector('#nextButton')
nextButton.addEventListener('click', (e)=>{
    history.forward();
})
