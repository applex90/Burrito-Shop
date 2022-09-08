let basket = null;

/**
 * This function is called onload and initializes the shopping cart.
 * 
 */
function init() {
    render();
    basket = new Basket();
}

/**
 * This function renders the content of the page.
 * 
 */
function render() {
    renderProductNav()
    renderProducts('All');
}

/**
 * This function renders all categories of allProducts
 * 
 */
function renderProductNav() {
    let productNav = document.getElementById('productNav');
    let productCategories = allProducts.map(e => e.category);
    let uniqueCategory = productCategories.filter((v, i, a) => a.indexOf(v) === i);

    for (let i = 0; i < uniqueCategory.length; i++) {
        const category = uniqueCategory[i];
        productNav.innerHTML += /*html*/`
        <div class="productCategory" onclick="renderProducts('${category}')">${category}</div>
    `;
    }
}

/**
 * This function checks which category should be rendered
 * 
 * @param {string} cat - is the selected category
 */
function renderProducts(cat) {
    let productList = document.getElementById('productList');
    productList.innerHTML = '';
    let products = allProducts;

    if (cat != 'All') {
        products = allProducts.filter(e => e.category == cat);
    }

    renderCatOfProducts(products);
}

/**
 *  This function renders a specific category of products 
 * 
 * @param {Array} products - Array of all filtered products
 */
function renderCatOfProducts(products) {
    for (let i = 0; i < products.length; i++) {
        const product = products[i];

        productList.innerHTML += /*html*/`
        <div class="productDetails">
            <div class="productInfo">
                 <h5>#${product.id} - ${product.name}</h5>
                 <div>
                    ${product.description}
                 </div>
                 <h3 class="price">${product.price.toFixed(2).replaceAll('.', ',')} €</h3>
             </div>
             <div class="plus" onclick="addToBasket(${product.id})">
                 <h1>+</h1>
             </div>
        </div>
        `;
    }
}

/**
 * This function renders the entire shopping cart.
 * 
 */
function renderBasket() {
    let basketID = document.getElementById('shoppingBasket');
    basketID.innerHTML = ``;
    for (let i = 0; i < basket.items.length; i++) {
        const element = basket.items[i][0];
        basketID.innerHTML += /*html*/`
        <div class="basketDetails">
            <div class="basketElement">
                <h6>#${element.id} - ${element.name}</h6>
                <div class="basketDesciption">
                ${element.description}
                </div>
                <div class="basketFlex">
                    <div class="priceCalc">
                        <div><b>${element.amount}</b></div>
                        <div>x</div>
                        <div>${element.price.toFixed(2).replaceAll('.', ',')} €  =</div>
                        <div class="price"><b>${element.priceTotal.toFixed(2).replaceAll('.', ',')} €</b></div>
                    </div> 
                    <div class="remove" onclick="removeFromBasket(${i})"> <h2>-</h2></div>
                </div>
            </div> 
        </div>
        `;
    }
    basketID.innerHTML += /*html*/`
    <div class="totalCosts" id="totalContainer">
        <div>
            <div>New customer discount:</div>
            <div><b>Total:</b></div>
        </div>
        <div class="alignRight">
            <div>- ${basket.discount.toFixed(2).replaceAll('.', ',')} €</div>
            <div><b>${basket.priceTotal.toFixed(2).replaceAll('.', ',')} €</b></div>
        </div>
    </div>
    `;
}

/**
 * This function is called when an item is placed in the shopping cart. It is checked whether the article already exists in the shopping cart.
 * 
 * @param {number} id - ID of the product to be added to the shopping cart.
 */
function addToBasket(id) {
    if (checkIfIdExists(id)) {
        basket.items[foundIndexInBasket(id)][0].amount++;
        basket.items[foundIndexInBasket(id)][0].priceTotal += basket.items[foundIndexInBasket(id)][0].price;
    } else {
        basket.items.push(getValuesForID(id));
    }
    calcTotalBasketPrice();
    renderBasket();
}

/**
 * This function returns the index of the element, which is existing in the shopping cart.
 * 
 * @param {number} id - ID of the product to be added to the shopping cart.
 * @returns - The index of the element.
 */
function foundIndexInBasket(id) {
    return basket.items.map(object => object[0].id).indexOf(id);
}

/**
 * This function checks whether the product ID is already in the shopping cart.
 * 
 * @param {number} id - ID of the product to be added to the shopping cart.
 * @returns - The length of the array.
 */
function checkIfIdExists(id) {
    let found = basket.items.filter(e => e[0].id == id);
    return found.length;
}

/**
 * This function returns the object of the selected product.
 * 
 * @param {number} id - ID of the product to be added to the shopping cart.
 * @returns - The object of the product.
 */
function getValuesForID(id) {
    return allProducts.filter(v => v.id == id);
}

/**
 * This function deletes the product from the shopping cart or reduces the quantity of the product.
 * It is called up when the user clicks on the minus button.
 * 
 * @param {number} id - ID of the product to be added to the shopping cart.
 */
function removeFromBasket(i) {
    if (basket.items[i][0].amount == 1) {
        basket.items.splice(i, 1);
    } else {
        basket.items[i][0].amount--;
        basket.items[i][0].priceTotal -= basket.items[i][0].price;
    }
    calcTotalBasketPrice();
    renderBasket();
}

/**
 * The function calculates the total price of all items in the shopping cart. It also controls the visibility of the price display in the shopping cart.
 * 
 */
function calcTotalBasketPrice() {
    let totalElement = document.getElementById('shoppingBasket');
    let sum = 0;

    basket.items.forEach(element => {
        sum += element[0].priceTotal;
    });

    calcPriceTotal(sum);

    if (!basket.items.length) {
        totalElement.style.display = 'none';
    } else {
        totalElement.style.display = 'flex';
    }
}

/**
 * The function calculates the total price minus the discount.
 * 
 * @param {number} sum - Sum of all elements in the shopping cart.
 */
function calcPriceTotal(sum) {
    if (sum >= basket.discount) {
        basket.priceTotal = sum - basket.discount;
    } else {
        basket.priceTotal = 0;
    }
}