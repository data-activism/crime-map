async function initMap() {
  const response = await fetch("cases.yml");
  if (!response.ok) {
    throw new Error("Network response was not ok " + response.statusText);
  }
  const yamlText = await response.text();

  // Parse the YAML text into a JavaScript object
  const cases = jsyaml.load(yamlText);

  const map = new google.maps.Map(document.getElementById("map"), {
    center: {
      lat: 52.518611,
      lng: 13.408333,
    },
    zoom: 11,
  });
  // loop over cases, add markers to map
  cases.forEach((c) => {
    console.log(c.location.coordinates.lat, c.location.coordinates.lng);

    const date = new Date(c.time);
    const formattedDate = date.toLocaleDateString("de-DE", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    const formattedTime = date.toLocaleTimeString("de-DE", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const infowindow = new google.maps.InfoWindow({
      content:
        `<h4><a href="${c.source}" target="_blank">${c.title}</a></h4>` +
        `<p><em>${c.location.name};  ${formattedDate}, ${formattedTime} Uhr</em></p>` +
        `<p>${c.description}</p>`,
    });

    const marker = new google.maps.Marker({
      position: {
        lat: c.location.coordinates.lat,
        lng: c.location.coordinates.lng,
      },
      map: map,
      title: "Click for more information",
      label: {
        text: c.icon,
        fontSize: "24px",
      },
    });

    marker.addListener("click", () => {
      infowindow.open({
        anchor: marker,
        map,
      });
    });
  });
}
