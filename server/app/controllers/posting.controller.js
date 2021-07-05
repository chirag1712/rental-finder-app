const moment = require('moment');
const { Posting, Address, AddressOf } = require("../models/posting.model.js");
//express validator
const { check, validationResult } = require("express-validator");
const { query } = require('../models/db.js');

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
		price_per_month: request.body.price_per_month,
		gender_details: request.body.gender_details,
		rooms_available: request.body.rooms_available,
		total_rooms: request.body.total_rooms,
		ac: request.body.ac,
		washrooms: request.body.washrooms,
		wifi: request.body.wifi,
		parking: request.body.parking,
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
		const user = await Posting.userCheck(request.body.user_id)
		if (!user) {
			return response.status(400).json({ error: "User doesn't exist." });
		}

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

		response.status(200).json(posting);
	} catch (err) {
		// console.log(err);
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
		response.status(200).json(posting);
	} catch (err) {
		return response.status(500).send({ error: 'Internal server Error' })
	}
}

module.exports = {
	create,
	indexPostingsValidation,
	indexPostings,
	showPosting
}
