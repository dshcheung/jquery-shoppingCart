$(document).ready(
  function() {
    //set initial row background
    sCart.setBackground();
    //set initial select tag input
    sCart.updateSelectOption();
    //Auto update cart
    $('.item-table').on("keyup", ".item-quantity-input",
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
    $('.item-total').on("click", ".item-total-button",
      function() {
        //Update Total
        $('.item-total-total').html("$" + (sCart.calcTotalPrice()).toFixed(2));
        //Change text in item-total-button
        $(this).html('Calculated!');
      }
    );
    //Delete Button
    $('.item-table').on("click", ".item-delete-button",
      function() {
        //Delete entire item div
        $(this).parent().parent().remove();
        //Reload row background
        sCart.setBackground();
        //Update Total
        $('.item-total-total').html("$" + (sCart.calcTotalPrice()).toFixed(2));
        sCart.updateSelectOption()
      }
    );
    //Add Button
    $('.item-add').on("click", ".item-add-button",
      function() {
        var sku = $('.item-add-list').find(":selected").data('sku');
        var name = $('.item-add-list').find(":selected").data('name');
        var value = $('.item-add-list').find(":selected").data('value');
        sCart.putNewItem(sku, name, value);
        sCart.updateSelectOption();
        sCart.setBackground();
      }
    );
  }
);

var sCart = {
  putNewItem: function(sku, name, value) {
    $('.item-table').append(
      '<div class="item-table-row col-xs-12">' +
      '<div class="item-name col-xs-3" data-sku=' + sku + ' data-name=' + name + '>' + name + '</div>' +
      '<div class="item-price col-xs-2" data-value=' + value + '>$' + this.centToDollar(value).toFixed(2) + '</div>' +
      '<div class="item-quantity col-xs-2">' +
      '<input value="0" placeholder="0" class="item-quantity-input form-control">' +
      '</div>' +
      '<div class="item-subtotal col-xs-3">$0.00</div>' +
      '<div class="item-delete col-xs-2">' +
      '<button type="button" class="item-delete-button btn btn-warning col-xs-6">Delete</button>' +
      '</div>' +
      '</div>'
    );
  },
  updateSelectOption: function() {
    this.makeCart();
    this.selectOption = [];
    $('.item-add-list').empty();
    var located = false;
    for (i in this.masterItemList) {
      located = false;
      for (n in this.cart) {
        if (this.masterItemList[i].sku == this.cart[n].sku) {
          located = true;
        }
      }
      if (located == false) {
        this.selectOption.push(this.masterItemList[i]);
      }
    }
    for (k in this.selectOption) {
      var sku = this.selectOption[k].sku;
      var name = this.selectOption[k].name;
      var value = this.selectOption[k].price;
      $('.item-add-list').append('<option data-sku=' + sku + ' data-name=' + name +
        ' data-value=' + value + '>' + name + '</option>'
      )
    }
    if (this.selectOption.length == 0) {
      $('.item-add-list').append('<option>No More Item to Add!</option>');
      $('.item-add-button').attr('disabled', 'disabled');
    } else {
      $('.item-add-button').removeAttr('disabled');
    }
  },
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
  selectOption: [],
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
        name: $($('.item-name')[i]).data('name'),
        price: $($('.item-price')[i]).data('value'),
        sku: $($('.item-name')[i]).data('sku'),
        quantity: $($('.item-quantity-input')[i]).val()
      };
      this.cart.push(itemObj);
    }
    this.alertUserInputError();
    return this.cart;
  },
  calcSubtotal: function(itemObj, itemObj2) {
    return itemObj2.data('value') * this.getCleanItemQuantity(itemObj);
  },
  centToDollar: function(cent) {
    return cent / 100;
  },
  getCleanItemQuantity: function(itemObj) {
    var quantityNum = itemObj.val();
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
      $('.alert-message').addClass('hidden');
    } else {
      $('.alert-message').removeClass('hidden');
      $('.alert-message').text(this.errorMessageAlert[0]);
    }
  },
  errorMessageAlert: ['We have ignore some of your values because they were invalid!']
}
