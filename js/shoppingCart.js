$("button#calc-prices-button").click(
  function() {
    shoppingCart.makeCart();
    if (shoppingCart.alertUserInputError() == false) {
      $('#total-price').html("INVALID QUANTITY");
      $('#total-price').addClass("invalid");
    } else {
      $('#total-price').html(shoppingCart.calcTotalPrice());
      $('#total-price').removeClass("invalid");
    }
  }
);

var shoppingCart = {
  cart: [],
  calcTotalPrice: function() {
    var totalPrice = 0;
    for (index in this.cart) {
      totalPrice += this.calcItemPrice(index);
    }
    return "$" + this.centToDollar(totalPrice);
  },
  calcItemPrice: function(index) {
    return this.cart[index].price * this.cart[index].quantity;
  },
  makeCart: function() {
    this.inputError = [];
    this.cart = [];
    for (var i = 0; i < $('.item-name').length; i++) {
      var itemObj = {
        itemName: this.getCleanItemName(i),
        price: this.getCleanItemPrice(i),
        quantity: this.getCleanItemQuantity(i)
      };
      this.cart.push(itemObj);
    }
    return this.cart;
  },
  getCleanItemName: function(index) {
    var name = $.trim($($('.item-name')[index]).text());
    return name;
  },
  getCleanItemPrice: function(index) {
    var priceCurDollarString = $.trim($($('.item-price')[index]).text());
    var priceJustDollarString = priceCurDollarString.split('$');
    var priceDollarNum = parseFloat(priceJustDollarString[1]);
    var priceCentNum = priceDollarNum * 100;

    return priceCentNum;
  },
  getCleanItemQuantity: function(index) {
    var quantityNum = $('.quantity')[index].value;
    if (quantityNum && quantityNum >= 0) {
      this.makeFieldGreen(index, false);
      this.inputError.push(true);
      return quantityNum;
    } else {
      this.makeFieldRed(index, true);
      this.inputError.push(false);
    }
  },
  makeFieldGreen: function(index) {
    $($('.quantity')[index]).addClass('inputCorrect');
    $($('.quantity')[index]).removeClass('inputWrong');

  },
  makeFieldRed: function(index) {
    $($('.quantity')[index]).removeClass('inputCorrect');
    $($('.quantity')[index]).addClass('inputWrong');
  },
  inputError: [],
  alertUserInputError: function() {
    for (index in this.inputError) {
      if (this.inputError[index] == false) {
        alert(
          "Cannot calculate price!\n" +
          "Invalid input is highlighted in red!\n" +
          "Please make sure your quantity is a number!"
        );
        return false;
      } else {
        return true;
      }
    }
  },
  centToDollar: function(cent) {
    return cent / 100;
  }
}
