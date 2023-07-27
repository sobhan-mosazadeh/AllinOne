// * Created with ❤️ by Sobhan Musazadeh

// ! All Copyrights Reserved ©

//TODO Version 2.0.0
////--------------------------------------------------------------------------------------------------------------------------
// * Start Coding

const $ = document , _id = id => $.getElementById(id) , _qs = qs => $.querySelector(qs) , _qsa = qs => $.querySelectorAll(qs);
(localStorage.getItem('Users') == null ? localStorage.setItem('Users' , JSON.stringify([])) : null);
(localStorage.getItem('Products') == null ? localStorage.setItem('Products' , JSON.stringify([])) : null);
var access = '' , products = JSON.parse(localStorage.getItem('Products'));
var productsWrapper = _id('products__wrapper') , showPasswordIcon = _id('show-password-icon') , userName = _id('username') , userPassword = _id('password') , loginPage = _id('login-form__container') ,
loginButton = _id('login-btn') , closeLoginPageIcon = _id('close-login-form-icon'), searchBar = _id('search-bar') , clearSearchIcon = _id('clear-icon') , searchIcon = _id('search-icon') ,
addProductPage = _id('add-product-form__container') , closeAddProductPageIcon = _id('close-add-product-form-icon') , setProductTitle = _id('set-product-title') , setProductDescribe = _id('set-product-describe') ,
setProductPictureLink = _id('set-product-picture-link') ,  setProductPrice = _id('set-product-price') , addProductButton = _id('add-product-btn') ,
allInputs = _qsa('#set-product-title , #set-product-describe , #set-product-picture-link , #set-product-buy-link , #set-product-price , #signup-fullname') , contextMenu =  _id('context-menu') ,
loginIcon = _id('login-icon');
let cart = [];

