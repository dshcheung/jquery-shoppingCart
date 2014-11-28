$(document).ready(
  function(){
    $("button#calc-prices-button").click(
      function() {
        $('#total-price').html("$" + (shoppingCart.calcTotalPrice()).toFixed(2));
      }
    );
    $('.quantity').blur(
      function (){
        for (var index = 0; index < $('.quantity').length; index++){
          if (this == $('.quantity')[index]){
            shoppingCart.judgeInputField(index);
          }
        }
        $('#total-price').html("$" + (shoppingCart.calcTotalPrice()).toFixed(2));
      }
    );
    $('button#delete-entry').click(

    );
  }
);

var shoppingCart = {
  cart: [],
  calcTotalPrice: function() {
    this.makeCart();
    var totalPrice = 0;
    for (index in this.cart) {
      totalPrice += this.calcItemPrice(index);
    }
    return this.centToDollar(totalPrice);
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
    this.alertUserInputError();
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
    if (quantityNum > 0) {
      this.inputError.push(true);
      return quantityNum;
    } 
    else if (quantityNum == 0){
      return 0;
    }
    else {
      this.inputError.push(false);
      return 0;
    }
  },
  judgeInputField: function(index) {
    var quantityNum = $('.quantity')[index].value;
    if (quantityNum > 0) {
      this.makeFieldGreen(index);
      return;
    }
    else if (quantityNum == 0) {
      this.makeFieldNothing(index)
      return;
    }
    else {
      this.makeFieldRed(index);
      return;
    }
  },
  makeFieldGreen: function(index) {
    $($('.quantity')[index]).parent().addClass('has-success');
    $($('.quantity')[index]).parent().removeClass('has-error');
  },
  makeFieldNothing: function(index){
    $($('.quantity')[index]).parent().removeClass('has-success');
    $($('.quantity')[index]).parent().removeClass('has-error');
  },
  makeFieldRed: function(index) {
    $($('.quantity')[index]).parent().removeClass('has-success');
    $($('.quantity')[index]).parent().addClass('has-error');
  },
  inputError: [],
  alertUserInputError: function() {
    var hasNoError = true;
    for (index in this.inputError){
      if (this.inputError[index] == false){
        hasNoError = false;
      }
    }
    if (hasNoError) {
        $('#alert-message').addClass('hidden');
    } else {
        $('#alert-message').removeClass('hidden');
        $('#alert-message').text(this.errorMessageAlert);
    }
  },
  centToDollar: function(cent) {
    return cent / 100;
  },
  errorMessageAlert: ['We have ignore some of your values because they were invalid!']
}
