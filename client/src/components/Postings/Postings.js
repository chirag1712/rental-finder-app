import './Postings.css';
import imgURL from './test.jpg';

import { useState } from 'react';
import axios from 'axios';

import PostingCell from './PostingCell';
import DropDown from './DropDown';

const Postings = () => {

    const [filterInfo, setFilterInfo] = useState({
        sort: null,
        term: null,
        rooms: null,
        gender: null,
        keyword: null
    });

    const [page, setPage] = useState(1)

    const setFilters = (title, option) => {
        setFilterInfo({ ...filterInfo, [title.toLowerCase()]: option });
        console.log(filterInfo);
    }

    const onChange = e => setFilterInfo({ ...filterInfo, keyword: e.target.value })

    return (
        <div className='container'>
            <div className='filters'>
                <DropDown title='Sort By' options={['Price', 'Popularity']} selected={filterInfo.sort} setSelected={setFilters} />
                <DropDown title='Term' options={['Fall', 'Winter', 'Summer']} selected={filterInfo.term} setSelected={setFilters} />
                <DropDown title='Rooms' options={['1', '2', '3', '4', '5', '6']} selected={filterInfo.rooms} setSelected={setFilters} />
                <DropDown title='Gender' options={['Male', 'Female', 'Co-ed']} selected={filterInfo.gender} setSelected={setFilters} />
                <input className='input' type='search' placeholder='Keyword' onChange={onChange} />
                <button className='btn apply'>Apply</button>
            </div>
            <div className='postingGrid'>
                <PostingCell id='1' imgURL={imgURL} address='130 University Avenue West' price='1500' />
                <PostingCell id='1' imgURL={imgURL} address='address' price='1500' />
                <PostingCell id='1' imgURL={imgURL} address='address' price='1500' />
                <PostingCell id='1' imgURL={imgURL} address='address' price='1500' />
                <PostingCell id='1' imgURL={imgURL} address='address' price='1500' />
                <PostingCell id='1' imgURL={imgURL} address='address' price='1500' />
                <PostingCell id='1' imgURL={imgURL} address='address' price='1500' />
                <PostingCell id='1' imgURL={imgURL} address='address' price='1500' />
                <div className='paginator'>
                    <button className='btn prev disable'>Previous</button>
                    <button className='btn next'>Next</button>
                </div>
            </div>
        </div>
    );
}

export default Postings
