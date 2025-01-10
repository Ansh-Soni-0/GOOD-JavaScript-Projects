const sidebar = document.querySelector(".sidebar");
const sidebarToggler = document.querySelector(".sidebar-toggler");

sidebarToggler.addEventListener('click' , () => {
    sidebar.classList.toggle('collapsed')
})

