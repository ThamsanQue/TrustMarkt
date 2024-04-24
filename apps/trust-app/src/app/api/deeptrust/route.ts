import { env } from "@/env";
import axios from "axios";

export default async function fetchDataFromAPI() {
  try {
    const response = await axios.get("http://localhost:5000/recognize");
    // Assuming the API returns JSON data
    return response.data;
  } catch (error) {
    // Handle errors, e.g., network errors, API errors
    console.error("Error fetching data from external API:", error);
    throw error;
  }
}
