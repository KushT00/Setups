import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar = ({ onSearch }: SearchBarProps) => {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted-foreground">
        <Search size={18} />
      </div>
      <Input
        type="search"
        placeholder="Search files..."
        className="pl-10 h-11 bg-white/80 backdrop-blur-sm border border-border/30 rounded-xl shadow-sm focus-visible:ring-1 w-full"
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;