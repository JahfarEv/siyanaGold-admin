// const MAX_FILE_SIZE = 10 * 1024 * 1024;
// const ALLOWED_CONTENT_TYPES = new Set([
//   "image/avif",
//   "image/gif",
//   "image/jpg",
//   "image/jpeg",
//   "image/png",
//   "image/webp",
// ]);
// const ALLOWED_FOLDERS = new Set([
//   "categories",
//   "home-carousel",
//   "offers",
//   "products",
// ]);

// const jsonResponse = (body, status, origin) =>
//   new Response(JSON.stringify(body), {
//     status,
//     headers: {
//       "Content-Type": "application/json",
//       ...(origin
//         ? {
//             "Access-Control-Allow-Origin": origin,
//             "Access-Control-Allow-Headers": "Authorization, Content-Type",
//             "Access-Control-Allow-Methods": "POST, OPTIONS",
//             Vary: "Origin",
//           }
//         : {}),
//     },
//   });

// const getAllowedOrigin = (request, env) => {
//   const origin = request.headers.get("Origin");
//   const allowedOrigins = (env.ALLOWED_ORIGINS || "")
//     .split(",")
//     .map((value) => value.trim())
//     .filter(Boolean);

//   return origin && allowedOrigins.includes(origin) ? origin : null;
// };

// const verifyAdmin = async (idToken, env) => {
//   let response;
//   try {
//     response = await fetch(
//       `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(env.FIREBASE_API_KEY)}`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ idToken }),
//       },
//     );
//   } catch {
//     return { status: "verification-unavailable" };
//   }

//   if (!response.ok) {
//     let errorMessage = "";
//     try {
//       const data = await response.json();
//       errorMessage = data.error?.message || "";
//     } catch {
//       return { status: "verification-unavailable" };
//     }

//     if (
//       errorMessage === "API_KEY_INVALID" ||
//       errorMessage === "API_KEY_SERVICE_BLOCKED"
//     ) {
//       return { status: "invalid-api-key" };
//     }
//     return { status: "invalid-token" };
//   }

//   let data;
//   try {
//     data = await response.json();
//   } catch {
//     return { status: "verification-unavailable" };
//   }

//   const email = data.users?.[0]?.email?.toLowerCase();
//   const adminEmails = (env.ADMIN_EMAILS || "")
//     .split(",")
//     .map((value) => value.trim().toLowerCase())
//     .filter(Boolean);

//   if (!email) return { status: "invalid-token" };
//   if (!adminEmails.includes(email)) return { status: "not-admin" };
//   return { status: "verified" };
// };

// const normalizeFolder = (folder) => {
//   const segments = folder.split("/").map((segment) =>
//     segment
//       .trim()
//       .toLowerCase()
//       .replace(/[^a-z0-9_-]+/g, "-")
//       .replace(/^-+|-+$/g, ""),
//   );
//   const root = segments[0];

//   if (
//     !ALLOWED_FOLDERS.has(root) ||
//     segments.some(
//       (segment) => !segment || segment === "." || segment === "..",
//     ) ||
//     segments.length > (root === "products" || root === "categories" ? 2 : 1)
//   ) {
//     return null;
//   }

//   return segments.join("/");
// };

// const getFileExtension = (file) => {
//   const extension = file.name.match(/\.([a-z0-9]{1,10})$/i)?.[1]?.toLowerCase();
//   if (extension && /^[a-z0-9]+$/.test(extension)) return `.${extension}`;

//   const extensionsByType = {
//     "image/avif": ".avif",
//     "image/gif": ".gif",
//     "image/jpg": ".jpg",
//     "image/jpeg": ".jpg",
//     "image/png": ".png",
//     "image/webp": ".webp",
//   };
//   return extensionsByType[file.type] || "";
// };

// export default {
//   async fetch(request, env) {
//     const origin = getAllowedOrigin(request, env);
//     if (!origin)
//       return jsonResponse({ error: "Origin not allowed." }, 403, null);

//     if (new URL(request.url).pathname !== "/upload") {
//       return jsonResponse({ error: "Not found." }, 404, origin);
//     }

