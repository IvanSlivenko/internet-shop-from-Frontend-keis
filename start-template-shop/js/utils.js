"use strict"
//==========================================

// Вивід помилки
export function showErrorMessage(message) {
    const h1 = document.querySelector('.wrapper h1')
    const msg = 
        `<div class="error">
            <p>${message}</p>
            <p><a href="/">Перейти до списку товарів!</a></p>
        </div>`;
    h1.insertAdjacentHTML('afterend', msg);
}

// Отримання id из LS
export function getBasketLocalStorage() {
    const cartDataJSON = localStorage.getItem('basket');
    return cartDataJSON ? JSON.parse(cartDataJSON) : [];
}

// Запис id товарів в LS
export function setBasketLocalStorage(basket) {
    const basketCount = document.querySelector('.basket__count');
    localStorage.setItem('basket', JSON.stringify(basket));
    basketCount.textContent = basket.length;
}

// Перевірка, чи існує  товар  в LS 
//(якщо наприклад пару днів не заходив юзер, а товар, який у нього в корзині, уже не існує)
export function checkingRelevanceValueBasket(productsData) {
    const basket = getBasketLocalStorage();

    basket.forEach((basketId, index) => {
        const existsInProducts = productsData.some(item => item.id === Number(basketId));
        if (!existsInProducts) {
            basket.splice(index, 1);
        }
    });

    setBasketLocalStorage(basket);
}

export function formatPrice(price) {
  return new Intl.NumberFormat('uk-UA').format(price);
}