import axios from 'axios';
import moment from 'moment';
import { useState } from 'react';
import Link from 'next/link';
import renderHTML from 'react-render-html';
import InfiniteScroll from 'react-infinite-scroller';

const Links = ({
    query,
    category,
    links,
    totalLinks,
    linksLimit,
    linkSkip,
}) => {
    const [allLinks, setAllLinks] = useState(links);
    const [limit, setAllLimit] = useState(linksLimit);
    const [skip, setSkip] = useState(0);
    const [size, setSize] = useState(totalLinks);

    const handleClick = async (linkId) => {
        const response = await axios.put(
            `${process.env.NEXT_PUBLIC_API}/click-count`,
            { linkId }
        );
        loadUpdatedLinks();
    };

    const loadUpdatedLinks = async () => {
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API}/category/${query.slug}`
        );
        setAllLinks(response.data.links);
    };

    const listOfLinks = () =>
        allLinks.map((l, i) => (
            <div key={i} className="row alert alert-primary p-2">
                <div className="col-md-8">
                    <a href={l.url} target="_blank">
                        <h5 className="pt-2">{l.title}</h5>
                        <h6
                            className="pt-2 text-danger"
                            style={{ fontSize: '12px' }}
                        >
                            {l.url}
                        </h6>
                    </a>
                </div>
                <div className="col-md-4 pt-2">
                    <span className="pull-right">
                        {moment(l.createdAt).fromNow()} by {l.postedBy.name}
                    </span>
                </div>
                <div className="col-md-12">
                    <span className="badge text-dark">
                        {l.type} / {l.medium}
                    </span>
                    {l.categories.map((c, i) => (
                        <span key={i} className="badge text-success">
                            {c.name}
                        </span>
                    ))}
                </div>
            </div>
        ));

    const loadMore = async () => {
        let toSkip = skip + limit;
        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API}/category/${query.slug}`,
            { skip: toSkip, limit }
        );
        setAllLinks([...allLinks, ...response.data.links]);
        setSize(response.data.links.length);
        setSkip(toSkip);
    };

    return (
        <>
            <div className="row">
                <div className="col-md-8">
                    <h1 className="display-4 font-weight-bold">
                        {category.name} - URL/Links
                    </h1>
                    <div className="lead alert alert-secondary pt-4">
                        {renderHTML(category.content || '')}
                    </div>
                </div>
                <div className="col-md-4">
                    <img
                        src={category.image.url}
                        alt={category.name}
                        style={{ width: 'auto', maxHeight: '200px' }}
                    />
                </div>
            </div>
            <br />
            <div className="row">
                <div className="col-md-8 text-center">
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={loadMore}
                        hasMore={size > 0 && size >= limit}
                        loader={
                            <img
                                src="/static/images/spinning-loading.gif"
                                alt="loading"
                            />
                        }
                    >
                        {listOfLinks()}
                    </InfiniteScroll>
                </div>
                <div className="col-md-4">
                    <h2 className="lead">Most popular in {category.name}</h2>
                    <p>show popular links</p>
                </div>
            </div>
        </>
    );
};

Links.getInitialProps = async ({ query, req }) => {
    let skip = 0;
    let limit = 2;

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
