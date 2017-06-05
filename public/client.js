$(document).ready(function() {

  console.log('jq');

  $('#add').on('click', addList);
  console.log('add clicked');
  $('.display').on('click', '#delete', deleteList);
  $('.display').on('click', '#update', updateRate);
  getList();

}); //end on ready
function getList() {
  $('.display').empty();

  $.ajax({
    type: 'GET',
    url: '/records',
    success: function(response) {
      console.log('back from get call with:', response);
      for (var i = 0; i < response.length; i++) {
        var $div = $('<div>');
        $div.addClass('.record');
        $div.append('<p>' + 'Artist: ' + response[i].artist + '</p> <br>');
        $div.append('<p>' + 'Album: ' + response[i].album + '</p> <br>');
        $div.append('<p>' + 'Rating: ' + response[i].rating + '</p> <br>');
        var $select = ('<select>');
        $select += ('<option value="1">1</option>');
        $select += ('<option value="2">2</option>');
        $select += ('<option value="3">3</option>');
        $select += ('<option value="4">4</option>');
        $select += ('<option value="5">5</option>');
        $select += ('</select>');
        $div.append($select);
        $div.append('<button id="update">Update</button');
        $div.append('<button id="delete">Delete</button');
        $div.data('id', response[i].id);
        $('.display').append($div);
      } //end for loop
    } //end success
  }); //end ajax
} //end getList

function addList() {
  var objectToSend = {
    artist: $('#artist').val(),
    album: $('#album').val(),
    rating: $('.rating').val()
  }; //end objectToSend
  $('#artist').val('');
  $('#album').val('');
  $.ajax({
    type: 'POST',
    url: '/records',
    data: objectToSend,
    success: getList
  }); //end ajax
} //end addList


function deleteList() {
  var id = $(this).parent().data('id');

  $.ajax({
    type: 'DELETE',
    url: '/records/' + id,
    success: getList
  }); // end delete ajax
} //end deleteList

function updateRate() {
  var id = $(this).parent().data('id');
  var rateToSend = {
    rating: $(this).siblings('select').val()
  }; // end object
  $.ajax({
    type: 'PUT',
    url: '/records/' + id,
    data: rateToSend,
    success: getList
  }); // end ajax
} //end function
