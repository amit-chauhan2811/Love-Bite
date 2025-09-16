let listCart = [];

// Load from localStorage
function checkCart() {
    const data = localStorage.getItem("listCart");
    if (data) {
        listCart = JSON.parse(data);
    }
}

checkCart();
addCartToHtml();

function addCartToHtml() {
    let listCartHtml = document.querySelector(".returnCart .list");
    listCartHtml.innerHTML = "";

    let totalQuantityHtml = document.querySelector(".totalQuantity");
    let totalPriceHtml = document.querySelector(".totalPrice");
    let totalQuantity = 0;
    let totalPrice = 0;

    if (listCart && listCart.length > 0) {
        listCart.forEach(product => {
            let price = Number(product.price);

            let newP = document.createElement("div");
            newP.classList.add("item");
            newP.innerHTML = `
                <img src="${product.image}" alt="">
                <div class="info">
                    <div class="name"><h4>${product.name}</h4></div>
                    <div class="price"><h4>₹${price}/1 product</h4></div>
                    <div class="quantity">${product.quantity}</div>
                    <div class="returnPrice">₹${price * product.quantity}</div>
                </div>
            `;
            listCartHtml.appendChild(newP);

            totalQuantity += product.quantity;
            totalPrice += price * product.quantity;
        });
    }

    totalQuantityHtml.innerHTML = totalQuantity;
    totalPriceHtml.innerHTML = "₹" + totalPrice.toFixed(2);
}
