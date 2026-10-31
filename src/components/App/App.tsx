import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { ComponentType } from "react";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import type { ReactPaginateProps } from "react-paginate";
import ReactPaginateModule from "react-paginate";
import getMovies from "../../services/movieService";
import type { Movie } from "../../types/movie";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import Loader from "../Loader/Loader";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import SearchBar from "../SearchBar/SearchBar";
import css from "./App.module.css";

type ModuleWithDefault<T> = { default: T };

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<
    ComponentType<ReactPaginateProps>
  >
).default;

export default function App() {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const handleSearch = (query: string) => {
    setQuery(query);
    setPage(1);
  };

  const { data, isError, isLoading, isSuccess } = useQuery({
    queryKey: ["query", query, page],
    queryFn: () => getMovies(query, page),
    enabled: query !== "",
    placeholderData: keepPreviousData,
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
      {isSuccess && data.total_pages > 1 && (
        <ReactPaginate
          pageCount={data.total_pages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
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
