import Header from "./Header";
import Nav from "./Nav";
import Footer from "./Footer";
import Home from "./Home";
import NewPost from "./NewPost";
import PostPage from "./PostPage";
import EditPost from "./EditPost.js";
import About from "./About";
import Missing from "./Missing";
import { Route, Routes, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import api from "./api/post.js";
import axios from "axios";

function App() {
  const [posts, setPost] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState("");
  const [editBody, setEditBody] = useState("")
  const [editTitle, setEditTitle] = useState("")
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await api.get("/post");
        setPost(response.data);
      } catch (err) {
        if (err.response) {
          // Not in 200 response range
          console.log(err.response.data);
          console.log(err.response.status);
          console.log(err.response.header);
        } else {
          console.log(err.message);
        }
        
      }
    };

    fetchPost();
  }, []);

  useEffect(() => {
    const filteredResult = posts.filter(
      (post) =>
        post.body.toLowerCase().includes(search.toLocaleLowerCase()) ||
        post.title.toLowerCase().includes(search.toLocaleLowerCase())
    );

    setSearchResult(filteredResult.reverse());
  }, [posts, search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
    const datetime = format(new Date(), "MMMM dd, yyyy pp");
    const newPost = { id, title: postTitle, datetime, body: postBody };
    try{
      const response = await api.post('/post', newPost);
      const allPost = [...posts, response.data];
      setPost(allPost);
      setPostTitle("");
      setPostBody("");
      navigate("/");
    }catch(err){
      console.log(err.message);
    }
  };

  // const handleEdit = async (id) => {
  //   const datetime = format(new Date(), "MMMM dd, yyyy pp");
  //   const updatedPost = { id, title: editTitle, datetime, body: editBody };
  //   try{
  //     const response = await axios.put(`/post/${id}`, updatedPost);
  //     setPost(posts.map(post => post.id ? {...response.data} : post))
  //     setEditBody("");
  //     setEditTitle("");
  //     navigate('/')
  //   }catch(err){
  //     console.log(err.message)
  //   }
  // }
  
  const handleEdit = async (id) => {
    const datetime = format(new Date(), 'MMMM dd, yyyy pp');
    const updatedPost = { id, title: editTitle, datetime, body: editBody };
    try {
      const response = await api.put(`/posts/${id}`, updatedPost);
      setPost(posts.map(post => post.id === id ? { ...response.data } : post));
      setEditTitle('');
      setEditBody('');
      navigate('/');
    } catch (err) {
      console.log(`Error: ${err.message}`);
    }
  }

  const handleDelete = async (id) => {
    try{
      await api.delete(`/post/${id}`)
      const postList = posts.filter((post) => post.id !== id);
      setPost(postList);
      navigate("/");
    }catch(err){
      console.log(err.message);
    }
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
          path="/edit/:id"
          element={
            <EditPost
              posts={posts}
              editBody={editBody}
              setEditBody={setEditBody}
              editTitle={editTitle}
              setEditTitle={setEditTitle}
              handleEdit={handleEdit}              
            />
          }
        />

        <Route
          path="/post/:id"
          element={<PostPage posts={posts} handleDelete={handleDelete} />}
        />

        <Route path="/about" element={<About />} />
        <Route path="*" element={<Missing />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
