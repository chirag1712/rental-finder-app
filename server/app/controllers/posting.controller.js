//const User = require("../models/user.model.js");
const {Posting, Address, AddressOf} = require("../models/posting.model.js");

// Create a new posting
exports.create = async (request, result) => {
  // Validate request
  if (!request.body) {
    result.status(400).send({
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
    description: request.body.description,
    created_at: Date.now(),
    updated_at: Date.now(),
  });

  // Create a Address (only if it doesn't exist)
  const address = new Address({
    street_num: request.body.street_num,
    street_name: request.body.street_name,
    city: request.body.city,
    postal_code: request.body.postal_code,
    building_name: request.body.building_name,
  });

  // validate that user exists in the db
  Posting.userCheck(request.body.user_id, (err, userExist) => {
    if (err) {
      result.status(500).send({
        message:
          err.message ||
          "Some error occurred while checking existence of User.",
      });
    } else if (!userExist) {
      result.status(400).json({ error: "User doesn't exist." });
      return;
    }
    // Save Posting in the database
    Posting.create(posting, (err, posting) => {
      if (err) {
        return result.status(500).send({
          message:
            err.message || "Some error occurred while creating the posting.",
        });
      }

      // Search Address in the database
      Address.search(address, (err, address) => {
        if (err) {
          return result.status(500).send({
            message:
              err.message || "Some error occurred while searching the address.",
          });
        }

        if (address[0]) {
          // address exists
          const address_of = new AddressOf({
            posting_id: posting.posting_id,
            address_id: address.address_id,
          });

          //join address and posting
          AddressOf.createAddressOf(address_of, (err, address) => {
            if (err)
              result.status(500).send({
                message:
                  err.message ||
                  "Some error occurred while joining the address and posting.",
              });
          });
        } else {
          // Save Address in the database
          Address.createAddress(address, (err, address) => {
            if (err) {
              result.status(500).send({
                message:
                  err.message || "Some error occurred while saving the address.",
              });
              return;
            }
            const address_of = new AddressOf({
              posting_id: posting.posting_id,
              address_id: address.address_id,
            });

            //join address and posting
            AddressOf.createAddressOf(address_of, (err, data) => {
              if (err)
                result.status(500).send({
                  message:
                    err.message ||
                    "Some error occurred while joining the address and posting.",
                });
            });

          });
        }
      });

      result.send(posting);
    });
  });
};
