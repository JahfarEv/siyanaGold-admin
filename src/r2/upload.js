// import { auth } from "../firebase/firebase";

// const uploadUrl = import.meta.env.VITE_R2_UPLOAD_URL;

// const getUploadUrl = () => {
//   if (!uploadUrl) {
//     throw new Error("Missing VITE_R2_UPLOAD_URL in the admin .env file.");
//   }

//   let url;
//   try {
//     url = new URL(uploadUrl);
//   } catch {
//     throw new Error("VITE_R2_UPLOAD_URL must be a valid Worker URL.");
//   }

//   if (url.pathname === "/" || url.pathname === "/upload/") {
//     url.pathname = "/upload";
//   } else if (url.pathname !== "/upload") {
//     throw new Error("VITE_R2_UPLOAD_URL must point to the Worker's /upload endpoint.");
//   }

//   return url.toString();
// };

// export const uploadToR2 = async (file, folder = "products") => {
//   const user = auth.currentUser;
//   if (!user) {
//     throw new Error("You must be signed in as an admin to upload files.");
//   }

//   const formData = new FormData();
//   formData.append("file", file);
//   formData.append("folder", folder);

//   let response;
//   try {
//     response = await fetch(getUploadUrl(), {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${await user.getIdToken()}`,
//       },
//       body: formData,
//     });
//   } catch (error) {
//     throw new Error(
//       "Could not reach the R2 upload Worker. Confirm it is deployed and allows this admin site's origin in ALLOWED_ORIGINS.",
//       { cause: error }
//     );
//   }

//   let data;
//   try {
//     data = await response.json();
//   } catch (error) {
//     throw new Error(
//       `R2 upload Worker returned an invalid response (HTTP ${response.status}).`,
//       { cause: error }
//     );
//   }

//   if (!response.ok || typeof data?.url !== "string" || !data.url) {
//     const message =
//       data?.error || `R2 upload failed with status ${response.status}.`;
//     if (response.status === 401) {
//       throw new Error(
//         `${message} Check that the deployed Worker uses the Firebase Web API key for this admin app's Firebase project and that your signed-in account is authorized. Then redeploy the Worker and sign in again.`
//       );
//     }

//     throw new Error(
//       message
//     );
//   }

//   return data.url;
// };



import imageCompression from "browser-image-compression";
import { auth } from "../firebase/firebase";

const uploadUrl = import.meta.env.VITE_R2_UPLOAD_URL;
const PUBLIC_BASE = "https://img.siyanagoldanddiamonds.in";

const getUploadUrl = () => {
  if (!uploadUrl) {
    throw new Error("Missing VITE_R2_UPLOAD_URL in the admin .env file.");
  }

  let url;
  try {
    url = new URL(uploadUrl);
  } catch {
    throw new Error("VITE_R2_UPLOAD_URL must be a valid Worker URL.");
  }

  if (url.pathname === "/" || url.pathname === "/upload/") {
    url.pathname = "/upload";
  } else if (url.pathname !== "/upload") {
    throw new Error("VITE_R2_UPLOAD_URL must point to the Worker's /upload endpoint.");
  }

  return url.toString();
};

// Shrink and convert to WebP. GIF and SVG are left alone so they keep working.
const prepareFile = async (file) => {
  if (/gif|svg/.test(file.type)) return { body: file, name: file.name };

  const compressed = await imageCompression(file, {
    maxWidthOrHeight: 1600,
    maxSizeMB: 0.6,
    useWebWorker: true,
    fileType: "image/webp",
  });
  return { body: compressed, name: "image.webp" };
};

export const uploadToR2 = async (file, folder = "products") => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("You must be signed in as an admin to upload files.");
  }

  const { body, name } = await prepareFile(file);

  const formData = new FormData();
  formData.append("file", body, name);
  formData.append("folder", folder);

  let response;
  try {
    response = await fetch(getUploadUrl(), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${await user.getIdToken()}`,
      },
      body: formData,
    });
  } catch (error) {
    throw new Error(
      "Could not reach the R2 upload Worker. Confirm it is deployed and allows this admin site's origin in ALLOWED_ORIGINS.",
      { cause: error }
    );
  }

  let data;
  try {
    data = await response.json();
  } catch (error) {
    throw new Error(
      `R2 upload Worker returned an invalid response (HTTP ${response.status}).`,
      { cause: error }
    );
  }

  if (!response.ok || typeof data?.url !== "string" || !data.url) {
    const message =
      data?.error || `R2 upload failed with status ${response.status}.`;
    if (response.status === 401) {
      throw new Error(
        `${message} Check that the deployed Worker uses the Firebase Web API key for this admin app's Firebase project and that your signed-in account is authorized. Then redeploy the Worker and sign in again.`
      );
    }

    throw new Error(message);
  }

  return data.url;
};

// Optional: remove a file from R2. Call it only after the Firestore save succeeded.
// Old Cloudinary URLs are ignored, so it is safe to call on any image URL.
export const deleteFromR2 = async (url) => {
  if (!url?.startsWith(PUBLIC_BASE + "/")) return;

  const user = auth.currentUser;
  if (!user) return;

  const key = decodeURIComponent(url.slice(PUBLIC_BASE.length + 1));
  try {
    await fetch(`${getUploadUrl()}?key=${encodeURIComponent(key)}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${await user.getIdToken()}` },
    });
  } catch (error) {
    // a failed delete only leaves an unused file behind, so it should not break the save
    console.warn("Could not delete image from R2:", error);
  }
};