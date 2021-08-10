import { useEffect, useState } from 'react';
import {Header, Margin50 } from '../../styles/AppStyles.js';
import { PostingWrapper, ImageDiv, DescriptionWrapper, DetailsDiv,DetailsWrapper, DetailsText, MainInfoDiv, PriceText, DescriptionDiv, DetailsTable, DescriptionText, DetailsCell } from './ShowSinglePostingStyles';
import axios from 'axios';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";

const ShowSinglePosting = () => {
    const [info, setInfo] = useState('');
    const [userInfo, setUserInfo] = useState('');

    const pathName = window.location.pathname;
    const pathId = pathName.slice(9);

    const getInfo = () => {
        axios.get('/api/postings/posting/' + pathId)
        .then(response => {
                const info = response.data;
                setInfo(info);
                console.log(info);
            })
            .catch(error => console.error(`Error: ${error}`));
    }

    const getImages = () => {
        axios.get('/api/users/user/' + info.user_id)
        .then(response => {
                setUserInfo(response.data);
            })
        .catch(error => console.error(`Error: ${error}`));
    }

    const getListImages = () => {
        getImages();
        const images = [];
        if (info.photo_urls != null) {
            for (let i = 0; i < info.photo_urls.length; ++i) {
                images.push({
                    original: info.photo_urls[i],
                    thumbnail: info.photo_urls[i],
                    thumbnailHeight: 50,
                    thumbnailWidth: 30,
                    originalHeight: 300,
                    originalWidth: 300,
                })
            }
        }
        return images;
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
            <ImageGallery items={getListImages()} />
            </ImageDiv>
            <MainInfoDiv>
            <PriceText> ${info.price_per_month} / Month </PriceText>
            <DetailsText> {info.total_rooms} Bedrooms + {info.washrooms} Washrooms</DetailsText>
            <DetailsText> Number of Rooms Available: {info.rooms_available} </DetailsText>
            <PriceText> Contact Details </PriceText>
            <DetailsText> {userInfo.first_name} {userInfo.last_name} </DetailsText>
            <DetailsText> {userInfo.email} </DetailsText>
            </MainInfoDiv>
            <DetailsWrapper>
            <PriceText> Additional Details </PriceText>
            <DetailsDiv>
            <DetailsTable>
                <tr>
                <DetailsCell>
                <DetailsText> Start Date: {getDate(info.start_date)}</DetailsText>
                </DetailsCell>
                <DetailsCell>
                <DetailsText> End Date: {getDate(info.end_date)}</DetailsText>
                </DetailsCell>
                </tr>
                <tr>
                <DetailsCell>
                <DetailsText> Term: {getTerm(info.term)} </DetailsText>
                </DetailsCell>
                <DetailsCell>
                <DetailsText> Gender Details: {firstLetterUpper(info.gender_details)} </DetailsText>
                </DetailsCell>
                </tr>
                <tr>
                <DetailsCell>
                <DetailsText> A/C: {convertBoolean(info.ac)} </DetailsText>
                </DetailsCell>
                <DetailsCell>
                <DetailsText> Wifi: {convertBoolean(info.wifi)} </DetailsText>
                </DetailsCell>
                </tr>
                <tr>
                <DetailsCell>
                <DetailsText> Parking: {convertBoolean(info.parking)} </DetailsText>
                </DetailsCell>
                <DetailsCell>
                <DetailsText> Laundry: {getLaundry(info.laundry)} </DetailsText>
                </DetailsCell>
                </tr>
            </DetailsTable>
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
