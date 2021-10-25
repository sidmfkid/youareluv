$(document).ready(function () {

const menu = document.querySelector('.header__content-hamburger')
const nav = document.querySelector('.header__content')
const header = document.querySelector('.header')
const overlay = document.querySelector('.header__overlay')

menu.addEventListener('click', (e) => {
    e.preventDefault();
    nav.classList.toggle('open');
    header.classList.toggle('open');
    overlay.classList.toggle('open');
})

const navHeight = nav.getBoundingClientRect().height;
// console.log(navHeight)


const stickyNav = function (entries) {
    const [entry] = entries;

    // console.log(entry)
    if (!entry.isIntersecting) {
    nav.classList.add('sticky');
    setTimeout(() => {
        nav.classList.add('down')
    }, 500);
}
    else  {
        setTimeout(() => {
            nav.classList.remove('sticky')
        }, 500);
        nav.classList.remove('down');
    }
 }


const observerHeader = new IntersectionObserver(stickyNav, {
    root: null,
    threshold: 0,
    rootMargin: '500px',
});

observerHeader.observe(header);

const allSections = document.querySelectorAll('section')

const revealSection = function (entries, observer) { 
    const [entry] = entries;
    entry.target.classList.remove('hide')
    // console.log(entry)
 }

 const sectionObserver = new IntersectionObserver(revealSection, {
     root: null,
     threshold: .15,
 })
 allSections.forEach(function (section) { 
    sectionObserver.observe(section)
    section.classList.add('hide');
 })

})

const cartIcon = document.querySelector('.header__content-cart');
const cartDrawer = document.querySelector('cart-drawer');

