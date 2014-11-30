$(document).ready(
  function() {
    //set initial row background
    sCart.setBackground();
    //Auto update cart
    $('.item-quantity-input').keyup(
      function() {
        //Reset text in item-total-button
        $(".item-total-button").html('Calculate Prices');
        //Judge Input correctness
        sCart.judgeInputField($(this));
        //Calculate Subtotal
        $(this).parent().next().html(
          "$" +
          (sCart.centToDollar(sCart.calcSubtotal($(this), $(this).parent().prev()))).toFixed(2)
        );
        //Update Total
        $('.item-total-total').html("$" + (sCart.calcTotalPrice()).toFixed(2));
      }
    );
    //Calculate Button
    $(".item-total-button").click(
      function() {
        //Update Total
        $('.item-total-total').html("$" + (sCart.calcTotalPrice()).toFixed(2));
        //Change text in item-total-button
        $(this).html('Calculated!');
      }
    );
    //Delete Button
    $('.item-delete-button').click(
      function() {
        //Delete entire item div
        $(this).parent().parent().remove();
        //Reload row background
        setBackground();
        //Update Total
        $('.item-total-total').html("$" + (sCart.calcTotalPrice()).toFixed(2));
      }
    );
    //Add Button
    $('.item-add-button').click(
      function() {
        $('.item-add-list').val();
      }
    );
  }
);

var sCart = {
  masterItemList: [{
    name: "Salmon",
    price: 4000,
    sku: "DFS723"
  }, {
    name: "Tuna",
    price: 4000,
    sku: "PDIK988"
  }, {
    name: "Carp",
    price: 4000,
    sku: "HDK87"
  }, {
    name: "Beef",
    price: 4000,
    sku: "EDT09"
  }, {
    name: "Chicken",
    price: 4000,
    sku: "UIY87"
  }, {
    name: "Pork",
    price: 4000,
    sku: "GYUIHJLK23"
  }, {
    name: "Sausage",
    price: 4000,
    sku: "NJIKH687"
  }, {
    name: "Bread",
    price: 4000,
    sku: "KJ782"
  }, {
    name: "Cheese",
    price: 4000,
    sku: "SDF72"
  }],
  cart: [],
  setBackground: function() {
    $($($(".item-name:even")).parent()).css("background-color", "white");
    $($(".item-quantity-input:even")).css("background-color", "white");
    $($($(".item-name:odd")).parent()).css("background-color", "#dddddd");
    $($(".item-quantity-input:odd")).css("background-color", "#dddddd");
  },
  judgeInputField: function(itemObj) {
    var quantityNum = itemObj.val();
    if (quantityNum > 0) {
      $(itemObj).parent().addClass('has-success');
      $(itemObj).parent().removeClass('has-error');
      return;
    } else if (quantityNum == 0) {
      $(itemObj).parent().removeClass('has-success');
      $(itemObj).parent().removeClass('has-error');
      return;
    } else {
      $(itemObj).parent().removeClass('has-success');
      $(itemObj).parent().addClass('has-error');
      return;
    }
  },
  calcTotalPrice: function() {
    this.makeCart();
    var totalPrice = 0;
    for (index in this.cart) {
      totalPrice += this.cart[index].price * this.cart[index].quantity;
    }
    return this.centToDollar(totalPrice);
  },
  makeCart: function() {
    this.inputError = [];
    this.cart = [];
    for (var i = 0; i < $('.item-name').length; i++) {
      var itemObj = {
        name: this.getCleanItemName($($('.item-name')[i])),
        price: this.getCleanItemPrice(($($('.item-price')[i]))),
        sku: $($('.item-name')[i]).val(),
        quantity: this.getCleanItemQuantity(($($('.item-quantity-input')[i])))
      };
      this.cart.push(itemObj);
    }
    this.alertUserInputError();
    return this.cart;
  },
  centToDollar: function(cent) {
    return cent / 100;
  },
  calcSubtotal: function(itemObj, itemObj2) {
    return this.getCleanItemPrice(itemObj2) * this.getCleanItemQuantity(itemObj);
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
      return quantityNum;
    } else if (quantityNum == 0) {
      return 0;
    } else {
      this.inputError.push(false);
      return 0;
    }
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
  errorMessageAlert: ['We have ignore some of your values because they were invalid!']
}
