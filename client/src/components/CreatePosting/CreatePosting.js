import { useState, useRef, useEffect } from 'react';
import Input from '../Landing/Input.js'
import { Wrapper, Header, BigLogo, Margin50, GreenButton } from '../../styles/AppStyles.js';
import { WhiteBox, SelectBox, TextArea, Label, WrapperDiv } from './CreatePostingStyles.js';
import logo from '../../images/HonkForSubletLogo.png'
import axios from 'axios';
import { useAuth } from '../../useAuth';

const CreatePosting = () => {
    const auth = useAuth();
    const header = useRef(null);
    const [form, setForm] = useState({ user_id: auth.user.id });
    const [errors, setErrors] = useState({
        start_date: null,
        end_date: null,
        price_per_month: null,
        city: null,
        street_name: null,
        street_num: null,
        postal_code: null
    });

    useEffect(() => {
        const err = {};
        err.start_date = form.start_date ? null : 'required';
        err.end_date = form.end_date ? null : 'required';
        err.price_per_month = form.price_per_month ? null : 'required';
        err.city = form.city ? null : 'required';
        err.street_name = form.street_name ? null : 'required';
        err.street_num = form.street_num ? null : 'required';
        err.postal_code = form.postal_code ? null : 'required';
        setErrors(err);
    }, [form]);

    const getAddress = async () => {
        const { city, street_name, street_num } = form;
        if (city && street_name && street_num) {
            try {
                const res = await axios.get(encodeURI(
                    `api/address/${city}/${street_name}/${street_num}`
                ));
                return {
                    city: res.data.city,
                    postal_code: res.data.postal_code,
                    street_name: res.data.street_name,
                    street_num: res.data.street_num
                };
            } catch (err) {
                console.error(err);
            }
        }
    }
    const fillAddress = async () => {
        const address = await getAddress();
        setForm(old => ({ ...old, ...address }));
    };

    const handleChange = (name, value) => {
        setForm(old => ({ ...old, [name]: value }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (Object.values(errors).some(err => err)) {
            header.current.scrollIntoView();
            return;
        }
        const address = await getAddress();
        var files = document.getElementById('fileItem').files;
        const data = new FormData();
        for (const field in form) {
            data.append(field, form[field]);
        }
        for (const field in address) {
            data.set(field, address[field]);
        }
        for (let i = 0; i < files.length; i++) {
            data.append(i, files[i]);
        }

        const config = {
            headers: { 'content-type': 'multipart/form-data' }
        }

        try {
            const response = await axios.post('api/postings/create', data, config);
            alert('Successfully Made a Posting!');
            // console.log(response.data);
        } catch (err) {
            alert('Error!');
            // console.log(err.response.data);
        }
    }

    return (
        <Wrapper>
            <WrapperDiv>
                <WhiteBox>
                    <Margin50></Margin50>
                    <BigLogo src={logo}></BigLogo>
                    <Header ref={header}> Create Posting! </Header>
                    <Margin50></Margin50>

                    <form action="" onSubmit={handleSubmit}>
                        <Input name='street_num' type='number' placeHolder='Street Number'
                            value={form.street_num ?? ''}
                            onChange={e => { handleChange('street_num', e.target.value); }}/>
                        {errors.street_num && <span className="error">{errors.street_num}</span>}
                        <br></br>
                        <Input name='street_name' type='text' placeHolder='Street Name'
                            value={form.street_name ?? ''}
                            onChange={e => { handleChange('street_name', e.target.value); }}/>
                        {errors.street_name && <span className="error">{errors.street_name}</span>}
                        <br></br>
                        <Input name='city' type='text' placeHolder='City'
                            value={form.city ?? ''}
                            onChange={e => { handleChange('city', e.target.value); }}/>
                        {errors.city && <span className="error">{errors.city}</span>}
                        <br></br>
                        <Input name='postal_code' type='text' placeHolder='Postal Code'
                            value={form.postal_code ?? ''}
                            onChange={e => { handleChange('postal_code', e.target.value); }}/>
                        {errors.postal_code && <span className="error">{errors.postal_code}</span>}
                        <button type='button' onClick={fillAddress}>Look up postal code</button>
                        <WrapperDiv>
                            <SelectBox name="term" id="term"
                                value={form.term ?? ''}
                                onChange={e => { handleChange('term', e.target.value); }}>
                                <option value="" disabled>Choose Your Term</option>
                                <option value="fall">Fall</option>
                                <option value="winter">Winter</option>
                                <option value="spring">Spring</option>
                            </SelectBox>
                        </WrapperDiv>
                        <Label htmlFor="start_date">Start Date: </Label>
                        <input type="date" id="start" name="start_date"
                            min="2021-05-01" max="2022-08-31"
                            value={form.start_date ?? ''}
                            onChange={e => { handleChange('start_date', e.target.value); }}/>
                            {errors.start_date && <span className="error">{errors.start_date}</span>}
                        <br></br>
                        <Label htmlFor="end_date">End Date: </Label>
                        <input type="date" id="end" name="end_date"
                            min="2021-05-01" max="2022-08-31"
                            value={form.end_date ?? ''}
                            onChange={e => { handleChange('end_date', e.target.value); }}/>
                            {errors.end_date && <span className="error">{errors.end_date}</span>}
                        <br></br>

                        <Input name='price_per_month' type='number' placeHolder='Price Per Month'
                            value={form.price_per_month ?? ''}
                            onChange={e => { handleChange('price_per_month', e.target.value); }}/>
                            {errors.price_per_month && <span className="error">{errors.price_per_month}</span>}
                        <WrapperDiv>
                            <SelectBox name="gender_details" id="gender_details"
                            value={form.gender_details ?? ''}
                            onChange={e => { handleChange('gender_details', e.target.value); }}>
                                <option value="" disabled>Who Can Live Here?</option>
                                <option value="female">Female</option>
                                <option value="male">Male</option>
                                <option value="co-ed">Co-ed</option>
                            </SelectBox>
                        </WrapperDiv>
                        <Input name='rooms_available' type='number' placeHolder='Number of Rooms Available'
                            value={form.rooms_available ?? ''}
                            onChange={e => { handleChange('rooms_available', e.target.value); }}/>
                        <br></br>
                        <Input name='total_rooms' type='number' placeHolder='Number of Rooms Total'
                            value={form.total_rooms ?? ''}
                            onChange={e => { handleChange('total_rooms', e.target.value); }}/>
                        <br></br>

                        <WrapperDiv>
                            <SelectBox name="ac" id="ac"
                            value={form.ac ?? ''}
                            onChange={e => { handleChange('ac', e.target.value); }}>
                                <option value="" disabled>Is there A/C</option>
                                <option value={true}>Yes</option>
                                <option value={false}>No</option>
                            </SelectBox>
                        </WrapperDiv>
                        <Input name='washrooms' type='number' placeHolder='Total Number of Washrooms'
                            value={form.washrooms ?? ''}
                            onChange={e => { handleChange('washrooms', e.target.value); }}/>
                        <br></br>
                        <WrapperDiv>
                            <SelectBox name="wifi" id="wifi"
                                value={form.wifi ?? ''}
                                onChange={e => { handleChange('wifi', e.target.value); }}>
                                <option value="" disabled>Wifi Options</option>
                                <option value="true" >Included</option>
                                <option value="false">Not Included</option>
                            </SelectBox>
                        </WrapperDiv>
                        <WrapperDiv>
                            <SelectBox name="parking" id="parking"
                                value={form.parking ?? ''}
                                onChange={e => { handleChange('parking', e.target.value); }}>
                                <option value="" disabled>Is there Parking?</option>
                                <option value="true">Included</option>
                                <option value="false">Not Included</option>
                            </SelectBox>
                        </WrapperDiv>
                        <WrapperDiv>
                            <SelectBox name="laundry" id="laundry"
                                value={form.laundry ?? ''}
                                onChange={e => { handleChange('laundry', e.target.value); }}>
                                <option value="" disabled>Laundry Options</option>
                                <option value="same-floor">Same Floor</option>
                                <option value="common">In the Building</option>
                                <option value="ensuite">In Suite</option>
                                <option value="unavailable">No Laundry</option>
                            </SelectBox>
                        </WrapperDiv>
                        <TextArea rows="5" cols="60" name="description" placeholder="Enter Description Here..."
                                value={form.description ?? ''}
                                onChange={e => { handleChange('description', e.target.value); }}/>
                        <input id="fileItem" type="file" accept="image/*" multiple></input>
                        <Margin50></Margin50>
                        <GreenButton type="submit" value="submit"> Submit </GreenButton>
                    </form>
                    <Margin50></Margin50>
                </WhiteBox>
            </WrapperDiv>
        </Wrapper>
    );
}

export default CreatePosting;
