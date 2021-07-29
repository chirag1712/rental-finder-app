import './Postings.css';

import { useState, useEffect } from 'react';
import axios from 'axios';

import PostingCell from './PostingCell';
import DropDown from './DropDown';

const Postings = () => {

    const [filterInfo, setFilterInfo] = useState({
        sort: null,
        term: null,
        rooms: null,
        gender: null,
        keywords: null,
        page: 0
    });

    const [postings, setPostings] = useState({
        list: [],
        next: true
    });

    const getPostings = async (page) => {
        let data = { ...filterInfo };
        data.page = page;
        setFilterInfo(data)
        try {
            const response = await axios.post('api/postings/index', data);
            setPostings(response.data);
        } catch (err) {
            // console.log(err.response);
        }
    }

    useEffect(() => { getPostings(0); }, []);

    const setFilters = (title, option) => {
        let field = title
        if ('sort by' === field) field = 'sort';

        setFilterInfo({ ...filterInfo, [field]: option });
    }

    const onChange = e => setFilterInfo({ ...filterInfo, keywords: e.target.value })

    const changePage = async (e) => {
        let direction = e.target.id;
        let page = filterInfo.page

        if ('next' === direction && postings.next) page += 1;
        else if ('prev' === direction && page !== 0) page -= 1;
        else return;

        getPostings(page)
    }

    return (
        <div className='container'>
            <div className='filters'>
                <DropDown title='sort by' options={['price', 'popularity']} selected={filterInfo.sort} setSelected={setFilters} />
                <DropDown title='term' options={['fall', 'winter', 'summer']} selected={filterInfo.term} setSelected={setFilters} />
                <DropDown title='rooms' options={['1', '2', '3', '4', '5', '6']} selected={filterInfo.rooms} setSelected={setFilters} />
                <DropDown title='gender' options={['male', 'female', 'co-ed']} selected={filterInfo.gender} setSelected={setFilters} />
                <input className='input' type='search' placeholder='Keywords' onChange={onChange} />
                <button className='btn apply' onClick={e => getPostings(0)}>Apply</button>
            </div>
            <div className='postingGrid'>
                {postings.list.map((p) => <PostingCell key={p.id} id={p.id} imgURL={p.url} address={p.address} price={p.price} />)}
                <div className='paginator'>
                    {postings.list.length > 0 ?
                        <>
                            <button id='prev' className={`btn prev ${filterInfo.page === 0 && 'disable'}`} onClick={changePage}>Previous</button>
                            <button id='next' className={`btn next ${!postings.next && 'disable'}`} onClick={changePage}>Next</button>
                        </> :
                        <h1>No Postings Available</h1>}
                </div>
            </div>
        </div>
    );
}

export default Postings
