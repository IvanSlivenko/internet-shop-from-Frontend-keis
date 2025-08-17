"use strict"
//==========================================
import {
    showErrorMessage,
    setBasketLocalStorage,
    getBasketLocalStorage,
    checkingRelevanceValueBasket,
    formatPrice
} from './utils.js';

import {
    COUNT_SHOW_CARDS_CLICK,
    ERROR_SERVER,
    NO_PRODUCTS_IN_THIS_CATEGORY
} from './constants.js';

const cards = document.querySelector('.cards');
const btnShowCards = document.querySelector('.show-cards');
let shownCards = COUNT_SHOW_CARDS_CLICK;
let countClickBtnShowCards = 1;
let productsData = [];


getProducts();

btnShowCards.addEventListener('click', scliceArrCards);
cards.addEventListener('click', handleCartClick);

async function getProducts() {
    try {
        if (!productsData.length) {
            const res = await fetch('./data/products.json');
            if (!res.ok) {
                throw new Error(res.statusText);
            }
            productsData = await res.json();

        }

        console.log(productsData);

        if ((productsData.length > COUNT_SHOW_CARDS_CLICK) &&
            btnShowCards.classList.contains('none')) {
            btnShowCards.classList.remove('none');
        }

        renderStartPage(productsData);

    } catch (err) {
        showErrorMessage(ERROR_SERVER);
        console.log(err.message);
    }
}

function checkingCountBasket() {
    const bascket = getBasketLocalStorage();
    const countBasket = document.querySelector('.basket__count');

    if (!countBasket) return; // захист від null

    if (!bascket.length) {
        countBasket.classList.add('basket__count__zero');
        // countBasket.textContent = bascket.length; // показати число
    } else { countBasket.classList.remove('basket__count__zero'); }
}

function checkingActiveButtons(bascket) {
    const buttons = document.querySelectorAll('.card__add');
    buttons.forEach(btn => {
        const card = btn.closest('.card');
        const id = card.dataset.productId;
        const isInBasket = bascket.includes(id);

        btn.disabled = isInBasket;
        btn.classList.toggle('active', isInBasket);
        btn.textContent = isInBasket ? 'У Кошику' : 'До кошика';
    });
}

function renderStartPage(data) {
    if (!data || !data.length) {
        showErrorMessage(NO_PRODUCTS_IN_THIS_CATEGORY);
        return
    };

    const arrCards = data.slice(0, COUNT_SHOW_CARDS_CLICK);
    createCards(arrCards);

    checkingRelevanceValueBasket(data);

    const bascket = getBasketLocalStorage();
    checkingActiveButtons(bascket);
    checkingCountBasket();
}

function scliceArrCards() {
    if (shownCards >= productsData.length) return;

    countClickBtnShowCards++;
    const countShowCards = COUNT_SHOW_CARDS_CLICK * countClickBtnShowCards;

    const arrCards = productsData.slice(shownCards, countShowCards);
    createCards(arrCards);
    shownCards = cards.children.length;

    if (shownCards >= productsData.length) {
        btnShowCards.classList.add('none');
    }
}

function handleCartClick(event) {
    const targetButton = event.target.closest('.card__add');
    if (!targetButton) return;

    const card = targetButton.closest('.card');
    const id = card.dataset.productId;
    const bascket = getBasketLocalStorage();

    if (bascket.includes(id)) return;
    bascket.push(id);
    setBasketLocalStorage(bascket);
    checkingActiveButtons(bascket);
    console.log('checkingActiveButtons')
    checkingCountBasket();
    console.log('checkingCountBasket')

}





// Рендер картки
function createCards(data) {
    data.forEach(card => {
        const { id, img, title, price, discount } = card;
        const priceDiscount = price - ((price * discount) / 100);
        const cardItem =
            `
                <div class="card" data-product-id="${id}">
                    <div class="card__top">
                        <a href="/card.html?id=${id}" class="card__image">
                            <img
                                src="./images/${img}"
                                alt="${title}"
                            />
                        </a>
                        <div class="card__label">-${discount}%</div>
                    </div>
                    <div class="card__bottom">
                        <div class="card__prices">
                            <div class="card__price card__price--discount">${formatPrice(priceDiscount)}</div>
                            <div class="card__price card__price--common">${formatPrice(price)}</div>
                        </div>
                        <a href="/card.html?id=${id}" class="card__title">${title}</a>
                        <button class="card__add">До кошикa</button>
                    </div>
                </div>
            `
        cards.insertAdjacentHTML('beforeend', cardItem);
    });

}




