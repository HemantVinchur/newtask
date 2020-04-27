var doneTypingInterval = 300;  //time in ms
var typingTimer;               //timer identifier

//populate instruction table
var input_id_arr = [];
var eles_to_populate = document.getElementsByClassName('input_group');
for (var i = 0; i < eles_to_populate.length; i++) {
  var input_id = 'i_i' + i;
  var to_validate_input = eles_to_populate[i].getElementsByClassName('input')[0];

  if (to_validate_input !== undefined) {
    if (to_validate_input.id === '') {
      to_validate_input.id = input_id;
    } else {
      input_id = to_validate_input.id;
    }
    var validate_for = to_validate_input.getAttribute('validate_for');

    if (validate_for !== null) {
      var instruction_set = '';
      var validation_type_arr = validate_for.split(',');

      var is_id_arr = [];
      for (var i1 = 0; i1 < validation_type_arr.length; i1++) {
        var value_arr = validation_type_arr[i1].split(':');
        var v_regex_instruct = regex_instruct(value_arr);
        var is_id = 'i_s_' + i + '_' + i1;
        is_id_arr.push(is_id);
        instruction_set += '<li id="' + is_id + '">' + v_regex_instruct[1] + '</li>';
      }
      input_id_arr[input_id] = is_id_arr;
      var toappend = '<ul class="instruct">' +
        '<span>' +
        instruction_set +
        '</span>' +
        '</ul>' +
        '<i class="style"></i>';
      $(eles_to_populate[i]).append(toappend);
    }
  }
}

//finding regex
function regex_instruct(key) {
  var valid_reg = '';
  var key_value = 0;
  var value_range = 0;
  var toinstruct = '';

  switch (key[0]) {
    case 'alphabets_only':
      valid_reg = /^[a-zA-Z ]+$/;
      toinstruct = 'only alphabets are allowed';
      break;
    case 'required':
      valid_reg = /([^\s])/;
      toinstruct = "you can't leave this empty";

      break;
    case 'max_length':
      key_value = key[1];
      valid_reg = new RegExp('^.{1,' + key_value + '}$');
      toinstruct = "maximum length is " + key_value + " only";

      break;
    case 'numbers_only':
      valid_reg = /^\d+$/;
      toinstruct = "only numbers are allowed";

      break;
    case 'email':
      valid_reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      toinstruct = "please input a valid email ID";

      break;
    case 'password':
      valid_reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
      toinstruct = "Use 8 or more characters with a mix of uppercase and lowecase alphabets, numbers & symbols";

      break;
    case 'min_max_length':
      var value_range = key[1].split('-');
      valid_reg = new RegExp('^.{' + value_range[0] + ',' + value_range[1] + '}$');
      toinstruct = value_range[0] + " minimum and " + value_range[1] + " maximum length";

      break;
    case 'confirm_input':
      from_input_box = document.getElementById(key[1]);
      from_input = from_input_box.value;
      valid_reg = new RegExp('^' + from_input + '$');
      toinstruct = "should be same as previous";

      break;
    case 'mobile':
      valid_reg = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
      toinstruct = "enter a valid mobile number";
  }
  var toreturn = [];
  toreturn.push(valid_reg);
  toreturn.push(toinstruct);
  return toreturn;
}
//validating input
function validate_input(ele) {

  if (ele!==undefined) {
    if (ele.target!=undefined) {
      this_ele=ele.target;
    }else {
      this_ele=this;
    }
  }else {
    this_ele=this;
  }

  var to_validate_input_id = this_ele.id;
  var validation_type = this_ele.getAttribute('validate_for');
  if (validation_type !== null) {
    var string_to_check = this_ele.value;
    var validation_type_arr = validation_type.split(',');

    var isvalidated = [];
    for (var i = 0; i < validation_type_arr.length; i++) {
      var value_arr = validation_type_arr[i].split(':');

      var v_regex_instruct = regex_instruct(value_arr);
      var valid_reg = v_regex_instruct[0];

      if (valid_reg !== '') {
        if (valid_reg.test(string_to_check)) {
          isvalidated.push(true);
          document.getElementById(input_id_arr[to_validate_input_id][i]).setAttribute('checked', '');
        } else {
          isvalidated.push(false);
          document.getElementById(input_id_arr[to_validate_input_id][i]).removeAttribute('checked');
        }
      } else {
        console.log('validation not defined for' + ' ' + key[0]);
      }
    }

    //marking elements
    if (isvalidated.indexOf(false) >= 0) {
      this_ele.removeAttribute("valid");
      this_ele.setAttribute("invalid", "");
      return false;
    } else {
      this_ele.removeAttribute("invalid");
      this_ele.setAttribute("valid", "");
      return true;
    }
    //marking elements
  } else {
    return true;
  }
  return false;
}

//validating whole form
function validate_form(form_id) {
  var form_inputs = document.getElementById(form_id).getElementsByClassName('input');
  var isvalidated = [];
  for (var i = 0; i < form_inputs.length; i++) {
    isvalidated.push(validate_input.call(form_inputs[i]));
  }
  if (isvalidated.indexOf(false) >= 0) {
    return false;
  } else {
    return true;
  }
  return false;
}

//binding event handler
var eles_to_validate = document.getElementsByClassName('input');
for (var i = 0; i < eles_to_validate.length; i++) {
  eles_to_validate[i].addEventListener('keyup', validator_track_type);
}

function validator_track_type(ele){
  clearTimeout(typingTimer);
  if (this.value) {
    typingTimer = setTimeout(function(){validate_input(ele)}, doneTypingInterval);
  }
}
