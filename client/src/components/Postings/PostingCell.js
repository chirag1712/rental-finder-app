import './Postings.css';
import defaultImg from '../../images/HonkForSubletLogo.png';

import { useHistory } from "react-router-dom";

const PostingCell = ({ id, imgURL, address, price }) => {
    const history = useHistory();

    const openPosting = () => { history.push(`/Posting/${id}`) }

    return (
        <div className='cell' onClick={openPosting}>
            <img className='image' src={imgURL==null ? defaultImg : imgURL} />
            <h6 className='address'>{address}</h6>
            <h6 className='price'>{`$${price}/month`}</h6>
        </div>
    );
}

export default PostingCell
