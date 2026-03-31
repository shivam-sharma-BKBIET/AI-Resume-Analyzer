export const uploadResume = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file); // 🔥 IMPORTANT (name must be "file")

  try {
    const response = await fetch(
      "https://ai-resume-analyzer-jx02.onrender.com/analyze",
      {
        method: "POST",
        body: formData, // ❗ no JSON, no headers
      }
    );

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    throw error;
  }
};