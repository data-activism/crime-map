let markers = [];

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
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.BOTTOM_LEFT,
    },
  });

  // Default range.
  const range = {
    from: new Date(new Date().setDate(new Date().getDate() - 7)),
    to: new Date(new Date().setDate(new Date().getDate() + 1)),
  };

  const dateRangeDiv = document.createElement("div");
  dateRangeDiv.innerHTML = `
    <input type="text" id="date-range" placeholder="Zeitraum auswählen" class="form-control">
  `;
  // Initialize Flatpickr for date range selection
  flatpickr(dateRangeDiv, {
    mode: "range",
    locale: "German",
    dateFormat: "Y-m-d",
    onChange: function (selectedDates, dateStr, instance) {
      // Handle date range selection
      if (selectedDates.length === 2) {
        range.from = selectedDates[0];
        range.to = selectedDates[1];
        // set selectedDates[1] +1 day
        range.to.setDate(range.to.getDate() + 1);
        updateMarkers(map, cases, range);
      }
    },
  });
  // Add the date range picker to the map as a control
  map.controls[google.maps.ControlPosition.TOP_LEFT].push(dateRangeDiv);
  updateMarkers(map, cases, range);
}

function updateMarkers(map, cases, range) {
  // create new list filteredCases by looping through cases and filtering by date
  const filteredCases = cases.filter((c) => {
    const date = new Date(c.time);
    return date >= range.from && date <= range.to;
  });
  deleteAllMarkers();
  setMarkers(map, filteredCases);
}

function setMarkers(map, cases) {
  cases.forEach((c) => {
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

    markers.push(marker);
  });
}

function deleteAllMarkers() {
  for (let i = 0; i < markers.length; i++) {
    markers[i].setMap(null); // Remove marker from the map
  }
  markers = []; // Clear the array of markers
}
