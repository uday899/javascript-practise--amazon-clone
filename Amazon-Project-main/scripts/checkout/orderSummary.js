import {
  cart,
  removeFromcart,
  calculateCartQuantity,
  updateDeliveryOption,
} from "../../data/cart.js";
import { products, getProduct } from "../../data/products.js";
import { currencyFormat } from "../utils/money.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import {
  deliveryOptions,
  getDeliveryOption,
} from "../../data/deliveryOptions.js";
import { renderPaymentSummary } from "./paymentSummary.js";
import { renderCheckoutHeader } from "./checkoutHeader.js"

export function renderOrderSummary() {
  let cartSummaryHTML = "";

  if (cart.length === 0) {
    cartSummaryHTML += `
      <div class="cart-para">Your Cart is Empty</div>
      <button class="cart-button" onclick="window.location.href='amazon.html';">View products</button>
    `;
  }

  cart.forEach((cartItem) => {
    const productId = cartItem.productId;
    const matchingProduct = getProduct(productId);

    const deliveryOptionId = cartItem.deliveryOptionId;
    const deliveryOption = getDeliveryOption(deliveryOptionId);

    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
    const dateString = deliveryDate.format("dddd, MMMM D");

    const renderUpdateOrSave = () => {
      let html = "";

      let Save =
        `
        <span> Quantity:<input class="quantity-input" type="number" value='${cartItem.quantity}'/></span>
        <span class="save-quantity-link link-primary js-save-link" data-product-id='${matchingProduct.id}'>Save<span/>`;
      let Update =
        `<span> Quantity: <span class="quantity-label">${cartItem.quantity}</span></span>
        <span class="update-quantity-link link-primary js-link-primary" data-product-id='${matchingProduct.id}'>Update</span>`;

      html = !cartItem.updateStatus ? Update : Save;

      return html;
    }

    cartSummaryHTML += `
    <div class="cart-item-container js-cart-item-container js-cart-item-container-${matchingProduct.id
      }">
        <div class="delivery-date">Delivery date:${dateString}</div>

        <div class="cart-item-details-grid">
            <img
            class="product-image"
            src="${matchingProduct.image}"
            />

            <div class="cart-item-details">
            <div class="product-name">
                ${matchingProduct.name}
            </div>
            <div class="product-price">${matchingProduct.getPrice()}</div>
            <div class="product-quantity js-product-quantity-${matchingProduct.id}">
                ${renderUpdateOrSave()}
                <span class="delete-quantity-link link-primary js-delete-link" data-product-id='${matchingProduct.id
      }'>
                Delete
                </span>
            </div>
            </div>

            <div class="delivery-options">
            <div class="delivery-options-title">
                Choose a delivery option:
            </div>
                ${deliveryOptionsHTML(matchingProduct, cartItem)}
            </div>
            </div>
        </div>
        </div>
    
    `;
  });

  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = "";
    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs();
      const deliveryDate = today.add(deliveryOption.deliveryDays, "days");
      const dateString = deliveryDate.format("dddd, MMMM D");

      const priceString =
        deliveryOption.priceCents === 0
          ? "FREE"
          : `$${currencyFormat(deliveryOption.priceCents)} -`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;
      html += `
    <div class="delivery-option js-delivery-option"
    data-product-id="${matchingProduct.id}"
    data-delivery-option-id=${deliveryOption.id}>
        <input
        type="radio"
        ${isChecked ? "checked" : ""}
        class="delivery-option-input"
        name="delivery-option-${matchingProduct.id}"
        />
        <div>
        <div class="delivery-option-date">${dateString}</div>
        <div class="delivery-option-price">${priceString} Shipping</div>
        </div>
    </div>
    `;
    });
    return html;
  }

  document.querySelector(".js-order-summary").innerHTML = cartSummaryHTML;

  document.querySelectorAll(".js-delete-link").forEach((link) => {
    link.addEventListener("click", () => {
      const productId = link.dataset.productId;
      removeFromcart(productId);

      updateCartQuantity();

      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      container.remove();

      renderPaymentSummary();
    });
  });

  function updateCartQuantity() {
    document.querySelector(
      ".js-return-to-home-link"
    ).innerHTML = `${calculateCartQuantity()} items`;
    return calculateCartQuantity();
  }

  document.querySelectorAll(".js-delivery-option").forEach((element) => {
    element.addEventListener("click", () => {
      const { productId, deliveryOptionId } = element.dataset;
      /* shorthand property
    const productId=element.dataset.productId;
    const deliveryOptionId=element.dataset.deliveryOptionId;
    */
      updateDeliveryOption(productId, deliveryOptionId);
      renderOrderSummary();
      renderPaymentSummary();
    });
  });

  document.querySelectorAll('.js-link-primary').forEach((link) => {
    link.addEventListener('click', () => {
      cart.forEach((cartItem) => {
        if (cartItem.productId === link.dataset.productId) {
          cartItem.updateStatus = true;
        }
      });
      renderOrderSummary();
    })
  })

  document.querySelectorAll('.js-save-link').forEach((link) => {
    link.addEventListener('click', () => {
      cart.forEach((cartItem) => {
        if (cartItem.productId === link.dataset.productId) {
          cartItem.updateStatus = false;
          let val = document.querySelector('.quantity-input').value;
          if (val > 0)
            cartItem.quantity = Number(val);
          else
            alert("Not a valid Quantity");
        }
      });
      renderOrderSummary();
      renderPaymentSummary();
      renderCheckoutHeader();
    })
  })

}
