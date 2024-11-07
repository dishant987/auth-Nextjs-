"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Trash2, Upload } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface UserProfileProps {
  imgUrl?: string;
  name?: string;
}

export default function UserProfile({ imgUrl, name }: UserProfileProps) {
  const [imageUrl, setImageUrl] = useState(imgUrl || "");
  const [previewUrl, setPreviewUrl] = useState("");

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setPreviewUrl(URL.createObjectURL(file));

    // Prepare form data to send to backend
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/image-upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
          duration: 4000,
        });
        console.error("Error uploading image:", result.error);
        return;
      }
      if (result.success) {
        toast({
          title: "Success",
          description: result.success,
          variant: "default",
          duration: 4000,
        });
      }
      console.log(result);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const handleDeleteImage = () => {
    setImageUrl("");
    setPreviewUrl("");
  };

  return (
    <div>
      <div className="mb-6">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="w-32 h-32">
            <AvatarImage src={previewUrl || imageUrl} alt="Profile" />
            <AvatarFallback className="text-gray-500 text-6xl">
              {name?.slice(0, 1)}
            </AvatarFallback>
          </Avatar>
          <div className="flex items-center space-x-4">
            <Input
              id="profile-image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <Button asChild>
              <Label htmlFor="profile-image" className="cursor-pointer">
                <Upload className="mr-2 h-4 w-4" />
                Upload Image
              </Label>
            </Button>
            {(imageUrl || previewUrl) && (
              <Button
                variant="destructive"
                size="icon"
                onClick={handleDeleteImage}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {previewUrl && !imageUrl && (
        <div className="mb-4 text-center">
          <p className="text-sm text-gray-500">Image preview (uploading...)</p>
        </div>
      )}
    </div>
  );
}
