"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
import { useState, useEffect } from "react";
import SearchBar from "@/components/SearchBar";
import FileUpload from "@/components/FileUpload";
import FilterSection, { FilterOptions } from "@/components/FilterSection";
import FileGrid from "@/components/FileGrid";
import { FileItem } from "@/components/FileCard"
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogHeader, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { formatDistanceToNow } from "date-fns";
import { Button } from "@/components/ui/button";

// Sample data for demonstration
const sampleFiles: FileItem[] = [
  {
    id: "1",
    name: "Project Presentation.pdf",
    type: "pdf",
    size: "2.4 MB",
    modified: "2 hours ago",
  },
  {
    id: "2",
    name: "Vacation Photo.jpg",
    type: "image/jpeg",
    size: "1.8 MB",
    modified: "Yesterday",
    preview: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bW91bnRhaW5zfGVufDB8fDB8fHww"
  },
  {
    id: "3",
    name: "Financial Report.xlsx",
    type: "excel",
    size: "890 KB",
    modified: "Last week",
  },
  {
    id: "4",
    name: "Meeting Notes.docx",
    type: "document",
    size: "456 KB",
    modified: "3 days ago",
  },
  {
    id: "5",
    name: "Product Demo.mp4",
    type: "video",
    size: "12.6 MB",
    modified: "1 week ago",
  },
  {
    id: "6",
    name: "User Manual.pdf",
    type: "pdf",
    size: "3.2 MB",
    modified: "2 weeks ago",
  },
  {
    id: "7",
    name: "Beach Sunset.jpg",
    type: "image/jpeg",
    size: "2.1 MB",
    modified: "2 days ago",
    preview: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmVhY2h8ZW58MHx8MHx8fDA%3D"
  },
  {
    id: "8",
    name: "Archive.zip",
    type: "zip",
    size: "45.3 MB",
    modified: "1 month ago",
  },
  {
    id: "9",
    name: "Company Logo.png",
    type: "image/png",
    size: "240 KB",
    modified: "3 weeks ago",
    preview: "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YWJzdHJhY3R8ZW58MHx8MHx8fDA%3D"
  },
];

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [filteredFiles, setFilteredFiles] = useState<FileItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFilters, setCurrentFilters] = useState<FilterOptions>({
    type: [],
    date: null,
    sortBy: "date",
  });
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setFiles(sampleFiles);
      setFilteredFiles(sampleFiles);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applyFilters(query, currentFilters);
  };

  const handleFilter = (filters: FilterOptions) => {
    setCurrentFilters(filters);
    applyFilters(searchQuery, filters);
  };

  const applyFilters = (query: string, filters: FilterOptions) => {
    let results = [...files];

    // Apply search
    if (query) {
      const lowerQuery = query.toLowerCase();
      results = results.filter(file => 
        file.name.toLowerCase().includes(lowerQuery)
      );
    }

    // Apply type filters
    if (filters.type.length > 0) {
      results = results.filter(file => {
        const fileType = file.type.toLowerCase();
        return filters.type.some((type: any) => fileType.includes(type));
      });
    }

    // Apply sorting
    results.sort((a, b) => {
      switch (filters.sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "size":
          // Simple string comparison for demo purposes
          return a.size.localeCompare(b.size);
        case "date":
        default:
          // For demo, we're just using the modified string
          return b.modified.localeCompare(a.modified);
      }
    });

    setFilteredFiles(results);
  };

  const handleFileUpload = (fileList: FileList) => {
    const newFiles: FileItem[] = Array.from(fileList).map((file, index) => {
      // Create an object URL for preview (only for images)
      const preview = file.type.startsWith('image/') 
        ? URL.createObjectURL(file) 
        : undefined;
      
      return {
        id: `new-${Date.now()}-${index}`,
        name: file.name,
        type: file.type || 'unknown',
        size: formatFileSize(file.size),
        modified: formatDistanceToNow(new Date(), { addSuffix: true }),
        preview,
      };
    });

    // Add new files to the list
    const updatedFiles = [...newFiles, ...files];
    setFiles(updatedFiles);
    setFilteredFiles(updatedFiles);
    
    toast.success(`${fileList.length} file(s) uploaded successfully`);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleFileClick = (file: FileItem) => {
    setSelectedFile(file);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-4 py-5 sm:py-6 max-w-full">
        

        <div className="space-y-6">
          {/* Search and Upload Row */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <SearchBar onSearch={handleSearch} />
            </div>
            <div className="sm:w-auto">
              <FileUpload onFileUpload={handleFileUpload} />
            </div>
          </div>

          {/* Filter Section */}
          <div className="flex justify-between items-center">
            <FilterSection onFilter={handleFilter} />
            <div className="text-sm text-muted-foreground">
              {filteredFiles.length} file{filteredFiles.length !== 1 ? 's' : ''}
            </div>
          </div>

          {/* File Grid */}
          <div className="mt-6">
            <FileGrid 
              files={filteredFiles} 
              onFileClick={handleFileClick} 
              isLoading={loading}
            />
          </div>
        </div>
      </div>
      
      {/* File Preview Dialog */}
      <Dialog open={!!selectedFile} onOpenChange={(open: any) => !open && setSelectedFile(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="truncate pr-8">{selectedFile?.name}</DialogTitle>
            <DialogDescription>
              {selectedFile?.size} • {selectedFile?.modified}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center justify-center py-4">
            {selectedFile?.preview ? (
              <img 
                src={selectedFile.preview} 
                alt={selectedFile.name} 
                className="max-h-[300px] rounded-md object-contain" 
              />
            ) : (
              <div className="py-12 text-center text-muted-foreground">
                No preview available for this file type
              </div>
            )}
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="secondary">Download</Button>
            <DialogClose asChild>
              <Button variant="ghost">Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;