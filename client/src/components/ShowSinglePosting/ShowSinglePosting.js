import { useEffect, useState } from 'react';
import { Wrapper, Header, BigLogo, Margin50, GreenButton } from '../../styles/AppStyles.js';
import { PostingWrapper, ImageDiv, DetailsDiv, DetailsText, PriceText, DescriptionDiv, DescriptionText } from './ShowSinglePostingStyles';
import axios from 'axios';
import imgURL from '../Postings/test.jpg'

const ShowSinglePosting = () => {
    const [info, setInfo] = useState('');

    const pathName = window.location.pathname;
    const pathId = pathName.slice(9);

    const getInfo = () => {
        axios.get('/api/postings/posting/'+ pathId)
        .then (response => {
            const info = response.data;
            setInfo(info[0]);
            console.log(info[0]);
        })
        .catch (error => console.error(`Error: ${error}`));
    }

    useEffect(() => {
        getInfo();
    }, []);

    const getDate = (date) => {
        if (date) {
            return date.slice(0, 10);
        }
        return date;
    }

    return (
        <PostingWrapper>
            <Margin50></Margin50>
            <Header> {info.street_num} {info.street_name}, {info.city}, {info.postal_code} </Header>
            <ImageDiv>
                <img className='image' src={imgURL} />
            </ImageDiv>
            <DetailsDiv>
                <PriceText> ${info.price_per_month} / Month </PriceText>
                <DetailsText> {info.total_rooms} Bedrooms + {info.washrooms} Washrooms</DetailsText>
                <DetailsText> Start Date: {getDate(info.start_date)}</DetailsText>
                <DetailsText> End Date: {getDate(info.end_date)}</DetailsText>
                <DetailsText> Term: {info.term} </DetailsText>
                <DetailsText> Number of Rooms Available: {info.rooms_available} </DetailsText>
                <DetailsText> Gender Details: {info.gender_details} </DetailsText>
                <DetailsText> A/C: {info.ac} </DetailsText>
                <DetailsText> Parking: {info.parking} </DetailsText>
                <DetailsText> Laundry: {info.laundry} </DetailsText>
            </DetailsDiv>
            <DescriptionDiv>
                <PriceText> Description </PriceText>
                <DescriptionText> {info.description} </DescriptionText>
            </DescriptionDiv>
        </PostingWrapper>
    );
}

export default ShowSinglePosting;
