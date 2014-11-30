$(document).ready(
  function() {
    var setBackground = function() {
      $($($(".item-name:even")).parent()).css("background-color", "white");
      $($(".quantity:even")).css("background-color", "white");
      $($($(".item-name:odd")).parent()).css("background-color", "#dddddd");
      $($(".quantity:odd")).css("background-color", "#dddddd");
    }
    setBackground();
    $("button#calc-prices-button").click(
      function() {
        $('#total-price').html("$" + (shoppingCart.calcTotalPrice()).toFixed(2));
        $(this).html('Calculated!');
      }
    );
    $('.quantity').keyup(
      function() {
        $("button#calc-prices-button").html('Calculate Prices');
        shoppingCart.judgeInputField($(this));
        $(this).parent().next().html(
          "$" +
          (shoppingCart.centToDollar(shoppingCart.calcSubtotal($(this), $(this).parent().prev()))).toFixed(2)
        );
        $('#total-price').html("$" + (shoppingCart.calcTotalPrice()).toFixed(2));
      }
    );
    $('button.item-delete').click(
      function() {
        $(this).parent().parent().remove();
        setBackground();
        $('#total-price').html("$" + (shoppingCart.calcTotalPrice()).toFixed(2));
      }
    );
    $('.item-add-button').click(
      function() {

        $('.item-add-list').val();
      }
    );
  }
);

var shoppingCart = {
  cart: [],
  getIndexPosition: function(targetToCompare, targetToFind) {
    for (var index = 0; index < $(targetToCompare).length; index++) {
      if (targetToFind == $(targetToCompare)[index]) {
        return index;
      }
    }
  },
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
  calcSubtotal: function(itemObj, itemObj2) {
    return this.getCleanItemPrice(itemObj2) * this.getCleanItemQuantity(itemObj);
  },
  makeCart: function() {
    this.inputError = [];
    this.cart = [];
    for (var i = 0; i < $('.item-name').length; i++) {
      var itemObj = {
        itemName: this.getCleanItemName($($('.item-name')[i])),
        price: this.getCleanItemPrice(($($('.item-price')[i]))),
        quantity: this.getCleanItemQuantity(($($('.quantity')[i])))
      };
      this.cart.push(itemObj);
    }
    this.alertUserInputError();
    return this.cart;
  },
  getCleanItemName: function(itemObj) {
    var name = $.trim($(itemObj).text());
    return name;
  },
  getCleanItemPrice: function(itemObj) {
    var priceCurDollarString = $.trim($(itemObj).text());
    var priceJustDollarString = priceCurDollarString.split('$');
    var priceDollarNum = parseFloat(priceJustDollarString[1]);
    var priceCentNum = priceDollarNum * 100;
    return priceCentNum;
  },
  getCleanItemQuantity: function(itemObj) {
    var quantityNum = $(itemObj).val();
    if (quantityNum > 0) {
      console.log("first");
      this.inputError.push(true);
      return quantityNum;
    } else if (quantityNum == 0) {
      console.log("second");
      return 0;
    } else {
      console.log("third");
      this.inputError.push(false);
      return 0;
    }
  },
  judgeInputField: function(itemObj) {
    var quantityNum = itemObj.val();
    if (quantityNum > 0) {
      this.makeFieldGreen(itemObj);
      return;
    } else if (quantityNum == 0) {
      this.makeFieldNothing(itemObj);
      return;
    } else {
      this.makeFieldRed(itemObj);
      return;
    }
  },
  makeFieldGreen: function(itemObj) {
    $(itemObj).parent().addClass('has-success');
    $(itemObj).parent().removeClass('has-error');
  },
  makeFieldNothing: function(itemObj) {
    $(itemObj).parent().removeClass('has-success');
    $(itemObj).parent().removeClass('has-error');
  },
  makeFieldRed: function(itemObj) {
    $(itemObj).parent().removeClass('has-success');
    $(itemObj).parent().addClass('has-error');
  },
  inputError: [],
  alertUserInputError: function() {
    var hasNoError = true;
    for (index in this.inputError) {
      if (this.inputError[index] == false) {
        hasNoError = false;
      }
    }
    if (hasNoError) {
      $('#alert-message').addClass('hidden');
    } else {
      $('#alert-message').removeClass('hidden');
      $('#alert-message').text(this.errorMessageAlert[0]);
    }
  },
  centToDollar: function(cent) {
    return cent / 100;
  },
  errorMessageAlert: ['We have ignore some of your values because they were invalid!'],
  masterItemList: [{
    name: "Salmon",
    price: 4000,
    desc: "lorem ipsum",
    sku: "DFS723"
  }, {
    name: "Tuna",
    price: 4000,
    desc: "lorem ipsum",
    sku: "PDIK988"
  }, {
    name: "Carp",
    price: 4000,
    desc: "lorem ipsum",
    sku: "HDK87"
  }, {
    name: "Beef",
    price: 4000,
    desc: "lorem ipsum",
    sku: "EDT09"
  }, {
    name: "Chicken",
    price: 4000,
    desc: "lorem ipsum",
    sku: "UIY87"
  }, {
    name: "Pork",
    price: 4000,
    desc: "lorem ipsum",
    sku: "GYUIHJLK23"
  }, {
    name: "Sausage",
    price: 4000,
    desc: "lorem ipsum",
    sku: "NJIKH687"
  }, {
    name: "Bread",
    price: 4000,
    desc: "lorem ipsum",
    sku: "KJ782"
  }, {
    name: "Cheese",
    price: 4000,
    desc: "lorem ipsum",
    sku: "SDF72"
  }]
}
