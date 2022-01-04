import Head from 'next/head';

const Layout = ({ children }) => {
    const head = () => (
        <link
            href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
            rel="stylesheet"
            integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
            crossorigin="anonymous"
        />
    );

    const nav = () => (
        <ul className="nav nav-tabs bg-warning">
            <li className="nav-item">
                <a className="nav-link text-dark" href="">
                    Home
                </a>
            </li>
            <li className="nav-item">
                <a className="nav-link text-dark" href="">
                    Login
                </a>
            </li>
            <li className="nav-item">
                <a className="nav-link text-dark" href="">
                    Register
                </a>
            </li>
        </ul>
    );
    return (
        <>
            {head()} {nav()}{' '}
            <div className="container pt-5 pb-5">{children}</div>
        </>
    );
};

export default Layout;
