let products = [];
let categories = new Set();
const productsCount = {};

const fetchProducts = async () => {
  const response = await fetch("https://fakestoreapi.com/products");
  products = await response.json();
  products.map((pData) => categories.add(pData.category));
  displayProductsAndCategories(products, categories);
};

const onCategoryChange = (elem) => {
  displayProductsAndCategories(
    elem.value === "default"
      ? products
      : products.filter((pData) => pData.category === elem.value),
    categories,
    false
  );
};

const onBillDone = () => {
  localStorage.removeItem("buy_product");
  localStorage.removeItem("payment_details");
  window.location.href = "main.html";
};

const displayBill = () => {
  const payment_details = JSON.parse(
    localStorage.getItem("payment_details") || "null"
  );
  const data = JSON.parse(localStorage.getItem("buy_product") || "null");
  if (!payment_details || !data) {
    window.location.href = "main.html";
  }
  document.getElementById(
    "billform"
  ).innerHTML = `<div class="bill-item" key="${`${data.id}-${data.title}`}">
        <img src="${data.image}" alt="Product 1" />
        <h3>${data.title}</h3><br>
        <p>Item Price: $${data.price}</p>
        <p>Item Count: ${data.count}</p>
        <p>Total Price: $${data.price * data.count}</p>
        <p>Address: ${payment_details.address}, ${payment_details.city}</p>
        <p>Phone.No: ${payment_details.phone}</p>
        <button onclick="onBillDone()">Done</button>
      </div>`;
};

const onPaymentSubmit = (form) => {
  var formData = new FormData(form);
  localStorage.setItem(
    "payment_details",
    JSON.stringify(Object.fromEntries(formData))
  );
  window.location.href = "bill.html";
};

const onBuyProduct = (id) => {
  const product = products.find((pData) => pData.id === id);
  localStorage.setItem(
    "buy_product",
    JSON.stringify({
      ...product,
      count: Number(productsCount[id] || 1),
    })
  );
  window.location.href = "payment.html";
};

const onProductsCountChange = (id, elem) => {
  productsCount[id] = elem.value;
};

const displayProductsAndCategories = (
  products,
  categories,
  categoryUpdate = true
) => {
  let htmlData = ``;
  products.map((data, index) => {
    htmlData += `<div class="product-item" key="${`${index}-${data.title}`}">
        <img src="${data.image}" alt="Product 1" />
        <h3>${data.title}</h3>
        <p>Price: $${data.price}</p>
        <input type="number" min="1" value="1" onchange="onProductsCountChange(${
          data.id
        }, this)" />
        <button onclick="onBuyProduct(${data.id})">Buy Now</button>
      </div>`;
  });
  document.getElementById("products").innerHTML = htmlData;
  if (!categoryUpdate) return;
  let categoriesHtml = `<option value="default">default</option>`;
  [...categories].map((category) => {
    categoriesHtml += `<option value="${category}">${category}</option>`;
  });
  document.getElementById("categories").innerHTML = categoriesHtml;
};

document.addEventListener("DOMContentLoaded", async () => {
  document.getElementById("products") && (await fetchProducts());
  document.getElementById("billform") && displayBill();
});

const fbUser = JSON.parse(localStorage.getItem("fbUser"));
if (fbUser) {
  document.getElementById("userGreeting").innerText = `Welcome, ${fbUser.name}`;
}

FB.api("/me", { fields: "name,email" }, function (response) {
  localStorage.setItem("fbUser", JSON.stringify(response));
  window.location.href = "main.html";
});

function checkLoginState() {
  function checkLoginState() {
    FB.getLoginStatus(function (response) {
      if (response.status === "connected") {
        // If the user is logged in, redirect to another page
        FB.api("/me", { fields: "name,email" }, function (response) {
          localStorage.setItem("fbUser", JSON.stringify(response));
          window.location.href = "main.html"; // Change this to your desired page
        });
      } else {
        console.log("User not authenticated");
      }
    });
  }
}
