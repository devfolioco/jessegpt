/**
 * Upload metadata and image to IPFS through the API
 * @param name - Short title/symbol for the coin
 * @param description - Detailed description of the coin
 * @param imageFile - The image file to upload
 * @param apiUrl - The URL of your IPFS upload API endpoint
 * @returns Promise resolving to the CID of the uploaded metadata
 */

export async function uploadToIPFS(name: string, description: string, imageBase64: string): Promise<string> {
  try {
    // Create the request payload
    const payload = {
      name,
      description,
      image: imageBase64,
    };

    // Make the POST request to the API
    const response = await fetch('/api/ipfs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    // Check if the response is successful
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    // Parse and return the response data
    const data = (await response.json()) as { cid: string };
    return data.cid; // { cid: string }
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw error;
  }
}

/**
 * Helper function to convert a File or Blob to base64
 * @param {File|Blob} file - The file to convert
 * @returns {Promise<string>} - Promise resolving to base64 data URL
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
