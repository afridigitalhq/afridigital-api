import axios from "axios";
import { footballConfig } from "../config/football.config.js";

const client = axios.create({
  baseURL: footballConfig.baseURL,
  headers:{
    "x-apisports-key": process.env.API_FOOTBALL_KEY
  }
});

export async function footballRequest(endpoint, params={}){
  const response = await client.get(endpoint,{params});
  return response.data;
}
