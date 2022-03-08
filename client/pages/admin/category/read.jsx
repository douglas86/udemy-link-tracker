import { useState, useEffect } from 'react';
import axios from 'axios';
import withAdmin from '../../withAdmin';
import { showSuccessMessage, showErrorMessage } from '../../../helpers/alerts';
import Link from 'next/link';

const Read = ({ user, token }) => {
    const [state, setState] = useState({
        error: '',
        success: '',
        categories: [],
    });

    const { error, success, categories } = state;

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API}/categories`
        );
        setState({ ...state, categories: response.data });
    };

    const confirmDelete = (e, slug) => {
        e.preventDefault();
        // console.log('slug', slug);
        let answer = window.confirm('Are you sure you want to delete');
        if (answer) {
            handleDelete(slug);
        }
    };

    const handleDelete = async (slug) => {
        try {
            const response = axios.delete(
                `${process.env.NEXT_PUBLIC_API}/category/${slug}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log('Category delete success', response);
            loadCategories();
            window.location.reload(false);
        } catch (error) {
            console.log('category delete', err);
        }
    };

    const listCategories = () =>
        categories.map((c, i) => (
            <Link href={`/links/${c.slug}`} key={i} passHref>
                <a
                    style={{ border: '1px solid red' }}
                    className="bg-light p-3 col-md-4"
                >
                    <div>
                        <div className="row">
                            <div className="col-md-3">
                                <img
                                    src={c.image && c.image.url}
                                    alt={c.name}
                                    style={{ width: '100px', height: 'auto' }}
                                    className="pr-3"
                                />
                            </div>
                            <div className="col-md-6">
                                <h3>{c.name}</h3>
                            </div>
                            <div className="col-md-3">
                                <Link
                                    href={`/admin/category/${c.slug}`}
                                    passHref
                                >
                                    <button className="btn btn-sm btn-outline-success btn-block mb-1">
                                        Update
                                    </button>
                                </Link>
                                <button
                                    onClick={(e) => confirmDelete(e, c.slug)}
                                    className="btn btn-sm btn-outline-danger btn-block mb-1"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </a>
            </Link>
        ));

    return (
        <div className="row">
            <div className="col">
                <h1>List of categories</h1>
                <br />
            </div>
            <div className="row">{listCategories()}</div>
        </div>
    );
};

export default withAdmin(Read);
