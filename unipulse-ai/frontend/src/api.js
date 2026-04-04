import axios from "axios";

const BASE = import.meta.env.VITE_API_BASE_URL || "/api";

export const fetchIITSentiment = (iitKey, category = "All") =>
  axios.get(`${BASE}/sentiment/${iitKey}`, { params: { category } }).then((r) => r.data);

export const fetchAllIITs = async (category = "All") => {
  const res = await axios.get(`${BASE}/compare`, {
    params: category === "All" ? undefined : { category },
  });

  return res.data;
};