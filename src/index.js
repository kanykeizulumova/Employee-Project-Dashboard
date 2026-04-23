import './style.css';
import catalogDt from './data.json';
console.log('Данные загружены через import:', catalogDt);


const openButton = document.getElementById('open-button');
const toggleButton = document.getElementById('toggle-button');
const sidePanel = document.getElementById('side-panel');


toggleButton.addEventListener('click', (e) => {
    sidePanel.classList.add('hidden');
    openButton.classList.remove('hidden');
})

openButton.addEventListener('click', (e) => {
    sidePanel.classList.remove('hidden');
    openButton.classList.add('hidden');
})
