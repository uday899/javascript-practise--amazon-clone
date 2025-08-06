import { currencyFormat } from "../scripts/utils/money.js";
import { products, loadProducts } from "./products.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import { cart, addToCart, calculateCartQuantity } from "../data/cart.js";


document.addEventListener('DOMContentLoaded', () => {
  loadProducts(renderYourOrders);
  renderOrderHeader();
});

export const orders = JSON.parse(localStorage.getItem('orders')) || [];


export function addOrder(order) {
  orders.unshift(order);
  saveToStorage();
}

function saveToStorage() {
  localStorage.setItem('orders', JSON.stringify(orders));
}


function findProduct(orderProduct) {
  return products.find((product) => orderProduct.productId === product.id);
}

function renderEachOrder(eachOrder) {
  let html = '';
  const products = eachOrder.products;
  products.forEach((product) => {
    const matchingProduct = findProduct(product);
    if (!matchingProduct) return;
    let deliveryDate = dayjs(product.estimatedDeliveryTime);
    const dateString = deliveryDate.format("dddd, MMMM D");

    html += `
            <div class="product-image-container">
              <img src="${matchingProduct.image}" />
            </div>

            <div class="product-details">
              <div class="product-name">
                ${matchingProduct.name}
              </div>
              <div class="product-delivery-date">Arriving on: ${dateString}</div>
              <div class="product-quantity">Quantity: ${matchingProduct.quantity}</div>
              <button class="buy-again-button button-primary js-button-buy" data-product-id='${matchingProduct.id}'>
                <img class="buy-again-icon" src="images/icons/buy-again.png" />
                <span class="buy-again-message">Buy it again</span>
              </button>
            </div>

            <div class="product-actions">
              <a href="tracking.html?orderId=123&productId=456;">
                <button class="track-package-button button-secondary">
                  Track package
                </button>
              </a>
            </div>
        `;
  });
  return html;
}


export function renderYourOrders() {
  document.querySelector('.js-orders-grid').innerHTML = "";
  let html = "";
  orders.forEach((eachOrder) => {
    let deliveryDate = dayjs(orders.orderTime);
    const dateString = deliveryDate.format("dddd, MMMM D");
    html += `
            <div class="order-container">
          <div class="order-header">
            <div class="order-header-left-section">
              <div class="order-date">
                <div class="order-header-label">Order Placed:</div>
                <div>${dateString}</div>
              </div>
              <div class="order-total">
                <div class="order-header-label">Total:</div>
                <div>$${currencyFormat(eachOrder.totalCostCents)}</div>
              </div>
            </div>

            <div class="order-header-right-section">
              <div class="order-header-label">Order ID:</div>
              <div>${eachOrder.id}</div>
            </div>
          </div>

          <div class="order-details-grid">
            ${renderEachOrder(eachOrder)}
          </div>
        </div>
        `;
  });
  document.querySelector('.js-orders-grid').innerHTML = html;
  document.querySelectorAll('.js-button-buy').forEach((button) => {
    button.addEventListener('click', () => {
      addToCart(button.dataset.productId);
      document.querySelector(".js-cart-quantity").innerHTML = `${calculateCartQuantity()}`
    });
  });
}

function renderOrderHeader() {
  let html = "";
  html += `
    <div class="amazon-header-left-section">
        <a href="amazon.html" class="header-link">
          <img class="amazon-logo" src="images/amazon-logo-white.png" />
          <img
            class="amazon-mobile-logo"
            src="images/amazon-mobile-logo-white.png"
          />
        </a>
      </div>

      <div class="amazon-header-middle-section">
        <input class="search-bar" type="text" placeholder="Search" onkeydown = "";/>

        <button class="search-button">
          <img class="search-icon" src="images/icons/search-icon.png" />
        </button>
      </div>

      <div class="amazon-header-right-section">
        <a class="orders-link header-link" href="orders.html">
          <span class="returns-text">Returns</span>
          <span class="orders-text">& Orders</span>
        </a>

        <a class="cart-link header-link" href="checkout.html">
          <img class="cart-icon" src="images/icons/cart-icon.png" />
          <div class="cart-quantity js-cart-quantity">
            ${calculateCartQuantity()}
          </div>
          <div class="cart-text">Cart</div>
        </a>
      </div>
  `;
  document.querySelector(".js-amazon-header").innerHTML = html;
}
