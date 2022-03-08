import Head from "next/head";
import Link from "next/link";
import NextNProgress from "nextjs-progressbar";
import { isAuth, logout } from "../helpers/auth";

const Layout = ({ children }) => {
  const head = () => (
    <>
      <link
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css"
        rel="stylesheet"
        integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3"
        crossOrigin="anonymous"
      />
    </>
  );

  const nav = () => (
    <ul className="nav nav-tabs bg-warning">
      <li className="nav-item">
        <Link href="/" passHref>
          <a className="nav-link text-dark">Home</a>
        </Link>
      </li>

      <li className="nav-item">
        <Link href="/user/link/create" passHref>
          <a
            className="nav-link text-dark btn btn-success"
            style={{ borderRadius: "0px" }}
          >
            Submit a link
          </a>
        </Link>
      </li>

      {!isAuth() && (
        <>
          <li className="nav-item">
            <Link href="/login" passHref>
              <a className="nav-link text-dark">Login</a>
            </Link>
          </li>
          <li className="nav-item">
            <Link href="/register" passHref>
              <a className="nav-link text-dark">Register</a>
            </Link>
          </li>
        </>
      )}

      {isAuth() && isAuth().role === "admin" && (
        <li className="nav-item ml-auto">
          <Link href="/admin" passHref>
            <a className="nav-link text-dark">{isAuth().name}</a>
          </Link>
        </li>
      )}

      {isAuth() && isAuth().role === "subscriber" && (
        <li className="nav-item ml-auto">
          <Link href="/user" passHref>
            <a className="nav-link text-dark">{isAuth().name}</a>
          </Link>
        </li>
      )}

      {isAuth() && (
        <li className="nav-item">
          <a onClick={logout} className="nav-link text-dark">
            Logout
          </a>
        </li>
      )}
    </ul>
  );
  return (
    <>
      <NextNProgress color="#16ab43" height={3} />
      {head()} {nav()} <div className="container pt-5 pb-5">{children}</div>
    </>
  );
};

export default Layout;