// ? Functions
function checkUrl () {
    var bool = null;
    _qsa('#set-product-picture-link , #set-product-buy-link').forEach(input => (!input.value.toString().startsWith('https://') && !input.value.toString().startsWith('http://') ? bool = false : bool = true));
    return bool;
};
function clearAccountInformation () {
    _id('account-fullname').firstElementChild.textContent = '';
    _id('account-username').firstElementChild.textContent = '';
    _id('account-password').value = '';
};
async function deleteAccount () {
    let fullname = _id('account-fullname').firstElementChild.textContent.toString().trim() , username = _id('account-username').firstElementChild.textContent.toString().trim() , password = _id('account-password').value.toString() , users = JSON.parse(localStorage.getItem('Users'));
    await users.forEach(user => {
        if (user.Fullname == fullname && user.Username == username && user.Password == password) {
            users.splice(users.indexOf(user) , 1);
            localStorage.setItem('Users' , JSON.stringify(users));
        }
    });
    access = '';
    _id('user-account-icon').parentElement.removeAttribute('style');
    loginIcon.classList.replace('fa-arrow-right-from-bracket' , 'fa-arrow-right-to-bracket');
    changeLoginIconTitle(false);
    _id('close-account-profile-icon').click();
    clearAccountInformation();
    swal({
        title: "Deleted",
        icon: "success",
        className: "success-alert",
        timer: 2000,
        buttons: false,
        closeOnEsc: false,
        closeOnClickOutside: false
    });
};
function deleteAccountAlert () {
    swal({
        title: "Are You Sure ?",
        text: "Your account will be deleted forever.",
        icon: "warning",
        dangerMode: true,
        className: "delete-account-alert",
        buttons: {
            cancel: {
                text: "Cancel",
                value: false,
                visible: true,
                className: "cancel-delete-account-btn",
                closeModal: true
            },
            confirm: {
                text: "Delete",
                value: true,
                visible: true,
                className: "delete-account-btn",
                closeModal: true
            }
        }
    }).then(value => (value ? deleteAccount() : null));
};
async function setUserProfile (username = null , User = null) {
    if (username == "admin") {
        _id('account-fullname').firstElementChild.textContent = User.Fullname;
        _id('account-username').firstElementChild.textContent = User.Username;
        _id('account-password').value = User.Password;
        _id('user-account-icon').parentElement.style.display = 'flex';
    } else if (username != null) {
        let users = JSON.parse(localStorage.getItem('Users'));
        await users.forEach(user => {
            if (user.Username == username) {
                _id('account-fullname').firstElementChild.textContent = user.Fullname;
                _id('account-username').firstElementChild.textContent = user.Username;
                _id('account-password').value = user.Password;
                _id('user-account-icon').parentElement.style.display = 'flex';
            }
        });
    };
};
function checkSignupUsername () {
    let singupUsernameInput = _id('signup-username');
    (singupUsernameInput.value.toString().trim ? singupUsernameInput.value = singupUsernameInput.value.toString().trim() : null);
    var allowedChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789._' , users = JSON.parse(localStorage.getItem('Users')) , error = _id('signup-username-error') , bool = true;
    for (let i = 0 ; i < singupUsernameInput.value.length ; i++) {
        let char = singupUsernameInput.value.toString().charAt(i);
        (!allowedChars.includes(char) ? singupUsernameInput.value = singupUsernameInput.value.toString().replace(char , '') : null);
    }
    if (singupUsernameInput.value.toString().trim().length >= 4) {
        if (users.length != 0) {
            users.forEach(user => (user.Username.toLowerCase() == singupUsernameInput.value.toString().trim().toLowerCase() ? bool = false : null));
        } else {
            bool = true;
        };
    } else {
        bool = false;
    };
    (singupUsernameInput.value.toString().trim().toLowerCase() == "admin" ? bool = false : null);
    if (bool) {
        singupUsernameInput.classList.remove('error-input');
        error.removeAttribute('style');
    } else if (singupUsernameInput.value.toString().length >= 4 && !bool) {
        singupUsernameInput.classList.add('error-input');
        error.style.display = 'flex';
    } else if (singupUsernameInput.value.toString().length < 4 && !bool) {
        singupUsernameInput.classList.add('error-input');
        error.removeAttribute('style');
    }
    return bool;
};
function signupSuccess () {
    swal({
        title: "Successful",
        icon: "success",
        className: "success-alert",
        timer: 2000,
        buttons: false,
        closeOnEsc: false,
        closeOnClickOutside: false
    });
};
async function signupUser () {
    let fullname = _id('signup-fullname') , username = _id('signup-username') , password = _id('signup-password') , repeatPassword = _id('signup-repeat-password') , users = JSON.parse(localStorage.getItem('Users'));
    if (fullname.value.toString().trim().length != 0 && checkSignupUsername() && password.value.toString().length >= 4 && repeatPassword.value.toString() == password.value.toString()) {
        await users.push({Fullname: fullname.value.toString().trim() , Username: username.value.toString().toLowerCase().trim() , Password: password.value.toString()});
        localStorage.setItem('Users' , JSON.stringify(users));
        loginIcon.classList.replace('fa-arrow-right-to-bracket' , 'fa-arrow-right-from-bracket');
        changeLoginIconTitle(true);
        setUserProfile(username.value.toString().toLowerCase().trim());
        _id('close-signup-form-icon').click();
        signupSuccess();
    } else {
        _qsa('#signup-username , #signup-password').forEach(input => {(input.value.toString().length < 4 ? input.classList.add('error-input') : null)});
        (_id('signup-password').value.length >= 4 && _id('signup-repeat-password').value.length < 4 ? _id('signup-repeat-password').classList.add('error-input') : null);
        (_id('signup-fullname').value.length == 0 ? _id('signup-fullname').classList.add('error-input') : null);
        (_id('signup-password').value.toString().trim() != _id('signup-repeat-password').value.toString().trim() ? _id('signup-password').classList.add('error-input') : null);
    }
};
function checkRepeatPasswordInput (event) {
    (event.target.value.toString().trimStart().length == 0 ? removeStartSpace(event) : null);
    (event.target.value.toString() == _id('signup-password').value.toString() ? (_id('signup-password-error').removeAttribute('style') ,  _id('signup-password').classList.remove('error-input') , event.target.classList.remove('error-input')) : (_id('signup-password-error').style.display = 'flex' , event.target.classList.add('error-input')));
};
function changeLoginIconTitle (bool) {
    (bool ? loginIcon.setAttribute('title' , 'Log out') : loginIcon.setAttribute('title' , 'Login'));
};
function removeError () {
    allInputs.forEach(input => input.classList.remove('error-input'));
    _qsa('#username , #password , #signup-username , #signup-password , #signup-repeat-password').forEach(input => input.classList.remove('error-input'));
    _qsa('.error-text').forEach(errorText => errorText.removeAttribute('style'));
};
function clearLoginForm () {
    removeError();
    window.getSelection().removeAllRanges();
    userName.value = '';
    userPassword.value = '';
    userName.blur();
    userPassword.blur();
    showPasswordIcon.classList.replace('fa-eye' , 'fa-eye-slash');
    userPassword.setAttribute('type' , 'password');
};
function clearSignupForm () {
    removeError();
    window.getSelection().removeAllRanges();
    _id('signup-repeat-password').setAttribute('disabled' , '');
    _qsa('#signup-fullname , #signup-username , #signup-password , #signup-repeat-password').forEach(input => input.value = '');
    _qsa('#signup-password , #signup-repeat-password').forEach(input => input.setAttribute('type' , 'password'));
    _qsa('#signup-show-password-icon , #signup-show-repeat-password-icon').forEach(icon => icon.classList.replace('fa-eye' , 'fa-eye-slash'));
};
function clearAddProductForm () {
    removeError();
    window.getSelection().removeAllRanges();
    setProductTitle.value = '';
    setProductDescribe.value = '';
    setProductPictureLink.value = '';
    setProductPrice.value = '';
};
function removeStartSpace (event) {
    event.target.value = event.target.value.toString().trimStart();
};
async function addProductsToDOM (acces = 'Visitor') {
    let addProductArticle , square , productArticle , productPictureWrapper , productPicture , productDetailsWrapper , productTextWrapper , productTitle , productDescribe , productPriceWrapper , productPriceDollorSign , productPrice , buyProductButton , productIconsWrapper , deleteIcon , editIcon;
    productsWrapper.innerHTML = '';
    if (acces == "Admin") {
        addProductArticle = $.createElement('article');
        addProductArticle.classList.add('product' , 'add-product');
        addProductArticle.setAttribute('title' , 'Add Product');
        addProductArticle.addEventListener('click' , () => {addProductPage.style.display = 'flex' , addProductButton.textContent = 'افزودن' , clearAddProductForm()});
        square = $.createElement('div');
        square.classList.add('square');
        square.textContent = '+';
        addProductArticle.append(square);
        productsWrapper.append(addProductArticle);
        addProductButton.addEventListener('click' , createProduct);
    }
    await products.forEach(productProperties => {
        productArticle = $.createElement('article');
        productArticle.classList.add('product');
        productPictureWrapper = $.createElement('div');
        productPictureWrapper.classList.add('product-img__wrapper');
        productPictureWrapper.addEventListener('click' , event => {event.target.classList.toggle('product-img__clicked') , event.target.parentElement.classList.toggle('product-img__wrapper__clicked')});
        productPicture = $.createElement('div');
        productPicture.classList.add('product-img');
        productPicture.style.backgroundImage = `url(${productProperties.pictureLink})`;
        productPicture.setAttribute('loading' , 'lazy');
        productPicture.addEventListener('contextmenu' , event => showContextMenu(event , productProperties.pictureLink));
        productPictureWrapper.append(productPicture);
        productDetailsWrapper = $.createElement('div');
        productDetailsWrapper.classList.add('product-details');
        productTextWrapper = $.createElement('div');
        productTextWrapper.classList.add('product-text__wrapper');
        productTitle = $.createElement('h2');
        productTitle.classList.add('product-title');
        productTitle.textContent = productProperties.title;
        productTextWrapper.append(productTitle);
        productDescribe = $.createElement('p');
        productDescribe.classList.add('product-describe');
        productDescribe.textContent = productProperties.description;
        productTextWrapper.append(productDescribe);
        productDetailsWrapper.append(productTextWrapper);
        productPriceWrapper = $.createElement('div');
        productPriceWrapper.classList.add('product-price__wrapper');
        // productPriceDollorSign = $.createElement('p');
        // productPriceDollorSign.classList.add('product-price__dollor-sign');
        // productPriceDollorSign.innerHTML = 'IRR ';
        productPrice = $.createElement('span');
        productPrice.classList.add('product-price');
        productPrice.textContent = Number(productProperties.price);
        // productPriceDollorSign.append(productPrice);
        // productPriceWrapper.append(productPriceDollorSign);
        buyProductButton = $.createElement('a');
        buyProductButton.classList.add('btn' , 'buy-product-btn');
        buyProductButton.setAttribute('id' , productProperties.title)
        buyProductButton.textContent = 'خرید دوره';
        buyProductButton.setAttribute('target' , '_blank');
        buyProductButton.addEventListener('contextmenu' , event => showContextMenu(event , null , productProperties.buyLink))
        productPriceWrapper.append(buyProductButton);
        productDetailsWrapper.append(productPriceWrapper);
        productIconsWrapper = $.createElement('div');
        if (acces == "Admin") {
            productIconsWrapper.classList.add('product-icons__wrapper');
            deleteIcon = $.createElement('i');
            deleteIcon.classList.add('fa-solid' , 'fa-trash-can');
            deleteIcon.setAttribute('title' , 'Delete');
            deleteIcon.addEventListener('click' , event => {
                products.forEach(async (product , index) => {
                    if (product.title == event.target.parentElement.parentElement.firstElementChild.firstElementChild.textContent && product.description == event.target.parentElement.parentElement.firstElementChild.lastElementChild.textContent && product.pictureLink == event.target.parentElement.parentElement.previousElementSibling.firstElementChild.style.backgroundImage.substring(5 , event.target.parentElement.parentElement.previousElementSibling.firstElementChild.style.backgroundImage.length - 2) && product.buyLink == event.target.parentElement.previousElementSibling.lastElementChild.getAttribute('href') && product.price == Number(event.target.parentElement.previousElementSibling.firstElementChild.firstElementChild.textContent)) {
                        await products.splice(index , 1);
                        localStorage.setItem('Products' , JSON.stringify(products));
                    };
                });
                event.target.parentElement.parentElement.parentElement.remove();
            });
            productIconsWrapper.append(deleteIcon);
            editIcon = $.createElement('i');
            editIcon.classList.add('fa-solid' , 'fa-edit');
            editIcon.setAttribute('title' , 'Edit');
            editIcon.addEventListener('click' , async event => {
                clearAddProductForm();
                await products.forEach(async (product , index) => {
                    if (product.title == event.target.parentElement.parentElement.firstElementChild.firstElementChild.textContent && product.description == event.target.parentElement.parentElement.firstElementChild.lastElementChild.textContent && product.pictureLink == event.target.parentElement.parentElement.previousElementSibling.firstElementChild.style.backgroundImage.substring(5 , event.target.parentElement.parentElement.previousElementSibling.firstElementChild.style.backgroundImage.length - 2) && product.buyLink == event.target.parentElement.previousElementSibling.lastElementChild.getAttribute('href') && product.price == Number(event.target.parentElement.previousElementSibling.firstElementChild.firstElementChild.textContent)) {
                        setProductTitle.value = await product.title;
                        setProductDescribe.value = await product.description;
                        setProductPictureLink.value = await product.pictureLink;
                        setProductPrice.value = await product.price;
                        addProductButton.textContent = 'Save';
                        addProductPage.style.display = 'flex';
                        addProductButton.removeEventListener('click' , createProduct);
                        addProductButton.addEventListener('click' , async () => {
                            if (setProductTitle.value.length != 0 && setProductDescribe.value.length != 0 && setProductPictureLink.value.length != 0  && setProductPrice.value.length != 0) {
                                await products.splice(index , 1 , {title: setProductTitle.value.toString().trim() , description: setProductDescribe.value.toString().trim() , pictureLink: setProductPictureLink.value.toString().trim() , price: Number(setProductPrice.value)});
                                localStorage.setItem('Products' , JSON.stringify(products));
                                addProductPage.style.display = '';
                                addProductsToDOM(acces);
                                clearAddProductForm();
                                clearSearchBar();
                            } else {
                                allInputs.forEach(input => (input.value.toString().trim().length == 0 ? input.classList.add('error-input') : input.classList.remove('error-input')));
                            };
                        });
                    };
                });
            });
            productIconsWrapper.append(editIcon);
            productDetailsWrapper.append(productIconsWrapper);
        }
        productArticle.append(productPictureWrapper , productDetailsWrapper);
        productsWrapper.append(productArticle);
    });
};
async function createProduct () {
    if (setProductTitle.value.length != 0 && setProductDescribe.value.length != 0 && setProductPictureLink.value.length != 0 && checkUrl() && setProductPrice.value.length != 0) {
        (setProductPictureLink.value == 'https://' || setProductPictureLink.value == 'http://' ? setProductPictureLink.value = 'https://loadslammer.com/wp-content/uploads/2021/01/photo-placeholder-icon-17.jpg' : null);
        await products.push({title: setProductTitle.value.toString().trim() , description: setProductDescribe.value.toString().trim() , pictureLink: setProductPictureLink.value.toString().trim() , price: Number(setProductPrice.value)});
        localStorage.setItem('Products' , JSON.stringify(products));
        addProductPage.style.display = '';
        addProductsToDOM(access);
        clearAddProductForm();
    } else {
        allInputs.forEach(input => (input.value.toString().trim().length == 0 ? input.classList.add('error-input') : input.classList.remove('error-input')));
        _qsa('#set-product-picture-link , #set-product-buy-link').forEach(input => (!input.value.toString().startsWith('https://') && !input.value.toString().startsWith('http://') ? input.classList.add('error-input') : input.classList.remove('error-input')));
    };
};
function loginSuccess () {
    swal({
        title: "Welocme",
        icon: "success",
        className: "success-alert",
        timer: 2000,
        buttons: false,
        closeOnEsc: false,
        closeOnClickOutside: false
    });
};
function loginError () {
    swal({
        title: "This Account Doesn't Exist",
        icon: "error",
        className: "error-alert",
        buttons: {
            confirm: {
                text: "Create",
                value: true,
                visible: true,
                className: "create-account-btn",
                closeModal: true
            }
        }
    }).then(value => (value ? (_id('signup-form__container').style.display = 'flex' , _id('signup-fullname').focus()) : null));
};
function loginUser () {
    if (userName.value.toString().trim().length >= 4 && userPassword.value.length >= 4) {
        if (userName.value.toString().trim().toLowerCase() == "admin" && userPassword.value.toString() == "1234") {
            const User = {Fullname: "Visitor" , Username: "admin" , Password: "12345678" , Acces: "Admin"};
            access = 'Admin';
            addProductsToDOM(access);
            loginIcon.classList.replace('fa-arrow-right-to-bracket' , 'fa-arrow-right-from-bracket');
            changeLoginIconTitle(true);
            loginSuccess();
            _qs('#delete-account-btn').style.display = 'none';
            setUserProfile("admin" , User);
        } else {
            var users = JSON.parse(localStorage.getItem('Users')) , User = null;
            if (users.length != 0) {
                users.forEach(user => (userName.value.toString().trim().toLowerCase() == user.Username.toLowerCase() && userPassword.value.toString() == user.Password ? User = user : null));
                if (User != null) {
                    if (User.Acces == undefined) {
                        access = 'Visitor';
                        addProductsToDOM(access);
                        loginIcon.classList.replace('fa-arrow-right-to-bracket' , 'fa-arrow-right-from-bracket');
                        changeLoginIconTitle(true);
                        loginSuccess();
                        _qs('#delete-account-btn').removeAttribute('style');
                        setUserProfile(userName.value.toString().toLowerCase().trim());
                    };
                } else {
                    loginError();
                };
            } else {
                loginError();
            };
        };
        closeLoginPageIcon.click();
    } else {
        (userName.value.length < 4 ? userName.classList.add('error-input') : null);
        (userPassword.value.length < 4 ? userPassword.classList.add('error-input') : null);
    };
};
function searchProducts () {
    let productsWrapperChildren;
    productsWrapperChildren = [...productsWrapper.childNodes].filter(elem => !elem.classList.contains('add-product'));
    if (searchBar.value.length != 0) {
        productsWrapperChildren.forEach(elem => {
            if (elem.lastElementChild.firstElementChild.firstElementChild.textContent.toString().toLowerCase().includes(searchBar.value.toString().toLowerCase()) || elem.lastElementChild.firstElementChild.lastElementChild.textContent.toString().toLowerCase().includes(searchBar.value.toString().toLowerCase())) {
                (elem.hasAttribute('style') ? elem.removeAttribute('style') : null);
            } else {
                elem.style.display = 'none';
            };
        });
    } else {
        clearSearchIcon.style.display = '';
        productsWrapperChildren.forEach(elem => {
            (elem.hasAttribute('style') ? elem.removeAttribute('style') : null);
        });
    };
};
function clearSearchBar () {
    searchBar.value = '';
    clearSearchIcon.style.display = '';
    searchProducts();
};
function showContextMenu (event , PictureLink = null , BuyLink = null) {
    let cut = _id('cut-btn') , copy = _id('copy-btn') , paste = _id('paste-btn') , copyLink = _id('copy-link-btn') , print = _id('print-btn') , x = event.pageX, y = event.pageY , contextMenuWidth , contextMenuHeight;
    resetContextMenu(cut , copy , paste , copyLink , print);
    (PictureLink != null ? copyLink.addEventListener('click' , () => navigator.clipboard.writeText(PictureLink)) : null);
    (BuyLink != null ? copyLink.addEventListener('click' , () => navigator.clipboard.writeText(BuyLink)) : null);
    window.addEventListener('keydown' , event => (event.key == 'Escape' ? hideContextMenu() : null));
    window.addEventListener('click' , hideContextMenu);
    resetContextMenu(cut , copy , paste , copyLink , print);
    cut.style.display = 'none';
    copy.style.display = 'none';
    paste.style.display = 'none';
    copyLink.style.display = 'none';
    if (event.target.classList.contains('product-img')) {
        resetContextMenu(cut , copy , paste , copyLink , print);
        cut.style.display = 'none';
        copy.style.display = 'none';
        print.style.display = 'none';
    }
    if (event.target.classList.contains('product-describe')) {
        resetContextMenu(cut , copy , paste , copyLink , print);
        cut.style.display = 'none';
        print.style.display = 'none';
        copyLink.style.display = 'none';
    }
    if (event.target.classList.contains('buy-product-btn')) {
        resetContextMenu(cut , copy , paste , copyLink , print);
        cut.style.display = 'none';
        copy .style.display = 'none';
        print.style.display = 'none';
    }
    if (event.target.classList.contains('account-information')) {
        resetContextMenu(cut , copy , paste , copyLink , print);
        cut.style.display = 'none';
        copyLink.style.display = 'none';
        print.style.display = 'none';
    }
    if (event.target.tagName == 'INPUT') {
        resetContextMenu(cut , copy , paste , copyLink , print);
        print.style.display = 'none';
        copyLink.style.display = 'none';
    }
    paste.style.display = 'none';
    contextMenu.style.display = 'flex';
    contextMenuWidth = contextMenu.offsetWidth;
    contextMenuHeight = contextMenu.offsetHeight;
    contextMenu.style.display = 'none';
    if (Number(event.pageX) + contextMenuWidth >= Number(parseInt(getComputedStyle(_qs('#background')).width))) {
        x = Number(event.pageX) - contextMenuWidth;
    }
    if (Number(event.pageY) + contextMenuHeight >= Number(parseInt(getComputedStyle(_qs('#background')).height))) {
        y = Number(event.pageY) - contextMenuHeight;
    }
    contextMenu.style.top = y + 'px';
    contextMenu.style.left = x + 'px';
    (event.target.tagName == 'INPUT' ? (event.target.type != 'password' && !event.target.id.includes('password') ? contextMenu.style.display = 'flex' : null) : contextMenu.style.display = 'flex');
};
function hideContextMenu () {
    contextMenu.style.display = 'none';
};
function resetContextMenu (cut , copy , paste , copyLink , print) {
    cut.removeAttribute('style');
    copy.removeAttribute('style');
    print.removeAttribute('style');
    paste.removeAttribute('style');
    copyLink.removeAttribute('style');
};
async function cut (input , newText) {
    await navigator.clipboard.writeText(window.getSelection().toString());
    input.value = newText;
    searchProducts();
    _id('cut-btn').removeEventListener('click', startCut);
};
async function cutSelection (event) {
    var input = event.target , newText;
    if (input.type != 'password' && !input.id.includes('password')) {
        newText = await (input.value.toString().slice(0 , input.selectionStart)).concat(input.value.toString().slice(input.selectionEnd));
        _id('cut-btn').addEventListener('click' , startCut = () => cut(input , newText));
    }
};

