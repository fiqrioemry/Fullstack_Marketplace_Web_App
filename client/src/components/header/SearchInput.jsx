/* eslint-disable react/prop-types */
import { Input } from "@/components/ui/input";

const SearchInput = ({ searchForm, handleSearch }) => {
  return (
    <div className="w-full">
      <Input
        name="search"
        onFocus={handleSearch}
        placeholder="Search a product.."
        onChange={searchForm?.handleChange}
        value={searchForm?.values?.search}
        className="text-sm md:text-md w-full border-muted-foreground/20"
      />
    </div>
  );
};

export default SearchInput;
