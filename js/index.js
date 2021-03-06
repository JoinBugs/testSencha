window.markers = [];

function initAutocomplete() {
  var map = window.map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: -33.8688, lng: 151.2195},
    zoom: 13,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });

  // Create the search box and link it to the UI element.
  // // get the element
  var input = document.getElementById('pac-input');
  //configure the element as a widged of google maps
  var searchBox = new google.maps.places.SearchBox(input);
  window.searchBox = searchBox;
  //get display control on top of all map
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

  // Bias the SearchBox results towards current map's viewport.
  map.addListener('bounds_changed', function() {
    searchBox.setBounds(map.getBounds());
  });

 // var markers = [];
  // [START region_getplaces]
  // Listen for the event fired when the user selects a prediction and retrieve
  // more details for that place.


  searchBox.addListener('places_changed', function()
  {

    var places = searchBox.getPlaces(),
        infowindow = new google.maps.InfoWindow(),
        service = new google.maps.places.PlacesService(map);

    //userHistory.removeAll();
    window.userHistory.add({ 'history' : places[ 0 ].formatted_address });

    if (places.length == 0) {
      return;
    }

    // Clear out the old markers.
    markers.forEach(function(marker) {
      marker.marker.setMap(null);
    });
    //markers = [];

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
      markers.push({
        'marker' : new google.maps.Marker({
        map: map,
        icon: icon,
        title: place.name,
        position: place.geometry.location
      }),
        'place' : place
      });

      service.getDetails({ 'reference' : places[0].reference }, function( details, status )
      {
          if (status == google.maps.places.PlacesServiceStatus.OK)
          {
              google.maps.event.addListener(markers[ markers.length - 1 ].marker, 'click', function() {
                infowindow.setContent( '<div class="detail-marker">'
                                      + details.name + "<br />"
                                      + (details.formatted_address || 'sin direccion' )               +"<br />"
                                      + (details.website || 'sin sitio web' )                         + "<br />"
                                      + (details.rating || 'sin rating' )                             + "<br />"
                                      + (details.formatted_phone_number || 'sin numero de telefono')  + "<br />"
                                      + (details.photos[1].html_attributions)                         + "<br />"
                                      + (details.photos[2].html_attributions)                         + "<br />"
                                      + (details.photos[3].html_attributions)
                                      + '</div>'
                                    );
                infowindow.open(map, this);
              });
          }
      });


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

    function doEmptyNode( node )
    {
      var nodes = Array.prototype.slice.call( node.childNodes );
      nodes.forEach( function( node ) { node.remove(); } );
    }

    function PageLoaded()
    {
      var btnSearch = document.querySelector('#pac-input');

      Ext.define('usersuggest', {
          extend: 'Ext.data.Model',
          fields: [ 'path' ]
      });

      Ext.define('UserHistory', {
          extend: 'Ext.data.Model',
          fields: [ 'history' ]
      });

      var userStore = Ext.create('Ext.data.Store', {
          model: 'usersuggest',
          data: []
      }),
          userHistory = Ext.create('Ext.data.Store', {
          model: 'UserHistory',
          data: []
      });

      window.userHistory = userHistory;

      Ext.create('Ext.grid.Panel', {
          renderTo: document.querySelector('#pnl-grid'),
          store: userStore,
          width: 400,
          height: 200,
          title: 'Sugerencias de busqueda',
          columns: [
              {
                  text: 'Rutas',
                  width: 1000,
                  sortable: false,
                  hideable: false,
                  dataIndex: 'path'
              }
          ]
      });

      Ext.create('Ext.grid.Panel', {
          renderTo: document.querySelector('#pnl-grid-history'),
          store: userHistory,
          width: 400,
          height: 200,
          title: 'Historial de busqueda',
          columns: [
              {
                  text: 'Historial',
                  width: 1000,
                  sortable: false,
                  hideable: false,
                  dataIndex: 'history'
              }
          ],
          listeners: {
              itemclick: function(dv, record, item, index, e)
              {
                for( var i = 0, l = window.markers.length; i < l; i++ )
                  if( i !== index )
                    window.markers[ i ].marker.setMap( null );

                var bounds = new google.maps.LatLngBounds();

                  if (markers[ index ].place.geometry.viewport)
                    bounds.union(markers[ index ].place.geometry.viewport);
                  else
                    bounds.extend(markers[ index ].place.geometry.location);
                  markers[ index ].marker.setMap( window.map );
                  map.fitBounds(bounds);
              }
          }
      });

      btnSearch.addEventListener( 'keypress', function( e )
      {
        var dataNode = document.querySelectorAll( '.pac-item' ),
            dataMatched = _.map( dataNode, function( data )
          {
              return {
                'path' : data.childNodes[1].textContent + ' ' + data.childNodes[2].textContent
              };
          });

          userStore.removeAll();
          userStore.add( dataMatched );
        _.forEach( dataMatched, function( data )
        {
          console.log( data["path"] );
        });
        window.dataMatched = dataMatched;
      },
        false );


      /*Ext.MessageBox.alert('Aviso', 'Libreria ExtJS cargada satisfactoriamente.', function (btn)
      {
          //alert('Boton presionado: ' + btn);
      });*/
    }
})
( window, document );
