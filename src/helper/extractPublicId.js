export default function extractPublicId(url) {
  try {
    const parts = url.split("/");
    const fileWithExt = parts.pop();
    const folderPath = parts.slice(7).join("/");
    const fileName = fileWithExt.split(".")[0];
    return folderPath ? `${folderPath}/${fileName}` : fileName;
  } catch {
    return null;
  }
}