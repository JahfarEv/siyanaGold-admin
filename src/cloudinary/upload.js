export const uploadToCloudinary = async (file, folder = "products") => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "upload");
  formData.append("folder", folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/db6oj64tg/image/upload`,
    { method: "POST", body: formData }
  );

  const data = await res.json();
  return data.secure_url;
};
