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
import useWindowSize from "./hooks/useWindowSize.js";
import useAxiosFetch from "./hooks/useAxiosFecth.js";

function App() {
  const [posts, setPost] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState("");
  const [editBody, setEditBody] = useState("")
  const [editTitle, setEditTitle] = useState("")
  const navigate = useNavigate();
  const { width } = useWindowSize();

  const {data, fetchError, isLoading} = useAxiosFetch('http://localhost:3500/post');

  // useEffect(() => {
  //   const fetchPost = async () => {
  //     try {
  //       const response = await api.get("/post");
  //       setPost(response.data);
  //     } catch (err) {
  //       if (err.response) {
  //         // Not in 200 response range
  //         console.log(err.response.data);
  //         console.log(err.response.status);
  //         console.log(err.response.header);
  //       } else {
  //         console.log(err.message);
  //       }
  //     }
  //   };

  //   fetchPost();
  // }, []);

  useEffect(() => {
    setPost(data)
  },[data])
  
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
  
  const handleEdit = async (id) => {
    const datetime = format(new Date(), 'MMMM dd, yyyy pp');
    const updatedPost = { id, title: editTitle, datetime, body: editBody };
    try {
      const response = await api.put(`/post/${id}`, updatedPost);
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
      <Header title="Blog"  width={width}/>
      <Nav search={search} setSearch={setSearch} />
      <Routes>
        <Route path="/" element={<Home 
          post={searchResult}
          fetchError={fetchError}
          isLoading={isLoading}
          />}
        />

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
