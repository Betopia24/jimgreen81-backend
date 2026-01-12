import axios from "axios";
import config from ".";

export const aiClient = axios.create({
  baseURL: config.AI_BASE_API,
  headers: {
    "Content-Type": "application/json",
  },
});
