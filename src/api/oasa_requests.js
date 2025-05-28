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
    const lineData = response.data.filter(itm => itm.LineID === code );
    // console.log(lineData);
    return lineData;
  }

  return response;
};

export { getLineByCode };
