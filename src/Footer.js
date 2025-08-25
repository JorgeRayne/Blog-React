const Footer = () => {
    const today = new Date();
    console.log(today)
    return (
        <footer>
            <p>Conpyright &copy; {today.getFullYear()}</p>
        </footer>
    );
}

export default Footer;
