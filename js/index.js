function initAutocomplete() {
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -33.8688, lng: 151.2195},
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  // Create the search box and link it to the UI element.
  // // get the element
  var input = document.getElementById('pac-input');
  //configure the element as a widged of google maps
  var searchBox = new google.maps.places.SearchBox(input);
  //get display control on top of all map
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

  var markers = [];
  // [START region_getplaces]
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.
  searchBox.addListener('places_changed', function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.setMap(null);
    });
    markers = [];

    // For each place, get the icon, name and location.
    var bounds = new google.maps.LatLngBounds();
    places.forEach(function(place) {
      var icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      // Create a marker for each place.
      markers.push(new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }));

      if (place.geometry.viewport) {
        // Only geocodes have viewport.
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    map.fitBounds(bounds);
  });
  // [END region_getplaces]
  //
}


(function( window, document, undefined )
{
    window.addEventListener( 'load', function()
  {
      init();
  },
    false );

    function init()
    {
      Ext.onReady(function ()
      {
             console.log("- Libreria ExtJS cargada. Ahora ya puedo utilizar ExtJS. .....");

             // --------------------------------------------------------------
             // CONFIGURACIONES GLOBALES
             // ---------------------------------------------------------------
             Ext.QuickTips.init();
             Ext.Ajax.defaultHeaders = { 'Content-Type': 'application/json;charset=utf-8;' };
             // ---------------------------------------------------------------

             PageLoaded();
      });
    }

    function PageLoaded()
    {
      var btnSearch = document.querySelector('#pac-input');

      btnSearch.addEventListener( 'keypress', function( e )
      {
        var dataNode = document.querySelectorAll( '.pac-item' ),
            dataMatched = _.map( dataNode, function( data )
          {
              return {
                'find-path' : data.childNodes[1].textContent + ' ' + data.childNodes[2].textContent
              };
          });
          _.forEach( dataMatched, function( data )
        {
          console.log( data["find-path"] );
        });
        window.dataMatched = dataMatched;
      },
        false );


      Ext.MessageBox.alert('Aviso', 'Libreria ExtJS cargada satisfactoriamente.', function (btn)
      {
          //alert('Boton presionado: ' + btn);
      });
    }
})
( window, document );
