
// ======================================
// PC ZONE - Shopping Cart System
// ======================================

let cart = [];

// HTML Elements
const cartCount = document.getElementById("cart-count");
const cartCountLabel = document.getElementById("cart-count-label");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const summaryCount = document.getElementById("summary-count");

const openCartButton = document.getElementById("open-cart");
const clearCartButton = document.getElementById("clear-cart");
const shoppingCart = document.getElementById("shopping-cart");

// Load Saved Cart
try {
    const savedCart = JSON.parse(localStorage.getItem("pczone-cart"));

    if (Array.isArray(savedCart)) {
        cart = savedCart
            .filter(item =>
                item &&
                item.id &&
                item.name &&
                Number.isFinite(Number(item.price)) &&
                Number(item.price) > 0 &&
                Number.isInteger(item.quantity) &&
                item.quantity > 0
            )
            .map(item => ({
                id: String(item.id),
                name: String(item.name),
                price: Number(item.price),
                quantity: item.quantity
            }));
    }
} catch (error) {
    console.error("Cart loading error:", error);
    cart = [];
}

// Save Cart
function saveCart() {
    try {
        localStorage.setItem("pczone-cart", JSON.stringify(cart));
    } catch (error) {
        console.error("Cart saving error:", error);
    }
}

// Render Shopping Cart
function renderCart() {
    if (!cartCount || !cartItems || !cartTotal) {
        console.error("PC ZONE: Cart HTML elements are missing.");
        return;
    }

    const count = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    cartCount.textContent = count;

    if (cartCountLabel) {
        cartCountLabel.textContent = count;
    }

    if (summaryCount) {
        summaryCount.textContent = count;
    }

    cartItems.innerHTML = "";

    if (cart.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "empty-cart";
        emptyMessage.textContent = "Your cart is empty.";
        cartItems.appendChild(emptyMessage);
    }

    cart.forEach(function(item) {
        const row = document.createElement("div");
        row.className = "cart-item";

        const name = document.createElement("span");
        name.textContent = item.name;

        const quantityBox = document.createElement("div");
        quantityBox.className = "quantity-controls";

        const minusButton = document.createElement("button");
        minusButton.type = "button";
        minusButton.textContent = "−";
        minusButton.className = "quantity-btn";
        minusButton.setAttribute("aria-label", "Decrease quantity");

        const quantity = document.createElement("span");
        quantity.textContent = item.quantity;

        const plusButton = document.createElement("button");
        plusButton.type = "button";
        plusButton.textContent = "+";
        plusButton.className = "quantity-btn";
        plusButton.setAttribute("aria-label", "Increase quantity");

        const price = document.createElement("strong");
        price.textContent =
            (item.price * item.quantity).toLocaleString("en-US") + " EGP";

        minusButton.addEventListener("click", function() {
            removeFromCart(item.id);
        });

        plusButton.addEventListener("click", function() {
            item.quantity++;
            renderCart();
        });

        quantityBox.append(minusButton, quantity, plusButton);
        row.append(name, quantityBox, price);
        cartItems.appendChild(row);
    });

    const total = cart.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    cartTotal.textContent = total.toLocaleString("en-US");

    saveCart();
}

// Add Products to Cart
document.addEventListener("click", function(event) {
    const button = event.target.closest(".add-cart");

    if (!button) return;

    const id = button.dataset.id;
    const name = button.dataset.name;
    const price = Number(button.dataset.price);

    if (!id || !name || !Number.isFinite(price) || price <= 0) {
        console.error("Invalid product information:", button);
        return;
    }

    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            id: id,
            name: name,
            price: price,
            quantity: 1
        });
    }

    renderCart();

    button.textContent = "Added ✓";

    setTimeout(function() {
        button.textContent = "Add to Cart";
    }, 1000);
});

// Remove Product Quantity
function removeFromCart(id) {
    const item = cart.find(item => item.id === id);

    if (!item) return;

    if (item.quantity > 1) {
        item.quantity--;
    } else {
        cart = cart.filter(item => item.id !== id);
    }

    renderCart();
}

// Clear Entire Cart
if (clearCartButton) {
    clearCartButton.addEventListener("click", function() {
        cart = [];
        renderCart();
    });
}

// Open Shopping Cart
if (openCartButton && shoppingCart) {
    openCartButton.addEventListener("click", function() {
        shoppingCart.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
}

// Initial Render
renderCart();

console.log("PC ZONE is ready!");
