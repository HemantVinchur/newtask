//sidebar
var toggle_drpdwn = document.getElementsByClassName('toggle_drpdwn');

for (var i = 0; i < toggle_drpdwn.length; i++) {
  toggle_drpdwn[i].addEventListener('click', toggle_dropdown, false);
}

function toggle_dropdown() {
  var target_menu_parent = this.parentElement;
  var target_menu = target_menu_parent.getElementsByClassName('drop_menu');
  var target_menu_status = target_menu[0].className;

  if (target_menu_status == 'drop_menu active') {
    target_menu_parent.removeAttribute('dropdown_active');
    target_menu[0].className = 'drop_menu';
  } else {
    target_menu_parent.setAttribute('dropdown_active', '');
    target_menu[0].className = 'drop_menu active';
  }
}

//button states
function change_button_state(ele, state, repose = false) {
  ele.setAttribute('data-state', state);
  if (repose !== false) {
    setTimeout(function() {
      ele.removeAttribute('data-state');
    }, 1500);
  }
}

//finding get parameter
function findGetParameter(parameterName) {
  var result = null,
    tmp = [];
  location.search
    .substr(1)
    .split("&")
    .forEach(function(item) {
      tmp = item.split("=");
      if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
    });
  return result;
}

// getting all inputs
function form_inputs(form_id) {
  var form = document.getElementById(form_id).getElementsByClassName('input');
  var elements = '';
  for (var i = 0; i < form.length; i++) {
    var elementname = form[i].name;
    var elementvalue = form[i].value;
    if (i === form.length - 1) {
      elements += elementname + '=' + elementvalue;
    } else {
      elements += elementname + '=' + elementvalue + '&';
    }
  }
  return elements;
}

//simple ajax request
function ajax_req(type, url, tosend, callback, button = null, progressHandler, content_type = 'application/x-www-form-urlencoded') {
  if (button !== null) {
    change_button_state(button, 'loading');
  }
  if (tosend !== null) {
    //xhttp request to server
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        //callback function
        if (typeof callback !== 'undefined') {
          callback(xhttp);
        }
      }
    };


    xhttp.upload.addEventListener("progress", pre_progressHandler, false);

    function pre_progressHandler(e) {
      var progress = Math.round((e.loaded / e.total) * 100);
      if (typeof progressHandler !== 'undefined') {
        progressHandler(e, progress);
      }
    }

    if (type == 'GET') {
      if (tosend !== null && tosend !== undefined && tosend !== '') {
        xhttp.open(type, url + '?' + tosend, true);
      } else {
        xhttp.open(type, url, true);
      }
    } else if (type == 'POST') {
      xhttp.open(type, url, true);
    }

    if (content_type !== null) {
      xhttp.setRequestHeader("Content-type", content_type);
    }

    if (type == 'GET') {
      xhttp.send();
    } else if (type == 'POST') {
      xhttp.send(tosend);
    }

  } else {
    if (button !== null) {
      change_button_state(button, 'loading');
    }
  }
}

//set insert parameter
function insertParam(key, value) {
  key = encodeURI(key);
  value = encodeURI(value);
  var kvp = document.location.search.substr(1).split('&');
  var i = kvp.length;
  var x;
  while (i--) {
    x = kvp[i].split('=');

    if (x[0] == key) {
      x[1] = value;
      kvp[i] = x.join('=');
      break;
    }
  }
  if (i < 0) {
    kvp[kvp.length] = [key, value].join('=');
  }
  document.location.search = kvp.join('&');
}

function base64ToBlob(base64, mime) {
  mime = mime || '';
  var sliceSize = 1024;
  var byteChars = window.atob(base64);
  var byteArrays = [];

  for (var offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
    var slice = byteChars.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, {
    type: mime
  });
}

var all_buttons = document.getElementsByClassName('ripple');
for (var i = 0; i < all_buttons.length; i++) {
  all_buttons[i].addEventListener('click', function() {
    var target = this;
    target.setAttribute('ripple', '');
    setTimeout(
      function() {
        target.removeAttribute('ripple');
      }, 200
    );
  });
}

function change_hash(id) {
  window.location.hash = id;
}

function hideOnClickOutside(selector, callback) {
  const outsideClickListener = (event) => {
    $target = $(event.target);
    if (!$target.closest(selector).length && $(selector).is(':visible')) {
      callback();
      removeClickListener();
    }
  }

  const removeClickListener = () => {
    document.removeEventListener('click', outsideClickListener)
  }

  document.addEventListener('click', outsideClickListener)
}

function milToMinutes(millis) {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
}


var notification_counter = 0;

function notification_template(e) {
  notification_counter++;

  var action=``;
  if(e.action_link!==undefined){
    if (e.action_link!='') {
      action=`<a href="${e.action_link}">
                <button type="button" name="button">action</button>
              </a>`
    }
  }else {
    action=``;
  }

  return `<div id="noti${notification_counter}" class="notification card layer1" active="">
            <span onclick="dismiss_notification(${notification_counter})" class="dismiss"></span>
            <h3>${e.msg}</h3>
            ${action}
          </div>`;
}

function show_notification(e) {
  var notifcation_wrapper = document.getElementById('notifcation_wrapper');
  if (notifcation_wrapper == null) {

    var notifcation_wrapper_markup = `<div id="notifcation_wrapper">
                                    </div>`;

    $('body').append(notifcation_wrapper_markup);

    notifcation_wrapper = document.getElementById('notifcation_wrapper');
  }

  notifcation_wrapper.innerHTML = notification_template(e);
}

function dismiss_notification(id) {
  var target_ele=document.getElementById('noti' + id);
  target_ele.setAttribute('hiding','');
  target_ele.removeAttribute('active');

  setTimeout(function() {
    $(target_ele).remove();
  }, 150);

}
