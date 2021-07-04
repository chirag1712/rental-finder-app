import { useState } from 'react';
import { Wrapper, Header, BigLogo, Margin50, GreenButton } from '../../styles/AppStyles.js';
import { PostingWrapper, ImageDiv, UserInfoDiv, UserText, DetailsDiv, DetailsText, PriceText, DescriptionDiv} from './ShowSinglePostingStyles';
import { useHistory } from "react-router-dom";

import imgURL from '../../images/HonkForSubletLogo.png'

const ShowSinglePosting = (user_id) => {
    const getSinglePosting = async (page) => {
        let data = [];
        data.page = page
    }

    return (
        <PostingWrapper>
            <Margin50></Margin50>
            <Header> Address </Header>
            <ImageDiv>
                <img className='image' src={imgURL} />
            </ImageDiv>
            <UserInfoDiv>
                <UserText> Name </UserText>
                <UserText> Email </UserText>
            </UserInfoDiv>
            <DetailsDiv>
                <PriceText> $ Price / Month </PriceText>
                <DetailsText> # Bedrooms + # Washrooms</DetailsText>
                <DetailsText> Start Date: </DetailsText>
                <DetailsText> End Date: </DetailsText>
                <DetailsText> Term: </DetailsText>
                <DetailsText> Number of Rooms Available:  </DetailsText>
                <DetailsText> Gender Details:  </DetailsText>
                <DetailsText> A/C:  </DetailsText>
                <DetailsText> Parking:  </DetailsText>
                <DetailsText> Laundry:  </DetailsText>
            </DetailsDiv>
            <DescriptionDiv>
            <PriceText> Description </PriceText>
            <DetailsText> Description </DetailsText>
            </DescriptionDiv>
        </PostingWrapper>
    );
}

export default ShowSinglePosting;
