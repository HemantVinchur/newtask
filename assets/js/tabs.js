var tool_tip_container=document.getElementById('tool_tip');
//tabs_control
var tabs_control=document.getElementsByClassName('tabs_control');
for (var i = 0; i < tabs_control.length; i++) {
  var tabs_pill=tabs_control[i].getElementsByTagName('li');
  var total_tabs_pill=tabs_pill.length;
  var width_per_pill=(100/total_tabs_pill);
  for (var tab_i = 0; tab_i < tabs_pill.length; tab_i++) {
    tabs_pill[tab_i].style.width=width_per_pill+'%';
    tabs_pill[tab_i].addEventListener("click", change_tab);

  }
}

mouse_x=0;
mouse_y=0;
offset_x=0;
offset_y=0;

function update_pointer_position(e){
  mouse_x=e.clientX;
  mouse_y=e.clientY;
  var tabs_control_width=tabs_control[0].getBoundingClientRect().left;
  var tabs_control_height=tabs_control[0].getBoundingClientRect().top;
  var value_to_update_x=(mouse_x-tabs_control_width)-(offset_x/2);
  var value_to_update_y=(mouse_y-tabs_control_height)-(offset_y+15);
  tool_tip_container.style.left=value_to_update_x+'px';
  tool_tip_container.style.top=value_to_update_y+'px';
}
function show_tool_tip(e){
  var tool_tip_content=this.innerHTML;
  tool_tip_container.getElementsByTagName('b')[0].innerHTML=tool_tip_content;
  tool_tip_container.setAttribute('data-state','show');
  offset_x=tool_tip_container.offsetWidth;
  offset_y=tool_tip_container.offsetHeight;
}
var tool_tip=document.getElementsByClassName('have_tooltip');
for (var i = 0; i < tool_tip.length; i++) {
  tool_tip[i].addEventListener("mouseover", show_tool_tip);
}
function disable_tooltip(){
  tool_tip_container.setAttribute('data-state','');
}
tabs_control[0].addEventListener("mousemove", update_pointer_position);
tabs_control[0].addEventListener("mouseleave", disable_tooltip);


//tabs change
var tabs_pill=tabs_control[0].getElementsByTagName('li');
var tabs_collection=document.getElementsByClassName('tabs_collection');
var tabs_collection=tabs_collection[0].getElementsByClassName('content_window');

function change_tab(event){
  for (var i = 0; i < tabs_pill.length; i++) {
    tabs_pill[i].removeAttribute('active');
  }

  if (event.target!==undefined) {
    target_ele=event.target;
  }else {
    target_ele=document.getElementById('pr'+event);
  }

  var to_enable=target_ele.getAttribute('data-target');
  target_ele.setAttribute('active','');

  if (tabs_control[0].className=="tabs_control progresstype") {
    target_ele.removeAttribute('completed');
  }

  for (var i = 0; i < tabs_collection.length; i++) {
    tabs_collection[i].removeAttribute('active');
  }
  document.getElementById(to_enable).setAttribute('active','');

  //populate progress pills
  if (tabs_control[0].className=="tabs_control progresstype") {
    populate_progress();
  }
}

//progress type tabs
function populate_progress(){
  //store id(s) in array
  progress_li_arr=[];

  //default current active index
  crr_ind=0;

  //looping through all li(s) and populating id(s) array
  for (var i = 0; i < tabs_pill.length; i++) {
    progress_li_arr.push(tabs_pill[i].id);
  }

  //finding index of current active li
  for (var i = 0; i < tabs_pill.length; i++) {
    if (tabs_pill[i].getAttribute('active')!==null) {
      crr_ind=progress_li_arr.indexOf(tabs_pill[i].id);
    }
  }

  //setting atr "completed" on every li with less index than current active li
  for (var i = 0; i < progress_li_arr.length; i++) {
    if (i<crr_ind) {
      document.getElementById(progress_li_arr[i]).setAttribute("completed","");
    }else {
      document.getElementById(progress_li_arr[i]).removeAttribute("completed");
    }
  }
}

if (tabs_control[0].className=="tabs_control progresstype") {
  populate_progress();
}