// ? Events
window.addEventListener('load' , () => {
    const LOADER_PAGE = _id('loader');
    LOADER_PAGE.classList.add('hide');
    setTimeout(() => LOADER_PAGE.remove() , 1000);
});
window.addEventListener('keydown' , event => (event.key == 'F12' ? event.preventDefault() : null));
window.addEventListener('load' , () => addProductsToDOM(access));
window.addEventListener('load' , () => {changeLoginIconTitle(false);loginIcon.classList.replace('fa-arrow-right-from-bracket' , 'fa-arrow-right-to-bracket')});
window.addEventListener('keyup' , event => {
    (loginPage.style.display == 'flex' ? (event.key == 'Enter' ? loginButton.click() : null) : null);
    (loginPage.style.display == 'flex' ? (event.key == 'Escape' ? closeLoginPageIcon.click() : null) : null);
    (_id('signup-form__container').style.display == 'flex' ? (event.key == 'Escape' ? _id('close-signup-form-icon').click() : null) : null);
    (_id('account-profile__container').style.display == 'flex' ? (event.key == 'Escape' ? _id('close-account-profile-icon').click() : null) : null);
    (_id('signup-form__container').style.display == 'flex' ? (event.key == 'Enter' ? _id('signup-btn').click() : null) : null);
    (addProductPage.style.display == 'flex' ? (event.key == 'Enter' ? (addProductButton.textContent == 'Add' ? (event.target != setProductDescribe ? _id('add-product-btn').click() : null) : null) : null) : null);
});
window.addEventListener('contextmenu' , event => {event.preventDefault();showContextMenu(event)});
window.addEventListener('resize' , hideContextMenu);
searchBar.addEventListener('input' , searchProducts);
searchBar.addEventListener('contextmenu' , event => cutSelection(event));
searchIcon.addEventListener('click' , searchProducts);
loginIcon.addEventListener('click' , () => {
    if (loginIcon.classList.contains('fa-arrow-right-to-bracket')) {
        loginPage.style.display = 'flex';
    } else {
        loginIcon.classList.replace('fa-arrow-right-from-bracket' , 'fa-arrow-right-to-bracket');
        changeLoginIconTitle(false);
        access = '';
        localStorage.setItem('Acces' , access);
        _id('user-account-icon').parentElement.removeAttribute('style');
        addProductsToDOM(access);
    };
    clearLoginForm();
    clearSignupForm();
});
loginButton.addEventListener('click' , loginUser);
closeLoginPageIcon.addEventListener('click' , () => {loginPage.removeAttribute('style') , clearLoginForm()});
closeAddProductPageIcon.addEventListener('click' , () => {addProductPage.removeAttribute('style') , clearAddProductForm()});
clearSearchIcon.addEventListener('click' , clearSearchBar);
searchBar.addEventListener('input' , event => {(event.target.value.toString().trimStart().length == 0 ? removeStartSpace(event) : null); (event.target.value.toString().trim().length == 0 ? clearSearchIcon.style.display = 'none' : clearSearchIcon.style.display = 'flex')});
allInputs.forEach(input => input.addEventListener('focus' , event => {(event.target.value.toString().trim().length == 0 ? event.target.classList.add('error-input') : event.target.classList.remove('error-input'))}));
allInputs.forEach(input => input.addEventListener('input' , event => {(event.target.value.toString().trimStart().length == 0 ? removeStartSpace(event) : null); (event.target.value.toString().trim().length == 0 ? event.target.classList.add('error-input') : event.target.classList.remove('error-input'))}));
userPassword.removeEventListener('input' , removeStartSpace);
setProductPrice.removeEventListener('input' , removeStartSpace);
addProductButton.addEventListener('click' , createProduct);
showPasswordIcon.addEventListener('click' , () => {
    if (showPasswordIcon.classList.contains('fa-eye-slash')) {
        showPasswordIcon.classList.replace('fa-eye-slash' , 'fa-eye');
        userPassword.setAttribute('type' , 'text');
    } else {
        showPasswordIcon.classList.replace('fa-eye' , 'fa-eye-slash');
        userPassword.setAttribute('type' , 'password');
    };
});
_id('signup-show-password-icon').addEventListener('click' , () => {
    let icon = _id('signup-show-password-icon') , input = _id('signup-password');
    (icon.classList.contains('fa-eye-slash') ? (icon.classList.replace('fa-eye-slash' , 'fa-eye') , input.setAttribute('type' , 'text')) : (icon.classList.replace('fa-eye' , 'fa-eye-slash') , input.setAttribute('type' , 'password')));
});
_id('signup-show-repeat-password-icon').addEventListener('click' , () => {
    let icon = _id('signup-show-repeat-password-icon') , input = _id('signup-repeat-password');
    (icon.classList.contains('fa-eye-slash') ? (icon.classList.replace('fa-eye-slash' , 'fa-eye') , input.setAttribute('type' , 'text')) : (icon.classList.replace('fa-eye' , 'fa-eye-slash') , input.setAttribute('type' , 'password')));
});
_id('print-btn').addEventListener('click' , () => setTimeout(() => window.print() , 100));
_id('copy-btn').addEventListener('click' , () => navigator.clipboard.writeText(window.getSelection()));
_id('change-login-form-btn').addEventListener('click' , event => {
    event.preventDefault();
    clearSignupForm();
    clearLoginForm();
    loginPage.removeAttribute('style');
    _id('signup-form__container').style.display = 'flex';
});
_id('change-signup-form-btn').addEventListener('click' , event => {
    event.preventDefault();
    clearLoginForm();
    clearSignupForm();
    _id('signup-form__container').removeAttribute('style');
    loginPage.style.display = 'flex';
});
_id('close-signup-form-icon').addEventListener('click' , () => {_id('signup-form__container').removeAttribute('style') , clearSignupForm()});
_qsa('#username , #password , #signup-username , #signup-password').forEach(input => input.addEventListener('focus' , event => {(event.target.value.toString().length < 4 ? event.target.classList.add('error-input') : event.target.classList.remove('error-input'))}));
_qsa('#username , #password , #signup-password').forEach(input => input.addEventListener('input' , event => {(event.target.value.toString().trimStart().length < 4 ? removeStartSpace(event) : null); (event.target.value.toString().length < 4 ? event.target.classList.add('error-input') : event.target.classList.remove('error-input'))}));
// _qsa('#username , #password , #signup-username , #signup-password , #signup-repeat-password').forEach(input => input.addEventListener('contextmenu' , cutSelection));
_id('signup-username').addEventListener('input' , checkSignupUsername);
_id('signup-username').addEventListener('focus' , checkSignupUsername);
_id('signup-password').addEventListener('input' , event => {
    let passwordRepeatInput = _id('signup-repeat-password') , error = _id('signup-password-error');
    if (event.target.value.toString().trim() != passwordRepeatInput.value.toString().trim()) {
        passwordRepeatInput.classList.add('error-input');
        error.style.display = 'flex';
    } else {
        passwordRepeatInput.classList.remove('error-input');
        error.removeAttribute('style');
    }
    (event.target.value.length < 4 ? (_id('signup-repeat-password').setAttribute('disabled' , '') , _id('signup-repeat-password').value = '' , _id('signup-repeat-password').classList.remove('error-input') , _id('signup-password-error').removeAttribute('style')) : _id('signup-repeat-password').removeAttribute('disabled'))
});
_id('signup-repeat-password').addEventListener('focus' , checkRepeatPasswordInput);
_id('signup-repeat-password').addEventListener('input' , checkRepeatPasswordInput);
_id('signup-btn').addEventListener('click' , signupUser);
_qsa('#password , #signup-password , #signup-repeat-password').forEach(input => input.addEventListener('copy' , event => event.preventDefault()));
_qsa('#password , #signup-password , #signup-repeat-password').forEach(input => input.addEventListener('cut' , event => event.preventDefault()));
// _qsa('input').forEach(input => input.addEventListener('contextmenu' , cutSelection));
_id('account-password').addEventListener('click' , event => event.preventDefault());
_id('account-password').setAttribute('disabled' , '');
_id('close-account-profile-icon').addEventListener('click' , () => _id('account-profile__container').removeAttribute('style'));
_id('user-account-icon').addEventListener('click' , () => _id('account-profile__container').style.display = 'flex');
_id('delete-account-btn').addEventListener('click' , deleteAccountAlert);

// ? add Cart in localStorage

if(localStorage.getItem('cart') != null){
    cart = JSON.parse(localStorage.getItem('cart'))
}

setTimeout(() => {
    _qsa('.buy-product-btn').forEach(btn =>{
        btn.addEventListener('click' , e =>{
            e.preventDefault()
            let obj = {id : e.target.id , len : 1}
            cart.splice(cart.findIndex(w => w == obj), 1);
            cart.push(obj)
            cart = [...new Set(cart)]
            localStorage.setItem('cart' , JSON.stringify(cart))
        })
    })
}, 100);

// * Finish Coding
////--------------------------------------------------------------------------------------------------------------
//TODO Version 2.0.0

// ! All Copyrights Reserved ©

// * Created with ❤️ by Sobhan Musazadeh