const Layout = () => {
    const nav = () => (
        <ul className="nav">
            <li className="nav-item">
                <a href="">Home</a>
            </li>
            <li className="nav-item">
                <a href="">Login</a>
            </li>
            <li className="nav-item">
                <a href="">Register</a>
            </li>
        </ul>
    );
    return <>{nav()}</>;
};
