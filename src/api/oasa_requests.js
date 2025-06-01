import axios from "axios";

const getLineByCode = async () => {
  console.log('getting all lines: ')
  let response;
  try {
    response = await axios.get(
      "/api/?act=webGetLines"
    );
  } catch (err) {
    console.log(err);
  }

  if (response?.data) {
    return response.data;
  }

  return response;
};

const getLineLocations = async (routeCode) => {
  console.log('getting locations with  route code: ', routeCode)
  let response;
  try {
    response = await axios.post(`/api/?act=getBusLocation&p1=${routeCode}`)
  } catch (err) {
    console.log(err);
  }

  // console.log(response)
  return response;

  // if (response?.data) {
  //   const lineData = response.data.filter(itm => itm.LineID === code );
  //   // console.log(lineData);
  //   return lineData;
  // }
}

const getLineRoutes = async (lineCode) => {
  console.log('getting routes of line with code: ', lineCode)
  let response;
  try {
    response = await axios.post(`/api/?act=webGetRoutes&p1=${lineCode}`)
  } catch (err) {
    console.log(err);
  }

  // console.log(response)
  return response;
}

export { getLineByCode, getLineLocations, getLineRoutes };
