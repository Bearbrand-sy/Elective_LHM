// Add to Cart
function addToCart(name, price, image) {
  const product = { name, price, image };
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.push(product);
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Render Cart
function renderCart(containerId, totalId) {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const container = document.getElementById(containerId);
  const totalContainer = document.getElementById(totalId);

  let total = 0;
  let output = '';

  if (cart.length === 0) {
    output = '<p>Your cart is empty.</p>';
  } else {
    cart.forEach(item => {
      const price = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
      total += price;
      output += `
        <div class="item d-flex mb-3">
          <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; border-radius: 5px;">
          <div class="item-details ms-3 w-100 d-flex justify-content-between align-items-center">
            <p class="mb-0"><strong>${item.name}</strong></p>
            <p class="mb-0">${item.price}</p>
          </div>
        </div>
      `;
    });
  }

  container.innerHTML = output;
  totalContainer.innerHTML = `<p style="margin-left: 14rem;"><strong>Total:</strong> ₱${total.toFixed(2)}</p>`;
}

// Payment Method Display Logic
document.addEventListener('DOMContentLoaded', () => {
  const paymentMethod = document.getElementById('paymentMethod');
  if (paymentMethod) {
    const methodContainers = {
      credit: document.getElementById('cardInputContainer'),
      gcash: document.getElementById('gcashInputContainer'),
      cod: document.getElementById('codInputContainer')
    };
    const address = document.getElementById('addressContainer');
    const postal = document.getElementById('postalCodeContainer');

    paymentMethod.addEventListener('change', function () {
      Object.values(methodContainers).forEach(c => c.classList.add('d-none'));
      address.classList.remove('d-none');
      postal.classList.remove('d-none');

      if (methodContainers[this.value]) {
        methodContainers[this.value].classList.remove('d-none');
      }
    });
  }

  // Render cart
  if (document.getElementById('cartItems') && document.getElementById('totalPrice')) {
    renderCart('cartItems', 'totalPrice');
  }

  // Order Summary Display
  const orderSummary = JSON.parse(localStorage.getItem('orderSummary'));
  if (orderSummary) {
    document.getElementById('paymentImg').src = orderSummary.image;
    document.getElementById('paymentName').innerText = orderSummary.name;
    document.getElementById('paymentPrice').innerText = orderSummary.price;
  } else if (document.getElementById('orderSummary')) {
    document.getElementById('orderSummary').innerHTML = '<p>No order details found. Please add an item to the cart.</p>';
  }
});

// Modal Confirmation Logic
const confirmationModalEl = document.getElementById('confirmationModal');
const confirmationModal = new bootstrap.Modal(confirmationModalEl);
const confirmationMessageEl = document.getElementById('confirmationMessage');
const modalConfirmBtn = document.getElementById('confirmPaymentButtonInModal');
const triggerBtn = document.getElementById('confirmPaymentButton');

triggerBtn.addEventListener('click', e => {
  e.preventDefault();
  showConfirmationModal();
});

function showConfirmationModal() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (cart.length === 0) {
    alert('Your cart is empty. Please add items to your cart before proceeding.');
    return;
  }

  const totalAmount = cart
    .reduce((sum, item) => sum + parseFloat(item.price.replace(/[^0-9.-]+/g, "")), 0)
    .toFixed(2);

  confirmationMessageEl.innerText = `Are you sure you want to proceed with the payment of ₱${totalAmount}?`;

  modalConfirmBtn.replaceWith(modalConfirmBtn.cloneNode(true));
  const freshConfirmBtn = document.getElementById('confirmPaymentButtonInModal');
  freshConfirmBtn.addEventListener('click', onModalConfirm, { once: true });

  confirmationModal.show();
}

function onModalConfirm() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (cart.length === 0) {
    alert('Your cart is empty.');
    return;
  }

  localStorage.removeItem('cart');
  renderCart('cartItems', 'totalPrice');
  document.getElementById('paymentForm').reset();

  ['cardInputContainer', 'gcashInputContainer', 'codInputContainer', 'addressContainer', 'postalCodeContainer']
    .forEach(id => document.getElementById(id)?.classList.add('d-none'));

  confirmationModal.hide();
  alert('Your order has been placed successfully! You will be redirected to the product page.');
  window.location.href = 'product.html';
}

document.getElementById('backToProductsBtn').addEventListener('click', () => {
  // Clear the cart from localStorage
  localStorage.removeItem('cart');

  // Optionally update cart UI immediately if visible
  if (typeof renderCart === 'function') {
    renderCart('cartItems', 'totalPrice');
  }

  // Show alert
  alert('Returning to products page. Your cart has been cleared.');

  // Redirect to product page
  window.location.href = 'product.html';
});
