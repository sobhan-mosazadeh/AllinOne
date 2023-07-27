
const $ = document


const toastLiveExample = $.getElementById("liveToast");

let arryCart = [], arryCartGlobal = [] , arry = [];


if (localStorage.getItem("Products") != null) {
    arry = JSON.parse(localStorage.getItem("Products"));
}

if (localStorage.getItem("cart") != null) {
    let arrylocal = localStorage.getItem("cart");
    arryCartGlobal = JSON.parse(arrylocal);
}

function AddCart() {
    // console.log(arryCartGlobal);
    let num = 0, totalPrice = 0, price = 0;

    arryCart = arryCartGlobal

    if (arryCart.length == 0) {
        $.querySelector('.table').hidden = true
        $.querySelector('.price').hidden = true
        $.querySelector('.Cartnull').hidden = false
    }

    $.querySelector('.tableCart').innerHTML = ''
    $.querySelector('.priceSup').innerHTML = ''

    // console.log(arry);
    arryCart.forEach((r) => {
        price = 0
        num++
        arry.forEach((cart) => {
            // console.log(cart);
            if (r.id == cart.title) {
                $.querySelector('.tableCart').insertAdjacentHTML('beforeend',
                    `<tr>
        <th scope="row">${num}</th>
        <td class="d-flex align-items-center">
        <img src="${cart.pictureLink}" alt="${cart.title}" class="img-fluid rounded-pill imgD-table"/>
            <p class="fw-blod fs-6">${cart.title}</p>
        </td>
        <td>${cart.price}</td>
        <td class="text-danger fs-4"><i class="bi bi-trash3 delbtn" id="${r.id}" onclick="deleteCart(this.id)"></i></td>
      </tr>`
                )

                price = cart.price * Number(r.len)
                totalPrice += price
            }
        })
    })

    $.querySelector('.priceSup').insertAdjacentHTML('beforeend',
        `<p class="fw-blod text-dark">قيمت كل : <span class="fs-4 ms-4 fw-blod">${totalPrice} <sup class="fs-6">ریال</sup></span></p>
    <button class="btn btn-them shadow w-50">پرداخت</button>`
    )
}

//runPage
AddCart()

//deleteCart
function deleteCart(e) {
    arryCartGlobal.forEach((w) => {
        if (w.id == e) {
            arryCartGlobal.splice(arryCartGlobal.findIndex(w => w.id == e), 1);
            localStorage.setItem('cart', JSON.stringify(arryCartGlobal))
            const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastLiveExample);
            toastBootstrap.show();
            AddCart()
        }
    })
}



