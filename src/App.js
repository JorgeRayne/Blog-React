import Header from "./Header";
import Nav from "./Nav";
import Footer from "./Footer";
import Home from "./Home";
import NewPost from "./NewPost";
import PostPage from "./PostPage";
import About from "./About";
import Missing from "./Missing";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import api from "./api/post.js";

function App() {
  const [post, setPost] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get("/post");
        setPost(response.data);
      } catch (err) {
        {
          if (err.response) {
            // Not in 200 response range
            console.log(err.response.data);
            console.log(err.response.status);
            console.log(err.response.header);
          } else {
            console.log(err.message);
          }
        }
      }
    };

    fetchPost();
  }, []);

  useEffect(() => {
    const filteredResult = post.filter(
      (post) =>
        post.body.toLowerCase().includes(search.toLocaleLowerCase()) ||
        post.title.toLowerCase().includes(search.toLocaleLowerCase())
    );

    setSearchResult(filteredResult.reverse());
  }, [post, search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = post.length ? post[post.length - 1].id : 1;
    const datetime = format(new Date(), "MMMM dd, yyyy pp");
    const newPost = { id, title: postTitle, datetime, body: postBody };
    const allPost = [...post, newPost];
    setPost(allPost);
    setPostTitle("");
    setPostBody("");
    navigate("/");
  };

  const handleDelete = (id) => {
    const postList = post.filter((post) => post.id !== id);
    setPost(postList);
    navigate("/");
  };

  return (
    <div className="App">
      <Header title="Blog" />
      <Nav search={search} setSearch={setSearch} />
      <Routes>
        <Route path="/" element={<Home post={searchResult} />} />

        <Route
          path="/post"
          element={
            <NewPost
              handleSubmit={handleSubmit}
              postTitle={postTitle}
              setPostTitle={setPostTitle}
              postBody={postBody}
              setPostBody={setPostBody}
            />
          }
        />

        <Route
          path="/post/:id"
          element={<PostPage posts={post} handleDelete={handleDelete} />}
        />

        <Route path="/about" element={<About />} />
        <Route path="*" element={<Missing />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
