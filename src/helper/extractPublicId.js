export default function extractPublicId(url) {
  try {
    // Cloudinary URL se public_id nikalta hai
    const parts = url.split("/");
    const fileWithExt = parts.pop();
    const folderPath = parts.slice(7).join("/"); // 'upload' ke baad ka folder path
    const fileName = fileWithExt.split(".")[0];
    return folderPath ? `${folderPath}/${fileName}` : fileName;
  } catch {
    return null;
  }
}