//     if (request.method === "OPTIONS") {
//       return new Response(null, {
//         status: 204,
//         headers: {
//           "Access-Control-Allow-Origin": origin,
//           "Access-Control-Allow-Headers": "Authorization, Content-Type",
//           "Access-Control-Allow-Methods": "POST, DELETE, OPTIONS",
//           "Access-Control-Max-Age": "86400",
//           Vary: "Origin",
//         },
//       });
//     }

//     if (request.method !== "POST") {
//       return jsonResponse({ error: "Method not allowed." }, 405, origin);
//     }

//     if (!env.FIREBASE_API_KEY || !env.ADMIN_EMAILS || !env.PUBLIC_BASE) {
//       return jsonResponse(
//         { error: "Upload worker is not fully configured." },
//         500,
//         origin,
//       );
//     }

//     const authorization = request.headers.get("Authorization");
//     const idToken = authorization?.startsWith("Bearer ")
//       ? authorization.slice("Bearer ".length)
//       : "";

//     if (!idToken) {
//       return jsonResponse(
//         { error: "Firebase sign-in token is missing. Sign in again." },
//         401,
//         origin,
//       );
//     }

//     const authentication = await verifyAdmin(idToken, env);
//     if (authentication.status === "invalid-token") {
//       return jsonResponse(
//         {
//           error:
//             "Firebase sign-in token is invalid or expired. Sign out and sign in again.",
//         },
//         401,
//         origin,
//       );
//     }
//     if (authentication.status === "not-admin") {
//       return jsonResponse(
//         {
//           error:
//             "This Firebase account is not included in the upload Worker's ADMIN_EMAILS allowlist.",
//         },
//         403,
//         origin,
//       );
//     }
//     if (authentication.status === "invalid-api-key") {
//       return jsonResponse(
//         {
//           error:
//             "The upload Worker FIREBASE_API_KEY is invalid or blocked. Set the Web API key for the same Firebase project used by the admin app, then redeploy.",
//         },
//         500,
//         origin,
//       );
//     }
//     if (authentication.status !== "verified") {
//       return jsonResponse(
//         {
//           error:
//             "The upload Worker could not verify the Firebase token. Check its Firebase API key and try again.",
//         },
//         502,
//         origin,
//       );
//     }

//     const contentLength = Number(request.headers.get("Content-Length") || 0);
//     if (contentLength > MAX_FILE_SIZE + 64 * 1024) {
//       return jsonResponse(
//         { error: "Image must be 10MB or smaller." },
//         413,
//         origin,
//       );
//     }

//     let formData;
//     try {
//       formData = await request.formData();
//     } catch {
//       return jsonResponse(
//         { error: "Expected a multipart image upload." },
//         400,
//         origin,
//       );
//     }

//     const file = formData.get("file");
//     const folder = formData.get("folder");
//     if (!(file instanceof File) || typeof folder !== "string") {
//       return jsonResponse(
//         { error: "An image file and folder are required." },
//         400,
//         origin,
//       );
//     }

//     if (file.size === 0) {
//       return jsonResponse({ error: "Image file is empty." }, 400, origin);
//     }
//     if (file.size > MAX_FILE_SIZE) {
//       return jsonResponse(
//         { error: "Image must be 10MB or smaller." },
//         413,
//         origin,
//       );
//     }
//     if (!ALLOWED_CONTENT_TYPES.has(file.type)) {
//       return jsonResponse(
//         { error: "Only AVIF, GIF, JPEG, PNG, and WebP images are supported." },
//         415,
//         origin,
//       );
//     }

//     const objectFolder = normalizeFolder(folder);
//     if (!objectFolder) {
//       return jsonResponse({ error: "Invalid upload folder." }, 400, origin);
//     }

//     // const key = `image/${objectFolder}/${crypto.randomUUID()}${getFileExtension(file)}`;
//     const key = `image/${objectFolder}/${crypto.randomUUID()}${getFileExtension(file)}`;

//     try {
//       await env.BUCKET.put(key, file.stream(), {
//         httpMetadata: {
//           contentType: file.type,
//           cacheControl: "public, max-age=31536000, immutable",
//         },
//       });
//     } catch (error) {
//       console.error("R2 image upload failed:", error);
//       return jsonResponse(
//         { error: "Could not store the image in R2." },
//         500,
//         origin,
//       );
//     }

