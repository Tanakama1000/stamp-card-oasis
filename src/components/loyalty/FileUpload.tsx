
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onFileUploaded: (file: File) => void;
  className?: string;
  accept?: string;
  label?: string;
}

const FileUpload = ({
  onFileUploaded,
  className = "",
  accept = "image/*",
  label = "Upload Image"
}: FileUploadProps) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (!file) return;
    
    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: "Please select an image under 5MB",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    // Pass the file directly instead of converting to data URL
    onFileUploaded(file);
    setIsUploading(false);
  };
  
  return (
    <div className={`relative ${className}`}>
      <input
        type="file"
        accept={accept}
        onChange={handleFileChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        disabled={isUploading}
      />
      <Button
        variant="outline"
        className="w-full flex items-center gap-2"
        disabled={isUploading}
        type="button"
      >
        <Upload size={18} />
        {isUploading ? "Uploading..." : label}
      </Button>
    </div>
  );
};

export default FileUpload;
