import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

import 'mapbox-gl/dist/mapbox-gl.css';

const Map = () => {
  const mapContainerRef = useRef();
  const mapRef = useRef();

  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_APP_MAPBOX_ACCESS_TOKEN

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      center: [23.7266308248318, 37.977487240739535], // starting position [lng, lat]
      zoom: 11 // starting zoom
    });

    mapRef.current.on('click', (e) => {
      console.log(e)
    });

  });

  return (
    <div
      style={{ width:'100vw', height:'100vh' }}
      ref={mapContainerRef}
      className="map-container"
    />
  );
};

export default Map;