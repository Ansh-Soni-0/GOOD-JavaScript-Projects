const iconCart = document.querySelector(".icon-cart");
const body = document.querySelector('body');
const closeBtn = document.querySelector(".close");
const listProductHTML = document.querySelector('.listProduct')
const listCartHTML = document.querySelector('.listCart')
const iconCartSpan = document.querySelector('.icon-cart span')

let listProducts = [];
let carts = [];
//cart is toggle when click on card icon
iconCart.addEventListener('click' , () => {
    body.classList.toggle('showCart')
})

//cart container is remove when click on close button
closeBtn.addEventListener('click' , () => {
    body.classList.remove('showCart')
})


const addDataToHTML = () => {
    listProductHTML.innerHTML = '';
    if(listProducts.length > 0){
        
        listProducts.forEach(product => {
            
            let newProduct = document.createElement('div');
            newProduct.classList.add('item');
            // give an unique id 
            newProduct.dataset.id = product.id;
            newProduct.innerHTML = `
                <img src="${product.image}" alt="">
                <h2>${product.name}</h2>
                <div class="price">$${product.price}</div>

                <button class="addCard">
                    Add To Cart
                </button>
            `;
            listProductHTML.appendChild(newProduct);
        })
    }
}

listProductHTML.addEventListener('click' , (event) => {
    let positionClick = event.target;
    if(positionClick.classList.contains('addCard')){
        let product_id = positionClick.parentElement.dataset.id
        // console.log(product_id);
        addToCart(product_id);
    }
})

const addToCart = (product_id) => {
    let positionThisProductIncart = carts.findIndex((value) => value.product_id == product_id)
    if(carts.length <= 0){
        carts = [{
            product_id: product_id,
            quantity:1
        }]
    } else if(positionThisProductIncart < 0){
        carts.push({
            product_id: product_id,
            quantity: 1
        });
    } else {
        carts[positionThisProductIncart].quantity += 1;
    }
    addCartToHTML();
    addcartToMemory();
}


// local storage doese noty allows the value as array so we convert the array items to string 
const addcartToMemory = () => {
    localStorage.setItem('cart' , JSON.stringify(carts));
}


const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    if(carts.length > 0){
        carts.forEach(cart => {
            totalQuantity += cart.quantity;
            let newCart = document.createElement('div');
            newCart.classList.add('item');

            newCart.dataset.id = cart.product_id;

            let positionProduct = listProducts.findIndex((value) => value.id == cart.product_id);
            
            let info = listProducts[positionProduct];
            newCart.innerHTML = `
                <div class="image">
                    <img src="${info.image}" alt="">
                </div>
                <div class="name">
                    ${info.name}
                </div>
                <div class="totalPrice">
                    $${info.price * cart.quantity}
                </div>
                <div class="quantity">
                    <span class="minus"><</span>
                    <span>${cart.quantity}</span>
                    <span class="plus">></span>
                </div>
            `;

            listCartHTML.appendChild(newCart);
        })
    }
    iconCartSpan.innerText = totalQuantity;
}

listCartHTML.addEventListener('click' , (event) => {
    let positionClick = event.target;
    if(positionClick.classList.contains('minus')  || positionClick.classList.contains('plus')){

        let product_id = positionClick.closest('.item').dataset.id;

        // console.log(product_id);
        
        let type = 'minus';
        if(positionClick.classList.contains('plus')){
            type = 'plus';
        }

        // let type = positionClick.classList.contains('plus') ? 'plus' : 'minus';


        changeQuantity(product_id , type);
    }
})


const changeQuantity = (product_id , type) => {
    let positionItemInCart = carts.findIndex((value) => value.product_id == product_id);

    if(positionItemInCart >= 0){
        switch (type) {
            case 'plus':
                carts[positionItemInCart].quantity = carts[positionItemInCart].quantity + 1;
                break;
        
            default:

                let valueChange = carts[positionItemInCart].quantity - 1;

                if(valueChange > 0){
                    carts[positionItemInCart].quantity = valueChange;
                } else {
                    carts.splice(positionItemInCart , 1);
                }
                break;
        }
    }
    addcartToMemory();
    addCartToHTML();
}


const initApp = () => {
    fetch('prducts.json')
    .then(responce => responce.json())
    .then(data => {
        listProducts = data;
        addDataToHTML();

        //get cart from memory
        //convert array to json to store in memory b'coz memory not allows the array
        if(localStorage.getItem('cart')){
            carts = JSON.parse(localStorage.getItem('cart'));
            addCartToHTML();
        }
    })
}

initApp()