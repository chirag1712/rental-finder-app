const moment = require('moment');
const { Posting, Address, AddressOf } = require("../models/posting.model.js");
const Photo = require("../models/photo.model.js");
const uploadToS3 = require("../models/s3.js");

//express validator
const { check, validationResult } = require("express-validator");

const createPostingValidation = [
	check("user_id", "User ID Is Required").not().isEmpty(),
	check("user_id", "User ID should be an Int").isInt(),
  
	check("term", "Term Is Required").not().isEmpty(),
	check("term", "Term should be Alphabets only").isAlpha(),
	
	check("start_date", "Start date is required").not().isEmpty(),
	check("start_date", "Start date is a date").isDate(),
  
	check("end_date", "End date is required").not().isEmpty(),
	check("end_date", "End date is a date").isDate(),
  
	check("price_per_month", "Price per month is required").not().isEmpty(),
	check("price_per_month", "Price per month should be positive").isInt({ min : 0}),
  
	check("gender_details", "Gender details are Required").not().isEmpty(),
	check("gender_details", "Gender details should be ASCII chars only").isAscii(),
	  
	// check("total_rooms", "Total rooms is required").not().isEmpty(),
	check("total_rooms", "Total rooms should be positive").isInt({ min : 0}),

	// check("rooms_available", "Rooms available is required").not().isEmpty(),
	check("rooms_available", "Rooms available should be positive").isInt({ min : 0}),
	check("rooms_available", "Rooms available should be less than equal to total rooms").isInt({max : total_rooms}),
	
	// check("washrooms", "Washrooms is required").not().isEmpty(),
	check("washrooms", "Washrooms should be positive").isInt({ min : 0}),
  
	// check("laundry", "Laundry is Required").not().isEmpty(),
	check("laundry", "Laundry should be Alphabets only").isAlpha(),
  
	// check("description", "Description is Required").not().isEmpty(),
	
	check("created_at", "Created at is Required").not().isEmpty(),
  
	check("updated_at", "Updated at is Required").not().isEmpty(),
  ];


const format = str => {
    if ('true' === str) return true
    if ('false' === str) return false
    if (!str) return null
}

// Create a new posting
const create = async (request, response) => {
    // Validate request
    if (!request.body) {
        return response.status(400).send({
            message: "Content can not be empty!",
        });
    }

    // Create a Posting
    const posting = new Posting({
        user_id: request.body.user_id,
        term: request.body.term,
        start_date: request.body.start_date,
        end_date: request.body.end_date,
        pop: 0,
        price_per_month: request.body.price_per_month,
        gender_details: request.body.gender_details,
        rooms_available: request.body.rooms_available,
        total_rooms: request.body.total_rooms,
        washrooms: request.body.washrooms,
        ac: format(request.body.ac),
        parking: format(request.body.parking),
        wifi: format(request.body.wifi),
        laundry: request.body.laundry,
        description: request.body.description,
        created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
        updated_at: moment().format('YYYY-MM-DD HH:mm:ss'),
    });

    // Create a Address (only if it doesn't exist)
    const address = new Address({
        street_num: request.body.street_num,
        street_name: request.body.street_name,
        city: request.body.city,
        postal_code: request.body.postal_code,
        building_name: request.body.building_name,
    });

    try {
        // validate that user exists in the db
        console.log(request.body);
        const user = await Posting.userCheck(request.body.user_id)
        if (!user) {
            return response.status(404).json({ error: "User doesn't exist." });
        }

		//check if 3 postings already


        // Save Posting in the database
        const newPosting = await Posting.create(posting);

        // Address handling for the new posting
        const foundAddress = await Address.search(address);
        if (foundAddress[0]) {
            const addressOf = new AddressOf({
                posting_id: newPosting.posting_id,
                address_id: foundAddress[0].address_id,
            });
            AddressOf.create(addressOf);
        } else {
            const newAddress = await Address.create(address);
            const addressOf = new AddressOf({
                posting_id: newPosting.posting_id,
                address_id: newAddress.address_id,
            });
            AddressOf.create(addressOf);
        }

        // posting photos handling
        const files = request.files ? request.files : [];
        const s3FileUrl = process.env.AWS_UPLOADED_FILE_URL_LINK;

        const photo_ids = [];
        const uploadPromises = files.map(async (file) => {
            var key = "posting_" + newPosting.posting_id + "_" + new Date().toISOString() + "_" + file.originalname;
            const data = await uploadToS3(key, file);
            if (!data) {
                return response.status(401).json({ error: "Photo upload to s3 failed" });
            }

            // add image url to db
            const photo = new Photo({
                posting_id: newPosting.posting_id,
                photo_url: s3FileUrl + key,
            });
            const photo_id = await Photo.create(photo);
            photo_ids.push(photo_id);
        });
        await Promise.all([...uploadPromises]);
        posting.photo_ids = photo_ids;
        console.log("photo_ids for posting = ", photo_ids);

        return response.status(200).json(posting);
    } catch (err) {
        console.log(err);
        return response.status(500).send({ error: "Internal server Error" })
    }
};


const indexPostingsValidation = [
    check("page", "Page Field Is A Number").not().isEmpty().isNumeric()
]

const indexPostings = async (request, response) => {

    // Validate request
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        let errorArray = errors.array().map(e => e.msg);
        return response.status(400).json({ error: errorArray[0] });
    }

    try {
        const postings = await Posting.getPostings(request.body)

        let next = false;
        if (postings.length > 20) {
            postings.pop();
            next = true;
        }

        response.status(200).json({ list: postings, next });
    } catch (err) {
        // console.log(err)
        return response.status(500).send({ error: 'Internal server Error' })
    }
}

const showPosting = async (request, response) => {
    const id = request.params.id

    if (id == null) {
        return response.status(400).json({ error: 'Invalid Error' });
    }

    try {
        // TODO: also need to increment popularity for the posting 
        // (only if the user trying to get it is not the posting creator)
        const posting = await Posting.getSinglePosting(id);
        posting.photo_urls = await Photo.getUrlsForPosting(posting.posting_id);
        response.status(200).json(posting);
    } catch (err) {
        return response.status(500).send({ error: 'Internal server Error' })
    }
}

module.exports = {
    create,
	createPostingValidation,
    indexPostingsValidation,
    indexPostings,
    showPosting
}
