
"use client";

import { useState } from "react";
import { upload } from "@imagekit/next";
import { Image } from "@imagekit/next";

const ImageUpload = () => {
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [progress, setProgress] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Get temporary authentication from our backend
  const authenticator = async () => {
    const response = await fetch("/api/imagekit/auth");

    if (!response.ok) {
      throw new Error("ImageKit authentication failed");
    }

    return await response.json();
  };

  // Upload image to ImageKit
  const handleUpload = async () => {
    if (!file) {
      setError("Please select an image first");
      return;
    }

    // Basic frontend validation
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5 MB");
      return;
    }

    setLoading(true);
    setError("");
    setProgress(0);

    try {
      // 1. Get authentication parameters
      const authParams = await authenticator();

      // 2. Upload image to ImageKit
      const result = await upload({
        ...authParams,
        file,
        fileName: file.name,
        folder: "/products",
        useUniqueFileName: true,

        // Track upload progress
        onProgress: (event) => {
          const percentage =
            (event.loaded / event.total) * 100;

          setProgress(Math.round(percentage));
        },
      });

      // 3. Save uploaded image URL
      setImageUrl(result.url);

      console.log("Image uploaded successfully:", result);

    } catch (err) {
      console.error("Image upload error:", err);
      setError(err.message || "Image upload failed");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md space-y-4">

      <h2 className="text-xl font-semibold">
        Upload Product Image
      </h2>

      {/* Select Image */}
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          setFile(e.target.files?.[0] || null);
          setImageUrl("");
          setError("");
          setProgress(0);
        }}
        className="w-full border p-2 rounded-lg"
      />

      {/* Upload Button */}
      <button
        type="button"
        onClick={handleUpload}
        disabled={loading || !file}
        className="w-full bg-indigo-600 text-white py-2 rounded-lg disabled:opacity-50"
      >
        {loading ? "Uploading..." : "Upload Image"}
      </button>

      {/* Upload Progress */}
      {loading && (
        <div className="space-y-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-sm text-center">
            {progress}% uploaded
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <p className="text-red-500 text-sm">
          {error}
        </p>
      )}

      {/* Image Preview */}
      {imageUrl && (
        <div className="space-y-3">
          <p className="text-green-600 font-medium">
            Image uploaded successfully!
          </p>

          <Image
            src={imageUrl}
            alt="Uploaded product"
            width={500}
            height={500}
            transformation={[
              { width: 500, height: 500, quality: 80 }
            ]}
            className="w-full h-64 object-contain rounded-lg"
          />

          <p className="text-xs break-all text-gray-500">
            {imageUrl}
          </p>
        </div>
      )}

    </div>
  );
};

export default ImageUpload;
