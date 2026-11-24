import data from "./movie-samples.json";

export const { movies, dimension, catalogueSize } = data;
// Each physical slot is a fixed location. A film keeps its slot when the viewer changes.
const shelf = [...movies].sort((a, b) => a.movieId - b.movieId);
const byId = new Map(shelf.map((movie, position) => [movie.movieId, { movie, position }]));

export function cosine(u: number[], v: number[]) {
  let product = 0, userLength = 0, movieLength = 0;
  for (let i = 0; i < u.length; i++) {
    product += u[i] * v[i];
    userLength += u[i] ** 2;
    movieLength += v[i] ** 2;
  }
  return product / Math.sqrt(userLength * movieLength);
}

// All displayed dimensions share this scale, including across successive selections.
export const componentScale = Math.max(...[...data.viewers, ...movies].flatMap(item => item.vector.map(Math.abs)));
export const viewers = data.viewers.map(viewer => ({
  ...viewer,
  results: viewer.top3.map(id => {
    const entry = byId.get(id);
    if (!entry) throw new Error("Missing MovieLens film " + id);
    return { ...entry, score: cosine(viewer.vector, entry.movie.vector) };
  }),
}));

export function formatScore(value: number, digits = 3) {
  return value.toFixed(digits).replace("-", "−");
}
