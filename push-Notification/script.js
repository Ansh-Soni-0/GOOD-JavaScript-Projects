const button = document.querySelector('.btn button');
const notification = document.querySelector('.notification span');

let value = 0;
button.addEventListener('click' , () => {
    value++;
    notification.innerHTML = value;
})
