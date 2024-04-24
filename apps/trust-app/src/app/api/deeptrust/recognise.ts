import { env } from "@/env";
import axios from "axios";

export default async function fetchDeeptrust() {
  // Define the URL of the external API
  const apiUrl = `http://localhost:5000/recognize`;
  const imagePath_1 =
    "/home/notSteve/dev/turbo/TrustMarkt/apps/deep-trust-api/api/images/image4.jpeg";

  const imagePath_2 =
    "/home/notSteve/dev/turbo/TrustMarkt/apps/deep-trust-api/api/images/image5.jpeg";
  const dbPath =
    "/home/notSteve/dev/turbo/TrustMarkt/apps/deep-trust-api/api/images";
  try {
    // Make a POST request to the external API using axios
    const response = await axios.post(apiUrl, {
      image_1: imagePath_1,
      db: dbPath,
      image_2: imagePath_2,
    });
    console.log("Recognition result:", response.data);
    return response;
  } catch (error) {
    console.error("Error recognizing:", error);
    return null;
  }
}
