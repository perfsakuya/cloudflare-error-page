import React, { useState } from "react";
import ErrorPage from "./components/ErrorPage";

const defaultParams = {
  title: "Internal server error",
  error_code: 500,
  domain: null, // Defaults to current hostname (window.location.hostname)
  time: null, // Defaults to current UTC time
  ray_id: null, // Defaults to random hex
  client_ip: "127.0.0.1",

  more_information: {
    hidden: false,
    text: "cloudflare.com",
    link: "https://www.cloudflare.com",
  },

  browser_status: {
    status: "ok",
    status_text: "Working",
    location: "You",
    name: "Browser",
  },
  cloudflare_status: {
    status: "error",
    status_text: "Error",
    location: "London",
    name: "Cloudflare",
  },
  host_status: {
    status: "ok",
    status_text: "Working",
    name: "Host",
  },
  error_source: "cloudflare",

  what_happened:
    "<p>There is an internal server error on Cloudflare's network.</p>",
  what_can_i_do: "<p>Please try again in a few minutes.</p>",

  perf_sec_by: {
    text: "Cloudflare",
    link: "https://www.cloudflare.com",
  },
};

// const catastrophicParams = {
//   title: "Catastrophic infrastructure failure",
//   error_code: 503,
//   more_information: {
//     text: "cloudflare.com",
//     link: "https://youtube.com/watch?v=dQw4w9WgXcQ",
//   },
//   browser_status: {
//     status: "error",
//     status_text: "Out of Memory",
//     location: "Your Device",
//     name: "Browser",
//   },
//   cloudflare_status: {
//     status: "error",
//     location: "Global Network",
//     status_text: "Critical Failure",
//     name: "Cloudflare",
//   },
//   host_status: {
//     status: "error",
//     location: "Origin Server",
//     status_text: "On Fire",
//     name: "Host",
//   },
//   error_source: "cloudflare",
//   what_happened: "<p>There is a catastrophic failure.</p>",
//   what_can_i_do: "<p>Please try again in a few years.</p>",
//   perf_sec_by: {
//     text: "Cloudflare",
//     link: "https://youtube.com/watch?v=dQw4w9WgXcQ",
//   },
// };

// const workingParams = {
//   title: "Web server is working",
//   error_code: 200,
//   more_information: { hidden: true },
//   browser_status: {
//     status: "ok",
//     status_text: "Seems Working",
//     location: "You",
//     name: "Browser",
//   },
//   cloudflare_status: {
//     status: "ok",
//     status_text: "Often Working",
//     location: "Cloud",
//     name: "Cloudflare",
//   },
//   host_status: { status: "ok", status_text: "Just Working", name: "Host" },
//   error_source: "host",
//   what_happened: "<p>This site is still working. And it looks great.</p>",
//   what_can_i_do: "<p>Visit the site before it crashes someday.</p>",
// };

import "./styles/demo.css";

// Simple deep merge function
function deepMerge(target, source) {
  const output = { ...target };
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  return output;
}

function isObject(item) {
  return item && typeof item === "object" && !Array.isArray(item);
}

function getParamsFromEnv() {
  const envConfig = import.meta.env.VITE_CONFIG_JSON;
  if (envConfig) {
    try {
      const parsedConfig = JSON.parse(envConfig);
      console.log("Loaded config from VITE_CONFIG_JSON:", parsedConfig);
      return deepMerge(defaultParams, parsedConfig);
    } catch (e) {
      console.error("Failed to parse VITE_CONFIG_JSON:", e);
    }
  }
  return defaultParams;
}

function App() {
  const [params, setParams] = useState(getParamsFromEnv());

  // Fetch client IP and Ray ID from Cloudflare's trace endpoint
  React.useEffect(() => {
    async function fetchCloudflareInfo() {
      try {
        const response = await fetch("/cdn-cgi/trace");
        const text = await response.text();

        // Parse the trace response (format: key=value per line)
        const ipMatch = text.match(/ip=([\d.a-f:]+)/i);
        const coloMatch = text.match(/colo=([A-Z]{3})/i);

        // Ray ID is in the response headers
        const rayId = response.headers.get("cf-ray");

        setParams((prevParams) => {
          const updates = { ...prevParams };

          // Update client IP
          if (ipMatch && ipMatch[1]) {
            updates.client_ip = ipMatch[1];
          }

          // Update Ray ID (first 16 characters)
          if (rayId) {
            updates.ray_id = rayId.split("-")[0].substring(0, 16);

            // Update Cloudflare location from Ray ID (last 3 chars before dash)
            const locationCode = rayId.split("-")[1];
            if (locationCode && !prevParams.cloudflare_status?.location) {
              updates.cloudflare_status = {
                ...prevParams.cloudflare_status,
                location: locationCode,
              };
            }
          }

          // Alternatively, use colo code from trace if Ray ID location not available
          if (
            coloMatch &&
            coloMatch[1] &&
            !updates.cloudflare_status?.location
          ) {
            updates.cloudflare_status = {
              ...prevParams.cloudflare_status,
              location: coloMatch[1],
            };
          }

          return updates;
        });
      } catch (error) {
        console.warn("oops", error);
        // Keep default values on error
      }
    }

    fetchCloudflareInfo();
  }, []);

  return (
    <div>
      {/* <div className="demo-controller-trigger"></div>
      <div className="demo-controller">
        <span>Select Scenario:</span>
        <button onClick={() => setParams(defaultParams)}>Default (500)</button>
        <button onClick={() => setParams(catastrophicParams)}>Catastrophic</button>
        <button onClick={() => setParams(workingParams)}>Working (200)</button>
      </div> */}

      {/* <div> */}
      <ErrorPage params={params} />
      {/* </div> */}
    </div>
  );
}

export default App;
