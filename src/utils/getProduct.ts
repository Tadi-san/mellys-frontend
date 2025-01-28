import axios from "axios";

export const getProductsList = async (name: string | null) => {
  const options = {
    method: "GET",
    url: "https://aliexpress-datahub.p.rapidapi.com/item_search",
    params: {
      q: name,
      page: "1",
      sort: "default",
      locale: "en_US",
      region: "US",
      currency: "USD",
    },
    headers: {
      // "x-rapidapi-key": "678a154090msh3f619b749538c49p173568jsn746fce7ca737",
      "x-rapidapi-host": "aliexpress-datahub.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const getProductInfo = async (id: Number | undefined) => {
  const options = {
    method: "GET",
    url: "https://aliexpress-datahub.p.rapidapi.com/item_detail",
    params: {
      itemId: id,
      currency: "USD",
      region: "US",
      locale: "en_US",
    },
    headers: {
      // "x-rapidapi-key": "678a154090msh3f619b749538c49p173568jsn746fce7ca737",
      "x-rapidapi-host": "aliexpress-datahub.p.rapidapi.com",
    },
  };

  try {
    console.log("ID IS : ", id);

    const response = await axios.request(options);
    return response;
  } catch (error) {
    console.error(error);
  }
};

export const getHomepageProducts = async () => {
  const options = {
    method: "GET",
    url: "https://ali-express-clone.onrender.com/api/home/moretolove",
  };

  try {
    const response = await axios.request(options);
    console.log("RESONSE : ", response);

    return response;
  } catch (error) {
    console.error(error);
  }
};
