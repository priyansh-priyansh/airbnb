mapboxgl.accessToken = mapToken;

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Default coordinates for Delhi
    const defaultCoords = [77.2088, 28.6139];

    // Check if coordinates exist and are valid
    const validCoords = coordinates && Array.isArray(coordinates) && coordinates.length === 2 
        ? coordinates 
        : defaultCoords;

    

    // Initialize map
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v12',
        center: validCoords,
        zoom: 9
    });

    // Wait for map to load before adding marker
    map.on('load', () => {
        // Add marker
        const marker = new mapboxgl.Marker({ color: '#FF0000' })
            .setLngLat(validCoords)
            .setPopup(
                new mapboxgl.Popup({offset: 25}).setHTML(
                    `<h4>${listing.title}</h4><p>Exact Location provided after booking</p>`
                )
            )
            .addTo(map);

        // Add navigation controls
        map.addControl(new mapboxgl.NavigationControl());
    });
});