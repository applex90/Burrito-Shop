let basket = null;

function init() {
    render();
    basket = new Basket();
}

function render() {
    renderProductNav()
    renderProducts('All');
}

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

function renderProducts(cat) {
    let productList = document.getElementById('productList');
    productList.innerHTML = '';
    let products = allProducts;

    if (cat != 'All') {
        products = allProducts.filter(e => e.category == cat);
    }

    renderCatOfProducts(products);
}

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

function foundIndexInBasket(id) {
    return basket.items.map(object => object[0].id).indexOf(id);
}

function checkIfIdExists(id) {
    let found = basket.items.filter(e => e[0].id == id);
    return found.length;
}

function getValuesForID(id) {
    return allProducts.filter(v => v.id == id);
}

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

function calcTotalBasketPrice() {
    let totalElement = document.getElementById('shoppingBasket');
    let sum = 0;

    basket.items.forEach(element => {
        sum += element[0].priceTotal;
    });

    calcPriceTotal(sum);
    
    if(!basket.items.length) {
        totalElement.style.display = 'none';
    } else {
        totalElement.style.display = 'flex';
    }
}

function calcPriceTotal(sum) {
    if(sum>=basket.discount){
        basket.priceTotal = sum - basket.discount;
    } else {
        basket.priceTotal = 0;
    }
}