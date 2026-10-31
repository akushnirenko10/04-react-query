import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import getMovies from "../../services/movieService";
import type { Movie } from "../../types/movie";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Loader from "../Loader/Loader";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import Pagination from "../Pagination/Pagination";
import SearchBar from "../SearchBar/SearchBar";

export default function App() {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = (query: string) => {
    setQuery(query);
    setCurrentPage(1);
  };

  const { data, isError, isLoading } = useQuery({
    queryKey: ["query", query, currentPage],
    queryFn: () => getMovies(query, currentPage),
    enabled: query !== "",
  });

  const movies = data?.results;

  const handleOpenModal = (movie: Movie) => {
    setMovie(movie);
  };

  const handleCloseModal = () => {
    setMovie(null);
  };

  useEffect(() => {
    if (movies && movies.length === 0 && query) {
      toast.error("No movies found for your request.");
    }
  }, [movies, query]);

  return (
    <>
      <SearchBar onSubmit={handleSearch} />
      {data && data.total_pages > 1 && (
        <Pagination
          totalPages={data.total_pages}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      )}
      {movies && <MovieGrid onSelect={handleOpenModal} movies={movies} />}
      <Toaster />
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {movie && <MovieModal movie={movie} onClose={handleCloseModal} />}
    </>
  );
}
