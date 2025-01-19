const cart = document.querySelector('.cart')
const cartIcon = document.querySelector('.cart-icon')
const cartClose = document.querySelector('#cart-close')

// open cart
cartIcon.addEventListener('click' , () => cart.classList.add("active"));
// remove cart
cartClose.addEventListener('click' , () => cart.classList.remove("active"));

const addCartButton = document.querySelectorAll('.add-cart');

addCartButton.forEach(button => {
    button.addEventListener('click' , (event) => {
        const productBox = event.target.closest(".product-box");
        addToCart(productBox);
    })
})

const cartContent = document.querySelector('.cart-content');
const addToCart = (productBox) => {

    const productImgSrc = productBox.querySelector("img").src;
    const productTitle  = productBox.querySelector(".product-title").textContent;
    const productPrice  = productBox.querySelector(".price").textContent;


    //check if the item is already exist the not added in to the cart.
    const cartItems = cartContent.querySelectorAll(".cart-product-title");
    for(let item of cartItems){
        if(item.innerHTML === productTitle){
            alert("this items is already in the cart.");
            return;
        }
    }

    const cartBox = document.createElement('div');
    cartBox.classList.add("cart-box");
    cartBox.innerHTML = `
        <img src="${productImgSrc}" alt="cart-item">

        <div class="cart-detail">
            <h2 class="cart-product-title">${productTitle}</h2>
            <span class="cart-price">${productPrice}</span>
            <div class="cart-quantity">
                <button id="decrement">-</button>
                <div class="number">1</div>
                <button id="increment">+</button>
            </div>
        </div>
        <i class="ri-delete-bin-6-fill cart-remove"></i>
    `;
    //add cartbox in to the cart
    cartContent.appendChild(cartBox);

    // remove the cartBox if the trase icon is hiting
    const removeitem = cartBox.querySelector('.cart-remove')
    removeitem.addEventListener('click' , () => {
        cartBox.remove();
        // when delete the product from cart then also update the total price
        updateTotalPrice();
        // update the cart count by decrement by 1
        updateCartCount(-1);
    })

    //manage increment and decrement button
    const cartQuantity = cartBox.querySelector('.cart-quantity');

    cartQuantity.addEventListener('click' , (event) => {
        const numberElement = cartBox.querySelector('.number');
        //to manage the decrement button
        const decrementButton = cartBox.querySelector('#decrement');
        let quantity = numberElement.textContent;

        if(event.target.id === "decrement" && quantity > 1){
            quantity--;
            if(quantity === 1){
                decrementButton.style.color = "#999";
            }
        } else if(event.target.id === "increment"){
            quantity++;
            decrementButton.style.color = "#333";
        }

        numberElement.textContent = quantity;
        updateTotalPrice();
    });
    updateTotalPrice();

    // each time one item increase to cart icon count 
    updateCartCount(1);
};

const updateTotalPrice = () => {
    const totalPriceElement = document.querySelector('.total-price');
    const cartBox = document.querySelectorAll('.cart-box');
    let total = 0;
    cartBox.forEach(cartBox => {
        const priceElement = cartBox.querySelector('.cart-price');
        const quantityElement = cartBox.querySelector('.number');
        const price = priceElement.textContent.replace("$","");
        const quanitity = quantityElement.textContent;
        total += (price*quanitity);
    })
    totalPriceElement.textContent = `$${total}`;
}

let cartItemCount = 0;
const updateCartCount = (change) => {
    const cartItemCountBadge = document.querySelector('.cart-item-count');

    cartItemCount += change;

    if(cartItemCount > 0){
        cartItemCountBadge.style.visibility = "visible";
        cartItemCountBadge.textContent = cartItemCount;
    } else {
        cartItemCountBadge.style.visibility = "hidden";
        cartItemCountBadge.textContent = '';
    }
};

const BuyBtn = document.querySelector('.btn-buy');
BuyBtn.addEventListener('click' , () => {
    const cartBoxes = cartContent.querySelectorAll('.cart-box');
    if(cartBoxes.length === 0){
        alert("your cart is empty. please add items to your cart before buying.");
        return;
    }
    cartBoxes.forEach(cartBoxes => cartBoxes.remove());

    cartItemCount = 0;

    updateCartCount(cartItemCount);

    updateTotalPrice();

    alert("thank you for your purchase!❤️");
});