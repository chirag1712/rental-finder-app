import './Postings.css';
import imgURL from './test.jpg';

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

    const getPostings = async () => {
        let data = { ...filterInfo };
        // console.log(data);
        try {
            const response = await axios.post('api/postings/index', data);
            setPostings(response.data);
        } catch (err) {
            // console.log(err.response);
        }
    }

    useEffect(() => { getPostings(); }, []);

    const setFilters = (title, option) => {
        let field = title
        if ('sort by' === field) field = 'sort';

        setFilterInfo({ ...filterInfo, [field]: option });
    }

    const onChange = e => setFilterInfo({ ...filterInfo, keyword: e.target.value })

    const changePage = async (e) => {
        let pg = e.target.id;
        let data = { ...filterInfo };

        if ('next' === pg && postings.next) data.page += 1;
        else if ('prev' === pg && data.page !== 0) data.page -= 1;
        else return;

        setFilterInfo(data)
        try {
            const response = await axios.post('api/postings/index', data);
            setPostings(response.data);
        } catch (err) {
            // console.log(err.response);
        }
    }

    return (
        <div className='container'>
            <div className='filters'>
                <DropDown title='sort by' options={['price', 'popularity']} selected={filterInfo.sort} setSelected={setFilters} />
                <DropDown title='term' options={['fall', 'winter', 'summer']} selected={filterInfo.term} setSelected={setFilters} />
                <DropDown title='rooms' options={['1', '2', '3', '4', '5', '6']} selected={filterInfo.rooms} setSelected={setFilters} />
                <DropDown title='gender' options={['male', 'female', 'co-ed']} selected={filterInfo.gender} setSelected={setFilters} />
                <input className='input' type='search' placeholder='Keywords' onChange={onChange} />
                <button className='btn apply' onClick={getPostings}>Apply</button>
            </div>
            <div className='postingGrid'>
                {postings.list.map((p) => <PostingCell key={p.id} id={p.id} imgURL={imgURL} address={p.address} price={p.price} />)}
                <div className='paginator'>
                    {postings.list.length > 0 ?
                        <>
                            <button id='prev' className={`btn prev ${filterInfo.page === 0 && 'disable'}`} onClick={changePage}>Previous</button>
                            <button id='next' className={`btn next ${!postings.next && 'disable'}`} onClick={changePage}>Next</button>
                        </> :
                        <h1>No Postings Available for the Given Filters</h1>}
                </div>
            </div>
        </div>
    );
}

export default Postings
