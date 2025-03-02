import FileCard, { FileItem } from "./FileCard";

interface FileGridProps {
  files: FileItem[];
  onFileClick: (file: FileItem) => void;
  isLoading?: boolean;
}

const FileGrid = ({ files, onFileClick, isLoading = false }: FileGridProps) => {
  // Generate placeholder cards for loading state
  const placeholders = Array(9).fill(0).map((_, index) => ({
    id: `placeholder-${index}`,
    name: "Loading...",
    type: "unknown",
    size: "--",
    modified: "--",
  }));

  const displayFiles = isLoading ? placeholders : files;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {displayFiles.map((file) => (
        <div key={file.id} className={isLoading ? "shimmer" : ""}>
          <FileCard file={file} onClick={onFileClick} />
        </div>
      ))}
      {!isLoading && files.length === 0 && (
        <div className="col-span-3 py-12 text-center">
          <p className="text-muted-foreground">No files found. Upload some files to get started.</p>
        </div>
      )}
    </div>
  );
};

export default FileGrid;