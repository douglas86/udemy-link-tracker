import axios from 'axios';
import moment from 'moment';
import { useState } from 'react';
import renderHTML from 'react-render-html';
import InfiniteScroll from 'react-infinite-scroller';
import withAdmin from '../../withAdmin';
import { getCookie } from '../../../helpers/auth';

const Links = ({ links, totalLinks, linksLimit, linkSkip, token }) => {
    const [allLinks, setAllLinks] = useState(links);
    const [limit, setAllLimit] = useState(linksLimit);
    const [skip, setSkip] = useState(0);
    const [size, setSize] = useState(totalLinks);

    const listOfLinks = () =>
        allLinks.map((l, i) => (
            <div key={i} className="row alert alert-primary p-2">
                <div className="col-md-8" onClick={(e) => handleClick(l._id)}>
                    <a href={`/${l.url}`} target="_blank">
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
                    <p style={{ float: 'right' }}>{l.clicks} clicks</p>
                </div>
            </div>
        ));

    const loadMore = async () => {
        let toSkip = skip + limit;

        const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API}/links`,
            { skip, limit },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        setAllLinks([...allLinks, ...response.data]);
        setSize(response.data.length);
        setSkip(toSkip);
    };

    return (
        <>
            <div className="row">
                <div className="col-md-12">
                    <h1 className="display-4 font-weight-bold">All Links</h1>
                </div>
            </div>
            <br />
            <div className="row">
                <div className="col-md-12">
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={loadMore}
                        hasMore={size > 0 && size >= limit}
                        loader={
                            <img
                                key={0}
                                src="/static/images/spinning-loading.gif"
                                alt="loading"
                            />
                        }
                    >
                        {listOfLinks()}
                    </InfiniteScroll>
                </div>
            </div>
        </>
    );
};

Links.getInitialProps = async ({ req }) => {
    let skip = 0;
    let limit = 2;
    const token = getCookie('token', req);

    const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API}/links`,
        { skip, limit },
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    return {
        links: response.data,
        totalLinks: response.data.length,
        linksLimit: limit,
        linkSkip: skip,
        token,
    };
};

export default withAdmin(Links);
