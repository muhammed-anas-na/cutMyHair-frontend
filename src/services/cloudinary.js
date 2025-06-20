const uploadImageToCloudinary = async (file) => {
    
    // Check if environment variables are properly set
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    
    if (!uploadPreset || !cloudName) {
      console.error("Environment variables are missing:", { 
        uploadPreset: !!uploadPreset, 
        cloudName: !!cloudName 
      });
      throw new Error("Cloudinary configuration is incomplete. Check your environment variables.");
    }
    
    // Verify file is valid
    if (!file || !(file instanceof File)) {
      console.error("Invalid file object:", file);
      throw new Error("Invalid file provided for upload");
    }
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    
    try {
      const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
            
      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Cloudinary API error response:", {
          status: response.status,
          statusText: response.statusText,
          errorDetails: errorText
        });
        throw new Error(`Cloudinary upload failed: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw error;
    }
  };
  
  export default uploadImageToCloudinary;