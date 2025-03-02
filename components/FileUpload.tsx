import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRef } from "react";
import { toast } from "sonner";

interface FileUploadProps {
  onFileUpload: (files: FileList) => void;
}

const FileUpload = ({ onFileUpload }: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFileUpload(e.target.files);
      toast.success(`${e.target.files.length} file(s) selected for upload`);
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        multiple
        onChange={handleFileChange}
      />
      <Button 
        onClick={handleClick}
        variant="outline"
        className="h-11 px-4 bg-white/80 backdrop-blur-sm border border-border/30 rounded-xl hover:bg-secondary transition-colors duration-300 flex items-center gap-2 shadow-sm"
      >
        <Upload size={18} />
        <span>Upload</span>
      </Button>
    </div>
  );
};

export default FileUpload;
