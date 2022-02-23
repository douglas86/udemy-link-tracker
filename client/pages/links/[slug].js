import axios from "axios";
import Link from "next/link";

const Links = ({
  query,
  category,
  links,
  totalLinks,
  linksLimit,
  linkSkip,
}) => {
  console.log("category", category);
  console.log("links", JSON.stringify(links));
  return (
    <div className="row">
      <div className="col-md-8">{JSON.stringify(links)}</div>
      <div className="col-md-4">right sidebar</div>
    </div>
  );
};

Links.getInitialProps = async ({ query, req }) => {
  let skip = 0;
  let limit = 5;

  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API}/category/${query.slug}`,
    { skip, limit }
  );
  return {
    query,
    category: response.data.category,
    links: response.data.links,
    totalLinks: response.data.links.length,
    linksLimit: limit,
    linkSkip: skip,
  };
};

export default Links;
