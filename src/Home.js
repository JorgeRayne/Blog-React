import Feed from "./Feed";

const Home = ({post}) => {
    return (
        <main className="Home">
            {post.length ? (
                <Feed posts={post} />
            ) : (
                <p style={{marginTop: "2rem"}}>
                    No Post to display.
                </p>
            )}
        </main>
    );
}

export default Home;
