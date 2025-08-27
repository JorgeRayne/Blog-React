import Feed from "./Feed";

const Home = ({post, fetchError, isLoading}) => {
    return (
        // <main className="Home">
        //     {post.length ? (
        //         <Feed posts={post} />
        //     ) : (
        //         <p style={{marginTop: "2rem"}}>
        //             No Post to display.
        //         </p>
        //     )}
        // </main>
        
        <main className="Home">
            {isLoading && <p className="statusMsg">Loading Post</p>}
            {fetchError && <p className="statusMsg" style={{color:"red"}}>{fetchError}</p>}
            {!isLoading && !fetchError && 
                (post.length ? (
                <Feed posts={post} />
            ) : (
                <p style={{marginTop: "2rem"}}>
                    No Post to display.
                </p>
            ))
            }
        </main>
    );
}

export default Home;
