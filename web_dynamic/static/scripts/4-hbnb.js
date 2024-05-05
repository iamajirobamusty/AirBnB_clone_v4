document.ready(function () {
  const amenities = {};
  $('li input[type=checkbox]').change(function () {
    if (this.checked) {
      amenities[this.dataset.name] = this.dataset.id;
    } else {
      delete amenities[this.dataset.name];
    }
    $('.amenities h4').text(Object.keys(amenities).sort().join(', '));
  });

  // get status of API
  $.getJSON('http://0.0.0.0:5001/api/v1/status/', (data) => {
    if (data.status === 'OK') {
      $('div#api_status').addClass('available');
    } else {
      $('div#api_status').removeClass('available');
    }
  });
});

$(document).ready(function () {
  $.post({
    url: 'http://0.0.0.0:5001/api/v1/places_search/',
    contentType: 'application/json',
    data: JSON.stringify({}),
    success: function (data) {
      for (const place of data) {
        const article = $('<article></article>');

        const titleBox = $('<div class="title_box"></div>');
        titleBox.append($('<h2></h2>').text(place.name));
        titleBox.append($('<div class="price_by_night"></div>').text('$' + place.price_by_night));
        article.append(titleBox);

        const information = $('<div class="information"></div>');
        information.append($('<div class="max_guest"></div>').text(place.max_guest + ' Guest' + (place.max_guest !== 1 ? 's' : '')));
        information.append($('<div class="number_rooms"></div>').text(place.number_rooms + ' Bedroom' + (place.number_rooms !== 1 ? 's' : '')));
        information.append($('<div class="number_bathrooms"></div>').text(place.number_bathrooms + ' Bathroom' + (place.number_bathrooms !== 1 ? 's' : '')));
        article.append(information);

        article.append($('<div class="description"></div>').text(place.description));

        $('.places').append(article);
      }
    }
  });
});

$('.filters > button').click(function () {
    $('.places > article').remove();
    $.ajax({
      type: 'POST',
      url: 'http://0.0.0.0:5001/api/v1/places_search',
      data: JSON.stringify({'amenities': Object.keys(checkedAmenities)}),
      dataType: 'json',
      contentType: 'application/json',
      success: function (data) {
        for (let i = 0; i < data.length; i++) {
          let place = data[i];
          $('.places ').append('<article><h2>' + place.name + '</h2><div class="price_by_night"><p>$' + place.price_by_night + '</p></div><div class="information"><div class="max_guest"><div class="guest_image"></div><p>' + place.max_guest + '</p></div><div class="number_rooms"><div class="bed_image"></div><p>' + place.number_rooms + '</p></div><div class="number_bathrooms"><div class="bath_image"></div><p>' + place.number_bathrooms + '</p></div></div><div class="description"><p>' + place.description + '</p></div></article>');
        }
      }
    });
  });
});