//     const publicBase = env.PUBLIC_BASE.replace(/\/+$/, "");
//     const encodedKey = key.split("/").map(encodeURIComponent).join("/");
//     return jsonResponse(
//       { key, url: `${publicBase}/${encodedKey}` },
//       200,
//       origin,
//     );
//   },
// };



const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_CONTENT_TYPES = new Set([
  "image/avif",
  "image/gif",
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/webp",
]);
const ALLOWED_FOLDERS = new Set([
  "categories",
  "home-carousel",
  "offers",
  "products",
]);

const jsonResponse = (body, status, origin) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...(origin
        ? {
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Headers": "Authorization, Content-Type",
            "Access-Control-Allow-Methods": "POST, DELETE, OPTIONS", // CHANGED: added DELETE
            Vary: "Origin",
          }
        : {}),
    },
  });

const getAllowedOrigin = (request, env) => {
  const origin = request.headers.get("Origin");
  const allowedOrigins = (env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  return origin && allowedOrigins.includes(origin) ? origin : null;
};

const verifyAdmin = async (idToken, env) => {
  let response;
  try {
    response = await fetch(
      `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(env.FIREBASE_API_KEY)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      },
    );
  } catch {
    return { status: "verification-unavailable" };
  }

  if (!response.ok) {
    let errorMessage = "";
    try {
      const data = await response.json();
      errorMessage = data.error?.message || "";
    } catch {
      return { status: "verification-unavailable" };
    }

    if (
      errorMessage === "API_KEY_INVALID" ||
      errorMessage === "API_KEY_SERVICE_BLOCKED"
    ) {
      return { status: "invalid-api-key" };
    }
    return { status: "invalid-token" };
  }

  let data;
  try {
    data = await response.json();
  } catch {
    return { status: "verification-unavailable" };
  }

  const email = data.users?.[0]?.email?.toLowerCase();
  const adminEmails = (env.ADMIN_EMAILS || "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  if (!email) return { status: "invalid-token" };
  if (!adminEmails.includes(email)) return { status: "not-admin" };
  return { status: "verified" };
};

const normalizeFolder = (folder) => {
  const segments = folder.split("/").map((segment) =>
    segment
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_-]+/g, "-")
      .replace(/^-+|-+$/g, ""),
  );
  const root = segments[0];

  if (
    !ALLOWED_FOLDERS.has(root) ||
    segments.some(
      (segment) => !segment || segment === "." || segment === "..",
    ) ||
    segments.length > (root === "products" || root === "categories" ? 2 : 1)
  ) {
    return null;
  }

  return segments.join("/");
};

const getFileExtension = (file) => {
  const extension = file.name.match(/\.([a-z0-9]{1,10})$/i)?.[1]?.toLowerCase();
  if (extension && /^[a-z0-9]+$/.test(extension)) return `.${extension}`;

  const extensionsByType = {
    "image/avif": ".avif",
    "image/gif": ".gif",
    "image/jpg": ".jpg",
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/webp": ".webp",
  };
  return extensionsByType[file.type] || "";
};

export default {
  async fetch(request, env) {
    const origin = getAllowedOrigin(request, env);
    if (!origin)
      return jsonResponse({ error: "Origin not allowed." }, 403, null);

    if (new URL(request.url).pathname !== "/upload") {
      return jsonResponse({ error: "Not found." }, 404, origin);
    }

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": origin,
          "Access-Control-Allow-Headers": "Authorization, Content-Type",
          "Access-Control-Allow-Methods": "POST, DELETE, OPTIONS",
          "Access-Control-Max-Age": "86400",
          Vary: "Origin",
        },
      });
    }

    // CHANGED: allow DELETE as well as POST
    if (request.method !== "POST" && request.method !== "DELETE") {
      return jsonResponse({ error: "Method not allowed." }, 405, origin);
    }

    if (!env.FIREBASE_API_KEY || !env.ADMIN_EMAILS || !env.PUBLIC_BASE) {
      return jsonResponse(
        { error: "Upload worker is not fully configured." },
        500,
        origin,
      );
    }

    const authorization = request.headers.get("Authorization");
    const idToken = authorization?.startsWith("Bearer ")
      ? authorization.slice("Bearer ".length)
      : "";

    if (!idToken) {
      return jsonResponse(
        { error: "Firebase sign-in token is missing. Sign in again." },
        401,
        origin,
      );
    }

    const authentication = await verifyAdmin(idToken, env);
    if (authentication.status === "invalid-token") {
      return jsonResponse(
        {
          error:
            "Firebase sign-in token is invalid or expired. Sign out and sign in again.",
        },
        401,
        origin,
      );
    }
    if (authentication.status === "not-admin") {
      return jsonResponse(
        {
          error:
            "This Firebase account is not included in the upload Worker's ADMIN_EMAILS allowlist.",
        },
        403,
        origin,
      );
    }
    if (authentication.status === "invalid-api-key") {
      return jsonResponse(
        {
          error:
            "The upload Worker FIREBASE_API_KEY is invalid or blocked. Set the Web API key for the same Firebase project used by the admin app, then redeploy.",
        },
        500,
        origin,
      );
    }
    if (authentication.status !== "verified") {
      return jsonResponse(
        {
          error:
            "The upload Worker could not verify the Firebase token. Check its Firebase API key and try again.",
        },
        502,
        origin,
      );
    }

    // NEW: delete handler (runs only after the admin check above)
    if (request.method === "DELETE") {
      const key = new URL(request.url).searchParams.get("key") || "";

      // only allow deleting files inside the image/ folder
      if (!key.startsWith("image/") || key.includes("..")) {
        return jsonResponse({ error: "Invalid key." }, 400, origin);
      }

      try {
        await env.BUCKET.delete(key);
      } catch (error) {
        console.error("R2 image delete failed:", error);
        return jsonResponse(
          { error: "Could not delete the image from R2." },
          500,
          origin,
        );
      }

      return jsonResponse({ deleted: true, key }, 200, origin);
    }

    const contentLength = Number(request.headers.get("Content-Length") || 0);
    if (contentLength > MAX_FILE_SIZE + 64 * 1024) {
      return jsonResponse(
        { error: "Image must be 10MB or smaller." },
        413,
        origin,
      );
    }

    let formData;
    try {
      formData = await request.formData();
    } catch {
      return jsonResponse(
        { error: "Expected a multipart image upload." },
        400,
        origin,
      );
    }

    const file = formData.get("file");
    const folder = formData.get("folder");
    if (!(file instanceof File) || typeof folder !== "string") {
      return jsonResponse(
        { error: "An image file and folder are required." },
        400,
        origin,
      );
    }

    if (file.size === 0) {
      return jsonResponse({ error: "Image file is empty." }, 400, origin);
    }
    if (file.size > MAX_FILE_SIZE) {
      return jsonResponse(
        { error: "Image must be 10MB or smaller." },
        413,
        origin,
      );
    }
    if (!ALLOWED_CONTENT_TYPES.has(file.type)) {
      return jsonResponse(
        { error: "Only AVIF, GIF, JPEG, PNG, and WebP images are supported." },
        415,
        origin,
      );
    }

    const objectFolder = normalizeFolder(folder);
    if (!objectFolder) {
      return jsonResponse({ error: "Invalid upload folder." }, 400, origin);
    }

    // CHANGED: removed the duplicate commented-out line
    const key = `image/${objectFolder}/${crypto.randomUUID()}${getFileExtension(file)}`;

    try {
      await env.BUCKET.put(key, file.stream(), {
        httpMetadata: {
          contentType: file.type,
          cacheControl: "public, max-age=31536000, immutable",
        },
      });
    } catch (error) {
      console.error("R2 image upload failed:", error);
      return jsonResponse(
        { error: "Could not store the image in R2." },
        500,
        origin,
      );
    }

    const publicBase = env.PUBLIC_BASE.replace(/\/+$/, "");
    const encodedKey = key.split("/").map(encodeURIComponent).join("/");
    return jsonResponse(
      { key, url: `${publicBase}/${encodedKey}` },
      200,
      origin,
    );
  },
};