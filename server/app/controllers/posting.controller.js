const moment = require('moment');

const { Posting, Address, AddressOf } = require("../models/posting.model.js");

// Create a new posting
const create = async (request, result) => {
  // Validate request
  if (!request.body) {
    return result.status(400).send({
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
    ac:request.body.ac,
    washrooms:request.body.washrooms,
    wifi:request.body.wifi,
    parking:request.body.parking,
    laundry:request.body.laundry,
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
      return result.status(400).json({ error: "User doesn't exist." });
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

    result.status(200).json(posting);
  } catch (err) {
    console.log(err);
    return result.status(500).send({ error: "Internal server Error" })
  }
};

module.exports = { create }