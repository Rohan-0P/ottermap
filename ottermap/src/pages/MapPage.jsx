import React, { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { Draw, Modify, Snap } from "ol/interaction";
import { Vector as VectorLayer } from "ol/layer";
import { Vector as VectorSource } from "ol/source";
import { fromLonLat } from "ol/proj";

function MapPage() {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [draw, setDraw] = useState(null);

  useEffect(() => {
    const vectorSource = new VectorSource();
    const vectorLayer = new VectorLayer({ source: vectorSource });

    const mapInstance = new Map({
      target: mapRef.current,
      layers: [
        new TileLayer({ source: new OSM() }),
        vectorLayer
      ],
      view: new View({
        center: fromLonLat([77.1025, 28.7041]), // Default: Delhi
        zoom: 10
      })
    });

    setMap(mapInstance);

    return () => mapInstance.setTarget(null);
  }, []);

  const addDrawInteraction = (type) => {
    if (draw) map.removeInteraction(draw);

    const newDraw = new Draw({
      source: map.getLayers().getArray()[1].getSource(),
      type: type,
    });

    map.addInteraction(newDraw);
    setDraw(newDraw);
  };

  const handleDelete = () => {
    const source = map.getLayers().getArray()[1].getSource();
    source.clear();
  };

  const userData = JSON.parse(localStorage.getItem("userData"));

  return (
    <div>
      <header style={{ textAlign: "center", padding: "10px", fontSize: "24px" }}>
        {userData?.name || "Map Page"}
      </header>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div ref={mapRef} style={{ width: "80vw", height: "60vh", marginBottom: "20px" }}></div>
        <button onClick={() => addDrawInteraction("Polygon")}>Draw Polygon</button>
        <button onClick={handleDelete}>Delete Polygons</button>
      </div>
    </div>
  );
}

export default MapPage;
