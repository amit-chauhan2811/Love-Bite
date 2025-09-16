//  Swiper setup (only runs if Swiper library is loaded)

if (typeof Swiper !== "undefined") {
    var swiper = new Swiper(".mySwiper", {
        loop: true,
        navigation: {
            nextEl: "#next",
            prevEl: "#prev",
        },
    });
}

// Selectors
const cartIcon = document.querySelector(".cart-icon");
const cartTab = document.querySelector(".cart-tab");
const closeBtn = document.querySelector(".close-btn");
const cardList = document.querySelector(".card-list");
const cartList = document.querySelector(".cart-list");
const cartTotal = document.querySelector(".cart-total");
const cartValue = document.querySelector(".cart-value");
const hamburger = document.querySelector(".hamburger");
const mobileMenu = document.querySelector(".mobile-menu");
const bars = document.querySelector(".fa-bars");

// State
let productList = [];
let cartProduct = JSON.parse(localStorage.getItem("listCart")) || [];

// Save to localStorage
const saveCart = () => {
    localStorage.setItem("listCart", JSON.stringify(cartProduct));
};

// Events
if (cartIcon && cartTab && closeBtn) {
    cartIcon.addEventListener("click", () => {
        cartTab.classList.add("cart-tab-active");
    });
    closeBtn.addEventListener("click", () => {
        cartTab.classList.remove("cart-tab-active");
    });
}

// ✅ Hamburger toggle (safe check)
if (hamburger && mobileMenu && bars) {
    hamburger.addEventListener("click", () => {
        mobileMenu.classList.toggle("mobile-menu-active");
        bars.classList.toggle("fa-xmark");
    });
}

// Update totals
const updateTotals = () => {
    let totalPrice = 0;
    let totalQuantity = 0;

    cartProduct.forEach(product => {
        totalPrice += product.price * product.quantity;
        totalQuantity += product.quantity;
    });

    if (cartTotal) cartTotal.textContent = `₹${totalPrice.toFixed(2)}`;
    if (cartValue) cartValue.textContent = totalQuantity;

    saveCart();
};

// Show product cards
const showCards = () => {
    if (!cardList) return;

    productList.forEach(product => {
        const orderCard = document.createElement("div");
        orderCard.classList.add("order-card");

        orderCard.innerHTML = `
            <div class="card-image">
                <img src="${product.image}">
            </div>
            <h4>${product.name}</h4>
            <h4 class="price">₹${product.price}</h4>
            <a href="#" class="btn card-btn">Add To Cart</a>
        `;
        cardList.appendChild(orderCard);

        const cardBtn = orderCard.querySelector(".card-btn");
        cardBtn.addEventListener("click", (e) => {
            e.preventDefault();
            addToCart(product);
        });
    });
};

// Add product to cart
const addToCart = (product) => {
    const existingProduct = cartProduct.find(item => item.id === product.id);
    if (existingProduct) {
        alert("Item already in your cart");
        return;
    }

    cartProduct.push({
        ...product,
        price: Number(product.price.toString().replace("₹", "")),
        quantity: 1
    });

    renderCart();
    saveCart();
};

// Render cart tab
const renderCart = () => {
    if (!cartList) return;
    cartList.innerHTML = "";

    cartProduct.forEach(product => {
        let quantity = product.quantity;
        let price = product.price;

        const cartItem = document.createElement("div");
        cartItem.classList.add("item");

        cartItem.innerHTML = `
            <div class="item-image">
                <img src="${product.image}">
            </div>
            <div class="detail">
                <h4>${product.name}</h4>
                <h4 class="item-total">₹${price * quantity}</h4>
            </div>
            <div class="flex">
                <a href="#" class="quantity-btn minus"><i class="fa-solid fa-minus"></i></a>
                <h4 class="quantity-value">${quantity}</h4>
                <a href="#" class="quantity-btn plus"><i class="fa-solid fa-plus"></i></a>
            </div>
        `;
        cartList.appendChild(cartItem);

        const plusBtn = cartItem.querySelector(".plus");
        const minusBtn = cartItem.querySelector(".minus");
        const quantityValue = cartItem.querySelector(".quantity-value");
        const itemTotal = cartItem.querySelector(".item-total");

        plusBtn.addEventListener("click", (e) => {
            e.preventDefault();
            quantity++;
            product.quantity = quantity;
            quantityValue.textContent = quantity;
            itemTotal.textContent = `₹${price * quantity}`;
            updateTotals();
        });

        minusBtn.addEventListener("click", (e) => {
            e.preventDefault();
            if (quantity > 1) {
                quantity--;
                product.quantity = quantity;
                quantityValue.textContent = quantity;
                itemTotal.textContent = `₹${price * quantity}`;
                updateTotals();
            } else {
                cartItem.remove();
                cartProduct = cartProduct.filter(item => item.id !== product.id);
                updateTotals();
            }
        });
    });

    updateTotals();
};

// Init
const initApp = () => {
    if (!cardList) return;

    fetch("product.json")
        .then(response => response.json())
        .then(data => {
            productList = data.map(p => ({
                ...p,
                price: Number(p.price.toString().replace("₹", ""))
            }));
            showCards();
            renderCart();
        });
};

initApp();
