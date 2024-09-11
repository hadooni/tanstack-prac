import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

const App = () => {
  const [title, setTitle] = useState("");
  const [views, setViews] = useState("");
  const queryClient = useQueryClient();

  const getPosts = async () => {
    const response = await axios.get("http://localhost:3000/posts");
    return response.data;
  };

  const setPost = async (newPost) => {
    await axios.post("http://localhost:3000/posts", {
      title: newPost.title,
      views: newPost.views,
    });
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  const mutation = useMutation({
    mutationFn: setPost,
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });

  if (isLoading) {
    return <div>로딩중입니다...</div>;
  }

  if (isError) {
    return <div>오류가 발생하였습니다...</div>;
  }

  return (
    <div>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        value={views}
        onChange={(e) => setViews(e.target.value)}
      />
      <button
        onClick={() => {
          mutation.mutate({ title, views });
        }}
      >
        입력
      </button>

      {data.map((post) => {
        return (
          <div key={[post.id]}>
            <p>
              {post.title} (views : {post.views})
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default App;
