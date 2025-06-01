import {
  getLineByCode,
  getLineLocations,
  getLineRoutes,
} from "./api/oasa_requests";
import { useState } from "react";

import mapboxgl from "mapbox-gl";

import { useQuery } from "@tanstack/react-query";

import latinToGreek from "./utils/lettersToGreek";

import bbox from "@turf/bbox";

import axios from "axios";
import CircleIcon from "@mui/icons-material/Circle";

const Overlay = ({ mapRef }) => {
  const [lineNum, setLineNum] = useState("");

  const [lineInfo, setLineInfo] = useState({});
  const [lineData, setLineData] = useState("");
  const [lines, setLines] = useState([]);

  const [routeInfo, setRouteInfo] = useState({});
  const [routeData, setRouteData] = useState("");
  const [routes, setRoutes] = useState([]);
  const [loadingRoutes, setLoadingRoutes] = useState(false);

  const [locations, setLocations] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [stopMarkers, setStopMarkers] = useState([]);

  const [error, setError] = useState("");

  const {
    status,
    data,
    error: _error,
    isLoading,
  } = useQuery({
    queryKey: ["busData"],
    queryFn: getLineByCode,
  });

  const getLines = async (e = null) => {
    if (e)
      e.preventDefault();
    console.log(latinToGreek(lineNum));

    if (lineNum) {
      // const res = await getLineByCode(lineNum);
      const res = data.filter((itm) => itm.LineID === latinToGreek(lineNum));

      if (res && res.length) {
        setLines(res);
        setLineData(res[0]);
        setLineInfo(res[0].LineDescr);

        getRoutes(res[0].LineCode);
      } else {
        setError("This route does not exist.");
      }
    }
  };

  const getLocations = async (e) => {
    e.preventDefault();

    // console.log(routes);
    // console.log(routeData);

    const loc = await getLineLocations(routeData.RouteCode);
    setLocations(loc.data);

    for (let i = 0; i < markers.length; i++) {
      markers[i].remove();
    }

    let newMarkers = [];
    let polygon = [];

    if (loc?.data && loc.data.length) {
      loc.data.map((location) => {
        const marker = new mapboxgl.Marker({ color: "#ff0000" })
          .setLngLat([location.CS_LNG, location.CS_LAT])
          .addTo(mapRef.current);

        polygon.push([Number(location.CS_LNG), Number(location.CS_LAT)]);
        newMarkers.push(marker);
      });
    } else {
      setError("No active buses at the time.");
    }
    setMarkers(newMarkers);
    goToCoords([polygon]);
  };

  const getRoutes = async (alternativeVal = null) => {
    setLoadingRoutes(true);
    // e.preventDefault();

    let _routes;
    if (!lineData?.LineCode || alternativeVal)
      _routes = await getLineRoutes(alternativeVal);
    else _routes = await getLineRoutes(lineData?.LineCode);

    console.log(_routes);
    setRoutes(_routes.data);
    setRouteInfo(_routes.data[0].RouteDescr);
    setRouteData(_routes.data[0]);

    setLoadingRoutes(false);
  };

  const getStops = async () => {
    for (let i = 0; i < stopMarkers.length; i++) stopMarkers[i].remove();

    let resp;
    if (routeData && routeData.RouteCode)
      resp = await axios.post(
        `http://telematics.oasa.gr/api/?act=webGetStops&p1=${routeData?.RouteCode}`
      );

    let newMarkers = [];
    let polygon = [];

    resp.data.map((stop) => {
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setText(`${stop.StopDescr}`)
        .setHTML(`<div style="color:red; font-weight:500">${stop.StopDescr}</div>`)

      const marker = new mapboxgl.Marker()
        .setLngLat([stop.StopLng, stop.StopLat])
        .setPopup(popup)
        .addTo(mapRef.current);

      console.log(stop)
      polygon.push([Number(stop.StopLng), Number(stop.StopLat)]);

      newMarkers.push(marker);
    });
    goToCoords([polygon]);
    setStopMarkers(newMarkers);
  };

  const getlineXY = async () => {
    let resp = {};
    resp.data = [
      { routed_x: "23.74047", routed_y: "38.03563", routed_order: "1" },
      { routed_x: "23.73989", routed_y: "38.03637", routed_order: "2" },
      { routed_x: "23.73934", routed_y: "38.03656", routed_order: "3" },
      { routed_x: "23.73894", routed_y: "38.03659", routed_order: "4" },
      { routed_x: "23.73873", routed_y: "38.03596", routed_order: "5" },
      { routed_x: "23.73694", routed_y: "38.03202", routed_order: "6" },
      { routed_x: "23.73519", routed_y: "38.03001", routed_order: "7" },
      { routed_x: "23.73456", routed_y: "38.02946", routed_order: "8" },
      { routed_x: "23.7344", routed_y: "38.02924", routed_order: "9" },
      { routed_x: "23.73321", routed_y: "38.02813", routed_order: "10" },
      { routed_x: "23.73282", routed_y: "38.02779", routed_order: "11" },
      { routed_x: "23.73264", routed_y: "38.02763", routed_order: "12" },
      { routed_x: "23.73251", routed_y: "38.02731", routed_order: "13" },
      { routed_x: "23.7326", routed_y: "38.02715", routed_order: "14" },
      { routed_x: "23.73299", routed_y: "38.02643", routed_order: "15" },
      { routed_x: "23.73285", routed_y: "38.02627", routed_order: "16" },
      { routed_x: "23.73229", routed_y: "38.0257", routed_order: "17" },
      { routed_x: "23.73218", routed_y: "38.02551", routed_order: "18" },
      { routed_x: "23.73222", routed_y: "38.02535", routed_order: "19" },
      { routed_x: "23.73352", routed_y: "38.02443", routed_order: "20" },
      { routed_x: "23.73404", routed_y: "38.02423", routed_order: "21" },
      { routed_x: "23.73447", routed_y: "38.02403", routed_order: "22" },
      { routed_x: "23.73519", routed_y: "38.02375", routed_order: "23" },
      { routed_x: "23.73551", routed_y: "38.02362", routed_order: "24" },
      { routed_x: "23.73568", routed_y: "38.02349", routed_order: "25" },
      { routed_x: "23.73597", routed_y: "38.02334", routed_order: "26" },
      { routed_x: "23.73597", routed_y: "38.02274", routed_order: "27" },
      { routed_x: "23.73557", routed_y: "38.01994", routed_order: "28" },
      { routed_x: "23.73547", routed_y: "38.01833", routed_order: "29" },
      { routed_x: "23.73542", routed_y: "38.01818", routed_order: "30" },
      { routed_x: "23.73536", routed_y: "38.01522", routed_order: "31" },
      { routed_x: "23.73531", routed_y: "38.01505", routed_order: "32" },
      { routed_x: "23.73529", routed_y: "38.01317", routed_order: "33" },
      { routed_x: "23.73522", routed_y: "38.01263", routed_order: "34" },
      { routed_x: "23.73512", routed_y: "38.01011", routed_order: "35" },
      { routed_x: "23.73509", routed_y: "38.00996", routed_order: "36" },
      { routed_x: "23.73509", routed_y: "38.00732", routed_order: "37" },
      { routed_x: "23.73511", routed_y: "38.00706", routed_order: "38" },
      { routed_x: "23.7351", routed_y: "38.00663", routed_order: "39" },
      { routed_x: "23.735", routed_y: "38.00624", routed_order: "40" },
      { routed_x: "23.73486", routed_y: "38.00557", routed_order: "41" },
      { routed_x: "23.73457", routed_y: "38.00423", routed_order: "42" },
      { routed_x: "23.73433", routed_y: "38.00347", routed_order: "43" },
      { routed_x: "23.73424", routed_y: "38.00319", routed_order: "44" },
      { routed_x: "23.73413", routed_y: "38.0029", routed_order: "45" },
      { routed_x: "23.73398", routed_y: "38.00249", routed_order: "46" },
      { routed_x: "23.73388", routed_y: "38.00211", routed_order: "47" },
      { routed_x: "23.73382", routed_y: "38.00186", routed_order: "48" },
      { routed_x: "23.73362", routed_y: "38.00114", routed_order: "49" },
      { routed_x: "23.73335", routed_y: "38.00011", routed_order: "50" },
      { routed_x: "23.73326", routed_y: "37.99996", routed_order: "51" },
      { routed_x: "23.73298", routed_y: "37.99893", routed_order: "52" },
      { routed_x: "23.73269", routed_y: "37.99778", routed_order: "53" },
      { routed_x: "23.73256", routed_y: "37.99724", routed_order: "54" },
      { routed_x: "23.73244", routed_y: "37.99676", routed_order: "55" },
      { routed_x: "23.73228", routed_y: "37.99614", routed_order: "56" },
      { routed_x: "23.73218", routed_y: "37.99564", routed_order: "57" },
      { routed_x: "23.73196", routed_y: "37.99467", routed_order: "58" },
      { routed_x: "23.73155", routed_y: "37.9931", routed_order: "59" },
      { routed_x: "23.73139", routed_y: "37.99249", routed_order: "60" },
      { routed_x: "23.73125", routed_y: "37.9918", routed_order: "61" },
      { routed_x: "23.73111", routed_y: "37.99131", routed_order: "62" },
      { routed_x: "23.73077", routed_y: "37.98999", routed_order: "63" },
      { routed_x: "23.73053", routed_y: "37.98888", routed_order: "64" },
      { routed_x: "23.73043", routed_y: "37.98846", routed_order: "65" },
      { routed_x: "23.73019", routed_y: "37.98755", routed_order: "66" },
      { routed_x: "23.73003", routed_y: "37.98674", routed_order: "67" },
      { routed_x: "23.72985", routed_y: "37.98597", routed_order: "68" },
      { routed_x: "23.72996", routed_y: "37.98595", routed_order: "69" },
      { routed_x: "23.73078", routed_y: "37.98578", routed_order: "70" },
      { routed_x: "23.73094", routed_y: "37.98563", routed_order: "71" },
      { routed_x: "23.73108", routed_y: "37.98547", routed_order: "72" },
      { routed_x: "23.73123", routed_y: "37.98533", routed_order: "73" },
      { routed_x: "23.73142", routed_y: "37.98511", routed_order: "74" },
      { routed_x: "23.73364", routed_y: "37.98242", routed_order: "75" },
      { routed_x: "23.73407", routed_y: "37.98174", routed_order: "76" },
      { routed_x: "23.73417", routed_y: "37.98165", routed_order: "77" },
      { routed_x: "23.73472", routed_y: "37.98102", routed_order: "78" },
      { routed_x: "23.73517", routed_y: "37.98039", routed_order: "79" },
      { routed_x: "23.73569", routed_y: "37.97979", routed_order: "80" },
      { routed_x: "23.73638", routed_y: "37.97896", routed_order: "81" },
      { routed_x: "23.73689", routed_y: "37.97833", routed_order: "82" },
      { routed_x: "23.73705", routed_y: "37.97813", routed_order: "83" },
      { routed_x: "23.7376", routed_y: "37.97753", routed_order: "84" },
      { routed_x: "23.73779", routed_y: "37.97732", routed_order: "85" },
      { routed_x: "23.73777", routed_y: "37.97658", routed_order: "86" },
      { routed_x: "23.73766", routed_y: "37.97597", routed_order: "87" },
      { routed_x: "23.74243", routed_y: "37.97533", routed_order: "88" },
      { routed_x: "23.74334", routed_y: "37.97533", routed_order: "89" },
      { routed_x: "23.74435", routed_y: "37.97555", routed_order: "90" },
      { routed_x: "23.74456", routed_y: "37.97563", routed_order: "91" },
      { routed_x: "23.74846", routed_y: "37.97646", routed_order: "92" },
      { routed_x: "23.74919", routed_y: "37.97631", routed_order: "93" },
      { routed_x: "23.74943", routed_y: "37.97629", routed_order: "94" },
      { routed_x: "23.74966", routed_y: "37.97638", routed_order: "95" },
      { routed_x: "23.75178", routed_y: "37.97783", routed_order: "96" },
      { routed_x: "23.75265", routed_y: "37.97855", routed_order: "97" },
      { routed_x: "23.75276", routed_y: "37.97869", routed_order: "98" },
      { routed_x: "23.75369", routed_y: "37.97951", routed_order: "99" },
      { routed_x: "23.75442", routed_y: "37.9802", routed_order: "100" },
      { routed_x: "23.75647", routed_y: "37.98228", routed_order: "101" },
      { routed_x: "23.75871", routed_y: "37.9836", routed_order: "102" },
      { routed_x: "23.76035", routed_y: "37.9851", routed_order: "103" },
      { routed_x: "23.76109", routed_y: "37.98592", routed_order: "104" },
      { routed_x: "23.76149", routed_y: "37.98654", routed_order: "105" },
      { routed_x: "23.76202", routed_y: "37.98714", routed_order: "106" },
      { routed_x: "23.76266", routed_y: "37.98766", routed_order: "107" },
      { routed_x: "23.76296", routed_y: "37.98786", routed_order: "108" },
      { routed_x: "23.76361", routed_y: "37.98838", routed_order: "109" },
      { routed_x: "23.76479", routed_y: "37.98964", routed_order: "110" },
      { routed_x: "23.76579", routed_y: "37.99095", routed_order: "111" },
      { routed_x: "23.7666", routed_y: "37.99236", routed_order: "112" },
      { routed_x: "23.76677", routed_y: "37.99257", routed_order: "113" },
      { routed_x: "23.76927", routed_y: "37.99773", routed_order: "114" },
      { routed_x: "23.77001", routed_y: "37.99868", routed_order: "115" },
      { routed_x: "23.77173", routed_y: "38.00006", routed_order: "116" },
      { routed_x: "23.77273", routed_y: "38.00027", routed_order: "117" },
      { routed_x: "23.7755", routed_y: "38.00079", routed_order: "118" },
      { routed_x: "23.77567", routed_y: "38.00084", routed_order: "119" },
    ];

    resp.data.map((stop) => {
      const marker = new mapboxgl.Marker()
        .setLngLat([stop.routed_x, stop.routed_y])
        .addTo(mapRef.current);
      // newMarkers.push(marker);
    });
  };

  const clearMap = () => {
    for (let i = 0; i < stopMarkers.length; i++) stopMarkers[i].remove();
    for (let i = 0; i < markers.length; i++) markers[i].remove();
  }


  const goToCoords = (coords) => {
    const polygon = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: coords
      }
    };
    console.log(polygon)
    console.log(bbox(polygon))
    mapRef.current.fitBounds(bbox(polygon), {
      padding: 100
    });
  };

  if (isLoading) return "Loading";

  return (
    <div>
      <div
        style={{
          position: "absolute",
          width: "280px",
          height: "400px",
          background: "#ffffff",
          borderRadius: "10px",
          left: 10,
          bottom: 40,
          opacity: 0.85,
          padding: "30px 15px"
        }}
      >
        <div style={{ marginTop: '-15px', marginBottom: '-5px', textAlign: 'center' }}>Options</div>
        <hr />
        <form onSubmit={getLines}>
          <div className="custom-input">
            <input
              value={lineNum}
              onChange={(e) => {
                setRouteInfo("");
                setRouteData({});
                setRoutes([]);
                setLineInfo("");
                setLineData({});
                setLines([]);
                setError("");
                setLineNum(e.target.value);
              }}
              label="Bus number"
              style={{ border: error ? '1px solid rgb(255, 83, 83)' : '' }}
            />
          </div>
          <button className="button-9" type="submit">Get lines</button>
          <br />
          Select line
          {lines && lines.length ? (
            <div class="custom-select">
              <select
                value={lineInfo}
                onChange={(e) => {
                  setLineInfo(e.target.value);
                  let newLine = lines.filter(
                    (elem) => elem.LineDescr === e.target.value
                  )[0];
                  setLineData(newLine);
                  setRouteInfo("");
                  setRouteData({});
                  setRoutes([]);
                  setError("");

                  getRoutes(newLine.LineCode);
                }}
                style={{ width: "100%" }}
              >
                {lines.map((itm) => {
                  return (
                    <option key={itm.LineDescr} value={itm.LineDescr}>
                      {itm.LineDescr}
                    </option>
                  );
                })}
              </select>
            </div>
          ) : null}
        </form>
        {/* <div>LineCode: {lineData?.LineCode}</div> */}
        {/* <button className="button-9" onClick={getRoutes}>Get routes</button> */}
        Select direction
        {loadingRoutes ? (
          <img width={100} height={100} src="src/assets/ripples.svg" style={{ left: '50%', width: '100%' }} />
        ) : routes && routes.length ? (
          <div class="custom-select">
            <select
              value={routeInfo}
              onChange={(e) => {
                setError("");
                setRouteInfo(e.target.value);
                setRouteData(
                  routes.filter((elem) => elem.RouteDescr === e.target.value)[0]
                );
              }}
              style={{ width: "100%" }}
            >
              {routes.map((itm) => {
                return (
                  <option key={itm.RouteDescr} value={itm.RouteDescr}>
                    {itm.RouteDescr}
                  </option>
                );
              })}
            </select>
          </div>
        ) : null}
        {!loadingRoutes && (
          <>
            <button className="button-9" onClick={getLocations}>Get locations</button>
            <button className="button-9" onClick={getStops}>Get stops</button>
          </>
        )}
        {error && <div>{error}</div>}
      </div>
      <button className="button-9" style={{ position: 'absolute', left: '30px', top: '30px', width: '50px', height: '50px', zIndex: 10, borderRadius: '100px', textAlign:'center' }} onClick={clearMap}>C</button>
    </div>
  );
};

export default Overlay;
