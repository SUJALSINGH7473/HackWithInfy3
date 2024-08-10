import "./App.css";
import VideoPlayer from "./Youtube";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <VideoPlayer videoUrl="https://www.youtube.com/watch?v=Fcammw5Dh2Y" />
    </QueryClientProvider>
  );
}

export default App;
