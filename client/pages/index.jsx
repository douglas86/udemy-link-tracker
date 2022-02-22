import axios from "axios";
import Link from "next/link";

const Home = ({ categories }) => {
  const listCategories = categories.map((c, i) => (
    <Link href="/" key={i}>
      <a style={{ border: "1px solid red" }} className="bg-light p-3 col-md-4">
        <div>
          <div className="row">
            <div className="col-md-4">
              <img
                src={c.image && c.image.url}
                alt={c.name}
                style={{ width: "100px", height: "auto" }}
                className="pr-3"
              />
            </div>
            <div className="col-md-8">
              <h3>{c.name}</h3>
            </div>
          </div>
        </div>
      </a>
    </Link>
  ));

  return (
    <>
      <div className="row">
        <div className="col-md-12">
          <h1 className="font-weight-bold">Browse Tutorial/Courses</h1>
          <br />
        </div>
      </div>
      <div className="row">{listCategories}</div>
    </>
  );
};

Home.getInitialProps = async () => {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API}/categories`);
  return {
    categories: response.data,
  };
};

export default Home;
