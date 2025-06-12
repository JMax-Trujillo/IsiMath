document.addEventListener('DOMContentLoaded', function() {
const menuHeaders = document.querySelectorAll('.menu-header');

menuHeaders.forEach(header => {
    header.addEventListener('click', function() {
        const sectionId = this.getAttribute('data-section');
        const submenu = document.getElementById(`${sectionId}-submenu`);
        
        this.classList.toggle('active');
        
        submenu.classList.toggle('active');
    });
});
const submenuItems = document.querySelectorAll('.submenu-item');
const welcomeMessage = document.getElementById('welcome-message');
const toolContainers = document.querySelectorAll('.tool-container');

submenuItems.forEach(item => {
    item.addEventListener('click', function() {
        const toolId = this.getAttribute('data-tool');
        
        welcomeMessage.style.display = 'none';
        
        toolContainers.forEach(container => {
            container.classList.remove('active');
        });
        
        document.getElementById(toolId).classList.add('active');
        
        submenuItems.forEach(item => {
            item.classList.remove('active');
        });
        this.classList.add('active');
    });
});
const menuToggle = document.querySelector('.menu-toggle');
const sidebar = document.querySelector('.sidebar');

if (window.innerWidth <= 768) {
    menuToggle.style.display = 'flex';
}

window.addEventListener('resize', function() {
    if (window.innerWidth <= 768) {
        menuToggle.style.display = 'flex';
    } else {
        menuToggle.style.display = 'none';
        sidebar.classList.add('active');
    }
});

menuToggle.addEventListener('click', function() {
    sidebar.classList.toggle('active');
});
});