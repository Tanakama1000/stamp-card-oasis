
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface FileUploadProps {
  onFileUploaded: (dataUrl: string) => void;
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
    
    const reader = new FileReader();
    
    reader.onload = (event) => {
      if (event.target?.result) {
        onFileUploaded(event.target.result as string);
      }
      setIsUploading(false);
    };
    
    reader.onerror = () => {
      toast({
        title: "Upload failed",
        description: "Failed to read the selected file",
        variant: "destructive"
      });
      setIsUploading(false);
    };
    
    reader.readAsDataURL(file);
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
