import axios from "axios";
import type { Movie } from "../types/movie";

const moviesApi = axios.create({
  baseURL: "https://api.themoviedb.org/3/search",
});

interface MoviesResponse {
  results: Movie[];
  total_pages: number;
  page: number;
}

export default async function getMovies(
  query: string,
  page: number,
): Promise<MoviesResponse> {
  const { data } = await moviesApi.get<MoviesResponse>(`/movie`, {
    params: {
      query,
      page,
    },
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
    },
  });
  console.log(data);
  return data;
}
