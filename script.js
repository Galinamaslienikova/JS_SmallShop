
let products=document.getElementById('products')
let cartCont=document.getElementById('cart')
let js_addProduct=document.querySelectorAll('.js_addProduct')
let cartTotal=document.querySelector('.js_cartTotal')
let quantyCart=document.querySelector('.js_quantyCart')
let cartButton=document.querySelectorAll('.js_cartButton')

let cart=[]
let res=JSON.parse(localStorage.getItem('cart'))
if(res){
    cart=res 
}
let allproducts=[]
let resprod=JSON.parse(localStorage.getItem('allproducts'))
if(resprod){
    allproducts = resprod
    do_render()
    
}else{
    fetch('http://my-json-server.typicode.com/achubirka/db/products')
    .then((response) => response.json())
    .then(data=>{ localStorage.setItem('allproducts',JSON.stringify(data)), allproducts=data,do_render()})
   
}

function renderProducts(){
    let allproducts_html = allproducts.map(function(value) {
        let disabled
        if(value.available==0)disabled='disabled'
        return `
            <div class='productCont'>
                <h3>${value.name}</h3>
                <p> Some short description of ${value.name} </p>
                <div class='productPrice'>
                    <p>${value.price}$</p>
                    <button id=${value.id} class='js_addProduct' ${disabled}>ADD</button>
                </div>
            </div>
            
        `;
    }).join(""); 
    products.innerHTML = allproducts_html;
    js_addProduct=document.querySelectorAll('.js_addProduct')
    addEventToButton()
}

function renderCart(){
    let totalcart=0
    let totalquantyCart=0
        let cart_html=cart.map( function(item){
            totalquantyCart=totalquantyCart+item.amount
            totalcart=totalcart+item.amount*item.price
            return`
                <div class='cartCont' >
                    <div class='cartProduct'> <p>${item.name}</p>
                        <p>${item.amount*item.price}$</p>
                    </div>
                    <div class='js_cartButton'>
                        <button id=${item.id} value='+' >+</button><button id=${item.id} value='-'>-</button><span>${item.amount}</span>
                    </div>
               
                </div> 
            `
        }).join("");
    cartCont.innerHTML = cart_html;
    cartButton=document.querySelectorAll('.js_cartButton')
    cartTotal.innerHTML=totalcart
    quantyCart.innerHTML=totalquantyCart
    addEventToCartButton()
}

function do_render(){
    removeProductFromLocalCart()
    renderProducts()
    renderCart()
}

function addEventToButton(){
    for(let i=0;i<js_addProduct.length;i++){
        js_addProduct[i].addEventListener('click',addProductToCart)
    }
}

function addEventToCartButton(){
    for(let i=0;i<cartButton.length;i++){
        cartButton[i].addEventListener('click',managCart)
    }
}

function managCart(e){
    switch(e.target.value){
        case'-':{
            removeProductFromCart(e)   
        }
        break
        case'+':{
            addProductToCart(e)
        }
        break
        default:break
    }
}

function removeProductFromLocalCart(){
    if (cart.length>0){
            cart.forEach((elem,index)=>{
                if (elem.amount==0){
                    cart.splice(index,1)
                }
            })
        localStorage.setItem('cart', JSON.stringify(cart)); 
    }
    
}

function addProductToCart(e){
    let res=JSON.parse(localStorage.getItem('allproducts'))
    allproducts=res.map(element => {
        if(e.target.id==element.id){
            if(element.available>0){
                element.available=element.available*1-1
                if (cart) {
                    let result = cart.findIndex((product) => {
                        return product.id == element.id;
                    });
                        if (result >= 0) {
                            cart[result].amount += 1;
                        } else {
                            cart.push({
                                id:element.id,
                                name:element.name,
                                price:element.price,
                                amount:1
                            });
                        }
                    localStorage.setItem('cart', JSON.stringify(cart));
                } else {
                    localStorage.setItem('cart', JSON.stringify([{
                        id:element.id,
                        name:element.name,
                        price:element.price,
                        amount:1
                    }])); 
                }
            }
            return element   
        }
        return element   
    });
    do_render()
    localStorage.setItem('allproducts',JSON.stringify(allproducts))
}



function removeProductFromCart(e){
    let res=JSON.parse(localStorage.getItem('cart'))
    cart=res.map(element => {
        if(e.target.id==element.id){
            if(element.amount>0){
                element.amount=element.amount*1-1
                let result = allproducts.findIndex((product) => {
                        return product.id == element.id;
                    }
                );
                allproducts[result].available += 1;    
            }
            localStorage.setItem('allproducts',JSON.stringify(allproducts))
            return element   
        }
        return element   
    });
    do_render()
    localStorage.setItem('cart', JSON.stringify(cart));
}


window.addEventListener('storage', (event) => {
    if (event.key === 'cart'){
        cart=JSON.parse(event.newValue)
        renderCart()
        
    }else if(event.key=='allproducts'){
        allproducts=JSON.parse(event.newValue)
        renderProducts()
     
    }
});

