import { Link } from "react-router-dom";

const Missing = () => {
    return (
        <main className="Missing">
            <h2>Page not Found</h2>
            <p>Well</p>
            <p>
                 <Link to='/'>Visit oit Home</Link>
            </p>
        </main>
    );
}

export default Missing;
