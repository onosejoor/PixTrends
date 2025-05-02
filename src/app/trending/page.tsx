import { SearchBar } from "./_components/SearchBar";
import TrendingPosts from "./_components/TrendingPosts";
import { TrendingUsers } from "./_components/TrendingUsers";

export default function TrendingPage() {
  return (
    <div className="grid gap-5 py-10">
      <SearchBar />
      <hr className="border-light-gray" />
      <TrendingUsers />
      <hr className="border-light-gray" />
      <TrendingPosts />
    </div>
  );
}
