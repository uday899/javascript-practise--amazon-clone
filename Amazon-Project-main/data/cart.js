export let cart;

loadFromStorage();

export function loadFromStorage() {
  cart = JSON.parse(localStorage.getItem("cart")) || [
    {
      productId: "e43638ce-6aa0-4b85-b27f-e1d07eb678c6",
      quantity: 2,
      deliveryOptionId: "1",
      updateStatus: false
    },
    {
      productId: "15b6fc6f-327a-4ec4-896f-486349e85a3d",
      quantity: 1,
      deliveryOptionId: "2",
      updateStatus: false
    },
  ];
}

export function saveToStorage() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

export function addToCart(productId) {
  const selectElement = document.querySelector(
    `.js-quantity-selector-${productId}`
  );
  let val = 1;
  if (selectElement) {
    val = Number(selectElement.value);
  }
  let matchingItem;
  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) matchingItem = cartItem;
  });
  if (matchingItem) {
    matchingItem.quantity += val;
  } else {
    cart.push({
      productId: productId,
      quantity: val,
      deliveryOptionId: "1",
      updateStatus: false
    });
  }
  saveToStorage();
}

export function removeFromcart(productId) {
  let newcart = [];
  cart.forEach((cartItem) => {
    if (cartItem.productId !== productId) {
      newcart.push(cartItem);
    }
  });
  cart = newcart;
  saveToStorage();
}

export function calculateCartQuantity() {
  let cartQuantity = 0;
  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });
  return cartQuantity;
}

export function updateDeliveryOption(productId, deliveryOptionId) {
  let matchingItem;
  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) matchingItem = cartItem;
  });
  matchingItem.deliveryOptionId = deliveryOptionId;
  saveToStorage();
}


export function loadCart(fun) {
  const xhr = new XMLHttpRequest();

  xhr.addEventListener('load', () => {
    console.log(xhr.response);
    fun();
  });

  xhr.open('GET', 'https://supersimplebackend.dev/cart');
  xhr.send();
}
