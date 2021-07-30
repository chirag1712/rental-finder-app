import { useEffect, useState } from 'react';
import {Header, Margin50 } from '../../styles/AppStyles.js';
import { PostingWrapper, ImageDiv, DescriptionWrapper, DetailsDiv,DetailsWrapper, DetailsTextBold, DetailsText, MainInfoDiv, PriceText, DescriptionDiv, DescriptionText } from './ShowSinglePostingStyles';
import axios from 'axios';
import defaultImg from '../../images/HonkForSubletLogo.png';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";


const ShowSinglePosting = () => {
    const [info, setInfo] = useState('');
    const [userInfo, setUserInfo] = useState('');
    const images = [];

    const pathName = window.location.pathname;
    const pathId = pathName.slice(9);

    const getInfo = () => {
        axios.get('/api/postings/posting/' + pathId)
        .then(response => {
                const info = response.data;
                setInfo(info);
            })
            .catch(error => console.error(`Error: ${error}`));
    }

    const getUserInfo = () => {
        axios.get('/api/users/user/' + info.user_id)
        .then(response => {
                const userInfo = response.data;
                setUserInfo(userInfo);
                console.log(userInfo);
            })
            .catch(error => console.error(`Error: ${error}`));
    }

    for (let i = 0; i < info.photo_urls.length; ++i) {
        images.push({
            original: info.photo_urls[i],
            thumbnail: info.photo_urls[i],
            thumbnailHeight: 50,
            thumbnailWidth: 100,
            originalHeight: 300,
            originalWidth: 300
        })
    }
    console.log(images);

    useEffect(() => {
        getInfo();
        getUserInfo();
    }, []);

    const getDate = (date) => {
        if (date) {
            return date.slice(0, 10);
        }
        return date;
    }

    const convertBoolean = (num) => {
        if (num === 0) {
            return "Not Included"
        }
        return "Included";
    }

    const getLaundry = (str) => {
        if (str === "same-floor") {
            return "Same Floor"
        } else if (str === "common") {
            return "In the Building";
        } else if (str === "ensuite") {
            return "In the Suite";
        }
        return "Not Available";
    }

    const firstLetterUpper = (str) => {
        if (str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        } else {
            return " ";
        }
    }

    const splitUpper = (str) => {
        let newStr = "";
        var termsArr = str.split(",");
        for (var i = 0; i < termsArr.length; ++i) {
            newStr += termsArr[i].charAt(0).toUpperCase() + termsArr[i].slice(1);
            if (i < termsArr.length - 1) {
                newStr += ', ';
            }
        }
        return newStr;
    }

    const getTerm = (str) => {
        if (!str) {
            return "";
        }
        if (str.includes(',')) {
            return splitUpper(str);
        } else {
            return firstLetterUpper(str);
        }
    }

    return (
        <PostingWrapper>
            <Margin50></Margin50>
            <Header> {info.street_num} {info.street_name}, {info.city}, {info.postal_code} </Header>
            <ImageDiv>
            <ImageGallery items={images} />
            </ImageDiv>
            <MainInfoDiv>
            <PriceText> ${info.price_per_month} / Month </PriceText>
            <DetailsText> {info.total_rooms} Bedrooms + {info.washrooms} Washrooms</DetailsText>
            <DetailsText> Number of Rooms Available: {info.rooms_available} </DetailsText>
            <br></br>
            <DetailsTextBold> Contact Details </DetailsTextBold>
            <DetailsText> {userInfo.first_name} {userInfo.last_name} </DetailsText>
            <DetailsText> {userInfo.email} </DetailsText>
            </MainInfoDiv>
            <DetailsWrapper>
            <PriceText> Additional Details </PriceText>
            <DetailsDiv>
                <DetailsText> Start Date: {getDate(info.start_date)}</DetailsText>
                <DetailsText> End Date: {getDate(info.end_date)}</DetailsText>
                <DetailsText> Term: {getTerm(info.term)} </DetailsText>
                <DetailsText> Gender Details: {firstLetterUpper(info.gender_details)} </DetailsText>
                <DetailsText> A/C: {convertBoolean(info.ac)} </DetailsText>
                <DetailsText> Parking: {convertBoolean(info.parking)} </DetailsText>
                <DetailsText> Wifi: {convertBoolean(info.wifi)} </DetailsText>
                <DetailsText> Laundry: {getLaundry(info.laundry)} </DetailsText>
            </DetailsDiv>
            </DetailsWrapper>
             <DescriptionDiv>
                <PriceText> Description </PriceText>
                <DescriptionText> {info.description} </DescriptionText>
                </DescriptionDiv>
            <DescriptionWrapper>
            </DescriptionWrapper>
        </PostingWrapper>
    );
}

export default ShowSinglePosting;