function openDrawer() {
    if (cartDrawer.dataset.state === 'open') {
    cartDrawer.setAttribute('data-state', 'closed');
    } else {
    cartDrawer.setAttribute('data-state', 'open');
    }
    console.log()
 }

 cartIcon.addEventListener('click', openDrawer, false)


 function getCart(){
  const cartBubble = document.querySelector('.header__content-cart .cart-bubble')
  fetch('/cart.js', {
    method: 'GET'
  })
  .then(response => response.json())
  .then(cartData => 
    {
      
      cartBubble.textContent = `${cartData.item_count}`
      
    })
}
window.onload = getCart();



 function debounce(fn, wait) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(this, args), wait);
    };
  }
  
  const serializeForm = form => {
    const obj = {};
    const formData = new FormData(form);
  
    for (const key of formData.keys()) {
      const regex = /(?:^(properties\[))(.*?)(?:\]$)/;
  
      if (regex.test(key)) {
        obj.properties = obj.properties || {};
        obj.properties[regex.exec(key)[2]] = formData.get(key);
      } else {
        obj[key] = formData.get(key);
      }
    }
  
    return JSON.stringify(obj);
  };

 function fetchConfig(type = 'json') {
    return {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': `application/${type}` }
    };
  }

  if ((typeof window.Shopify) == 'undefined') {
    window.Shopify = {};
  }
  
  Shopify.bind = function(fn, scope) {
    return function() {
      return fn.apply(scope, arguments);
    }
  };
  
  Shopify.setSelectorByValue = function(selector, value) {
    for (var i = 0, count = selector.options.length; i < count; i++) {
      var option = selector.options[i];
      if (value == option.value || value == option.innerHTML) {
        selector.selectedIndex = i;
        return i;
      }
    }
  };
  
  Shopify.addListener = function(target, eventName, callback) {
    target.addEventListener ? target.addEventListener(eventName, callback, false) : target.attachEvent('on'+eventName, callback);
  };
  
  Shopify.postLink = function(path, options) {
    options = options || {};
    var method = options['method'] || 'post';
    var params = options['parameters'] || {};
  
    var form = document.createElement("form");
    form.setAttribute("method", method);
    form.setAttribute("action", path);
  
    for(var key in params) {
      var hiddenField = document.createElement("input");
      hiddenField.setAttribute("type", "hidden");
      hiddenField.setAttribute("name", key);
      hiddenField.setAttribute("value", params[key]);
      form.appendChild(hiddenField);
    }
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };
  
  Shopify.CountryProvinceSelector = function(country_domid, province_domid, options) {
    this.countryEl         = document.getElementById(country_domid);
    this.provinceEl        = document.getElementById(province_domid);
    this.provinceContainer = document.getElementById(options['hideElement'] || province_domid);
  
    Shopify.addListener(this.countryEl, 'change', Shopify.bind(this.countryHandler,this));
  
    this.initCountry();
    this.initProvince();
  };
  
  Shopify.CountryProvinceSelector.prototype = {
    initCountry: function() {
      var value = this.countryEl.getAttribute('data-default');
      Shopify.setSelectorByValue(this.countryEl, value);
      this.countryHandler();
    },
  
    initProvince: function() {
      var value = this.provinceEl.getAttribute('data-default');
      if (value && this.provinceEl.options.length > 0) {
        Shopify.setSelectorByValue(this.provinceEl, value);
      }
    },
  
    countryHandler: function(e) {
      var opt       = this.countryEl.options[this.countryEl.selectedIndex];
      var raw       = opt.getAttribute('data-provinces');
      var provinces = JSON.parse(raw);
  
      this.clearOptions(this.provinceEl);
      if (provinces && provinces.length == 0) {
        this.provinceContainer.style.display = 'none';
      } else {
        for (var i = 0; i < provinces.length; i++) {
          var opt = document.createElement('option');
          opt.value = provinces[i][0];
          opt.innerHTML = provinces[i][1];
          this.provinceEl.appendChild(opt);
        }
  
        this.provinceContainer.style.display = "";
      }
    },
  
    clearOptions: function(selector) {
      while (selector.firstChild) {
        selector.removeChild(selector.firstChild);
      }
    },
  
    setOptions: function(selector, values) {
      for (var i = 0, count = values.length; i < values.length; i++) {
        var opt = document.createElement('option');
        opt.value = values[i];
        opt.innerHTML = values[i];
        selector.appendChild(opt);
      }
    }
  };

  class VariantRadios extends HTMLElement {
    constructor() {
      super();
    this.addEventListener('change', this.onVariantChange);

    }

    onVariantChange(){
        this.updateOptions();
        this.updateMasterId();
        
        if (!this.currentVariant){
            console.log('unavailable');
        }else{
      this.updateURL();
      this.renderProductInfo();

        }

    }
  
    updateOptions() {
      const fieldsets = Array.from(this.querySelectorAll('fieldset'));
      this.options = fieldsets.map((fieldset) => {
        return Array.from(fieldset.querySelectorAll('input')).find((radio) => radio.checked).value;
      });
      console.log('This is this current option',this.options)
    }

    updateMasterId() {
        this.currentVariant = this.getVariantData().find((variant) => {
          return !variant.options.map((option, index) => {
            return this.options[index] === option;
          }).includes(false);
        });
        console.log('this is curent value', this.currentVariant)
      }

      getVariantData() {
        this.variantData = this.variantData || JSON.parse(this.querySelector('[type="application/json"]').textContent);
        return this.variantData;
      }
      updateURL() {
        if (!this.currentVariant || this.dataset.updateUrl === 'false') return;
        window.history.replaceState({ }, '', `${this.dataset.url}?variant=${this.currentVariant.id}`);
      }

      renderProductInfo() {
        fetch(`${this.dataset.url}?variant=${this.currentVariant.id}&section_id=${this.dataset.section}`)
          .then((response) => response.text())
          .then((responseText) => {
            const id = `price-${this.dataset.section}`;
            const html = new DOMParser().parseFromString(responseText, 'text/html')
            const destination = document.getElementById(id);
            const source = html.getElementById(id);
    
            if (source && destination) destination.dataset.price = source.dataset.price;
    
            const cartBubble = document.getElementById(`price-${this.dataset.section}`);
    

          });
      }
  }

customElements.define('variant-radios', VariantRadios);

class QuantityInput extends HTMLElement {
  constructor() {
    super();
    this.input = this.querySelector('input');
    this.changeEvent = new Event('change', { bubbles: true })

    
    this.querySelectorAll('button').forEach(
      (button) => button.addEventListener('click', this.onButtonClick.bind(this))
    );
  }

  onButtonClick(event) {
    event.preventDefault();
    const previousValue = this.input.value;

    event.target.name === 'plus' ? this.input.stepUp(1) : this.input.stepDown(1);
    if (previousValue !== this.input.value) this.input.dispatchEvent(this.changeEvent);
    console.log(this.input.value)
  }
}
customElements.define('quantity-input', QuantityInput);



