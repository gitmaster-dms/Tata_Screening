// src/config/api.js
const getApiBaseUrl = () => {
  const { hostname, port } = window.location;

  console.log("Current Host:", hostname, "Port:", port);

  // Localhost
  if (hostname === "localhost") {
    return "http://192.168.1.21:8000";
  }

 //192.168.1.21:8000
  if (hostname === "192.168.1.21" && port === "8000") {
    return "http://192.168.1.21:8000";
  }

  // 192.168.1.116:7000
  if (hostname === "192.168.1.116" && port === "7000") {
    return "http://192.168.1.116:6003";
  }

  // 122.176.232.35:7000
  if (hostname === "122.176.232.35" && port === "7000") {
    return "http://122.176.232.35:6003";
  }

  // 117.213.202.187:7000
  if (hostname === "117.213.202.187") {
    return "http://117.213.202.187";
  }

  // Production without port
  if (hostname === "172.16.32.108") {
    return "http://172.16.32.108";
  }

  // Default fallback
  return "http://172.16.32.108";
};

export const API_URL = getApiBaseUrl();
