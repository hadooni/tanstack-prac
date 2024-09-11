import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";

const App = () => {
  const [title, setTitle] = useState("");
  const [views, setViews] = useState("");
  const queryClient = useQueryClient();

  const API_URL = "http://localhost:3000";

  const getPosts = async () => {
    const response = await axios.get(`${API_URL}/posts`);
    return response.data;
  };

  const getProfile = async () => {
    const response = await axios.get(`${API_URL}/profile`);
    return response.data;
  };

  const getComment = async () => {
    const response = await axios.get(`${API_URL}/comments`);
    return response.data;
  };

  const setPost = async (newPost) => {
    await axios.post(`${API_URL}/posts`, {
      title: newPost.title,
      views: newPost.views,
    });
  };

  const {
    data: posts,
    isLoading: postLoading,
    isError: postError,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: getPosts,
  });

  const { isLoading: profileLoading, isError: profileError } = useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
  });

  const { data: comments, refetch } = useQuery({
    queryKey: ["comments", "id"],
    queryFn: getComment,
  });
  console.log("comments :>> ", comments);

  const mutation = useMutation({
    mutationFn: setPost,
    onSuccess: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });

  if (postLoading) {
    return <div>로딩중입니다...</div>;
  }

  if (postError) {
    return <div>오류가 발생하였습니다...</div>;
  }

  if (profileLoading) {
    return <div>프로필 로딩중입니다...</div>;
  }

  if (profileError) {
    return <div>오류가 발생했습니다...</div>;
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

      {posts.map((post) => {
        return (
          <div key={[post.id]}>
            <p>
              {post.title} (views : {post.views})
              <button onClick={() => refetch()}>댓글보기</button>
              {/* {comments.map((comment) => {
                return (
                  <div key={comment.id}>
                    <p>작성자 아이디 : {comment.postId}</p>
                    <p>{comment.text}</p>
                  </div>
                );
              })} */}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default App;
