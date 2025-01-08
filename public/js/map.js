let map_token = maptoken;
mapboxgl.accessToken = map_token;
console.log("Map Token:", map_token);
console.log("List object:", list);

const coordinates = list.geometry.coordinates;

const map = new mapboxgl.Map({
    container: 'map',
    center: coordinates,
    zoom:10
});

const marker = new mapboxgl.Marker({
    color: "red",
    draggable: true
})
    .setLngLat(coordinates)
    .setPopup(new mapboxgl.Popup().setHTML(`<h1>${list.title}</h1>`))
    .addTo(map);
