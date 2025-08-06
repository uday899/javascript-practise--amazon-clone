import { cart, addToCart, calculateCartQuantity } from "../data/cart.js";
import { products, loadProducts } from "../data/products.js";
import { currencyFormat } from "./utils/money.js";

loadProducts(amzonProductsRender);



function amzonProductsRender() {
  let ProductsGot = products;
  const btnElement = document.querySelector('.search-btn');

  let inputElement = document.querySelector('.search-filter');
  inputElement.addEventListener("keydown", (event) => {
    let inputVal = inputElement.value;
    if (event.key === "Enter") {
      if (inputVal !== '') {
        let newProducts = products.filter((eachProduct) => {
          return eachProduct.keywords.some((keyword) => {
            const keywordLower = keyword.toLowerCase();
            const inputLower = inputVal.toLowerCase();
            return keywordLower.includes(inputLower) || inputLower.includes(keywordLower);
          });
        });
        ProductsGot = newProducts;
      }
      else ProductsGot = products;
      renderProductsGrid();
    }
  });

  btnElement.addEventListener('click', () => {
    let inputVal = inputElement.value;
    if (inputVal !== '') {
      let newProducts = products.filter((eachProduct) => {
        return eachProduct.keywords.some((keyword) => {
          const keywordLower = keyword.toLowerCase();
          const inputLower = inputVal.toLowerCase();
          return keywordLower.includes(inputLower) || inputLower.includes(keywordLower);
        });
      });

      ProductsGot = newProducts;
    }
    else ProductsGot = products;
    renderProductsGrid();
  });

  renderProductsGrid();

  function renderProductsGrid() {

    let productsHTML = "";
    ProductsGot.forEach((product) => {
      productsHTML += `
      <div class="product-container">
            <div class="product-image-container">
              <img
                class="product-image"
                src="${product.image}"
              />
            </div>
  
            <div class="product-name limit-text-to-2-lines">
              ${product.name}
            </div>
  
            <div class="product-rating-container">
              <img
                class="product-rating-stars"
                src="${product.getStarsUrl()}"
              />
              <div class="product-rating-count link-primary">${product.rating.count
        }</div>
            </div>
  
            <div class="product-price">${product.getPrice()}</div>
  
            <div class="product-quantity-container">
              <select class="js-quantity-selector-${product.id}">
                <option selected value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10">10</option>
              </select>
            </div>
  
            ${product.extraInfoHTML()}
  
            <div class="product-spacer"></div>
  
            <div class="added-to-cart" data-product-id="${product.id}">
              <img src="images/icons/checkmark.png" />
              Added
            </div>
  
            <button class="add-to-cart-button button-primary js-add-to-cart" data-product-id="${product.id
        }">Add to Cart</button>
          </div>`;
    });
    document.querySelector(".js-products-grid").innerHTML = productsHTML;

    document.querySelector(
      ".js-cart-quantity"
    ).innerHTML = `${updateCartQuantity()}`;
    function updateCartQuantity() {
      document.querySelector(".js-cart-quantity").innerHTML =
        calculateCartQuantity();
      return calculateCartQuantity();
    }

    document.querySelectorAll(".js-add-to-cart").forEach((button) => {
      button.addEventListener("click", () => {
        const productId = button.dataset.productId;
        addToCart(productId);
        updateCartQuantity();

        const addedMessage = document.querySelector(
          `.added-to-cart[data-product-id="${productId}"]`
        );
        addedMessage.classList.add("visible");
        setTimeout(() => {
          addedMessage.classList.remove("visible");
        }, 1000);
      });
    });
  }

}

