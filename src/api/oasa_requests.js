import axios from "axios";

const getLineByCode = async (code) => {
  let response;
  try {
    response = await axios.get(
      "http://telematics.oasa.gr/api/?act=webGetLines"
    );
  } catch (err) {
    console.log(err);
  }

  if (response?.data) {
    console.log(response.data)
    const lineData = response.data.filter(itm => itm.LineID === "608" );
    console.log(lineData);
  }

  return response;
};

export { getLineByCode };
