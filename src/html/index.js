function initMap() {
  const lat = 52.56720833311814;
  const lng = 13.346614128836125;
  const map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: lat, lng: lng },
    zoom: 15,
  });

  const contentString =
    '<div id="content">' +
    '<h1 id="firstHeading" class="firstHeading" style="font-weight: bold;">Location Title</h1>' +
    '<div id="bodyContent">' +
    '<p><a href="https://example.com" target="_blank">Link to more information</a></p>' +
    "</div>" +
    "</div>";

  const infowindow = new google.maps.InfoWindow({
    content: contentString,
    ariaLabel: "Location Information",
  });

  const marker = new google.maps.Marker({
    position: { lat: lat, lng: lng },
    map: map,
    title: "Click for more information",
    label: {
      text: "🚘",
      fontSize: "24px",
    },
  });

  marker.addListener("click", () => {
    infowindow.open({
      anchor: marker,
      map,
    });
  });
}
