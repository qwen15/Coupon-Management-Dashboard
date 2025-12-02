'use strict';

import express from 'express'; // to run a server application
import fs from 'fs/promises'; // to read and write to a file
import cors from 'cors'; // to get around cors issues, browsers may restrict cross-origin HTTP requests initiated from scripts!

const app = express();
const PORT = 3000;

app.use(cors()); // manage cors headers
app.use(express.json()); // messages will be passed in JSON
app.use(express.urlencoded({ extended: true }));

const FILE = 'coupons.json';

/**
 * Read coupons from file
 */
async function readCoupons() {
  try {
    const data = await fs.readFile(FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

/**
 * Write coupons to file
 */
async function writeCoupons(coupons) {
  await fs.writeFile(FILE, JSON.stringify(coupons, null, 2), 'utf-8');
}

/**
 * normalizeCouponFields
 * 
 * Converts a raw coupon object into a standardized format with correct data types.
 * Ensures all required fields are present and have the expected types.
 * 
 * @param {Object} coupon - The input coupon object which may have inconsistent types or missing fields.
 * 
 * @returns {Object} - A new coupon object with normalized fields:
 *   - id: number             - ensures the coupon ID is a number
 *   - name: string           - ensures the coupon name is a string (defaults to empty string if missing)
 *   - minPurchase: number    - ensures the minimum purchase amount is a number
 *   - discount: number       - ensures the discount value is a number
 *   - status: string         - ensures the status is a string (defaults to 'valid' if missing)
 *   - expireDate: string|null - preserves the expiration date or sets to null if missing
 */
function normalizeCouponFields(coupon) {
  return {
    id: Number(coupon.id),
    name: String(coupon.name || ''),
    minPurchase: Number(coupon.minPurchase),
    discount: Number(coupon.discount),
    status: String(coupon.status || 'valid'),
    expireDate: coupon.expireDate || null
  };
}

/**
 * Validates the numeric fields of a coupon object.
 * 
 * Ensures that `minPurchase` and `discount` can be safely
 * converted to numbers. If either field is invalid (NaN),
 * an error message is returned. Otherwise, `null` is returned
 * to indicate that all validations passed.
 *
 * @param {Object} coupon - The coupon object to validate.
 * @returns {string|null} - Error message if invalid, otherwise null.
 */
function validateCoupon(coupon) {
  if (isNaN(Number(coupon.minPurchase)))
    return 'minPurchase must be a valid number';

  if (isNaN(Number(coupon.discount)))
    return 'discount must be a valid number';

  return null;
}

/**
 * updateExpiredCoupons
 * 
 * Checks a list of coupon objects and updates their status if they have expired.
 * 
 * @param {Array} coupons - Array of coupon objects. 
 *                           
 * @returns {Object} - An object containing:
 *                     - updated: the array of coupons after checking/updating expiration
 *                     - changed: a boolean indicating if any coupon's status was changed
 * 
 * How it works:
 * 1. Initialize a flag `changed` to track whether any coupon was updated.
 * 2. Iterate through all coupons using `map()` to create a new updated array.
 * 3. For each coupon:
 *    - If it has an `expireDate`, convert it to a Date object set to 23:59:59 of that day.
 *    - Compare this date with `today`.
 *    - If the coupon is past its expiration date and its status is 'valid':
 *        - Set `changed` to true.
 *        - Return a new coupon object with status updated to 'expired'.
 *    - Otherwise, return the coupon unchanged.
 * 4. Return an object containing the updated coupon array and whether any changes occurred.
 */
function updateExpiredCoupons(coupons) {
  let changed = false;
  const today = new Date();

  const updated = coupons.map(c => {
    if (!c.expireDate) return c;

    const expireAt = new Date(c.expireDate);
    if (isNaN(expireAt.getTime())) return c;

    // Set to end of the expireDate day
    expireAt.setHours(23, 59, 59, 999);

    if (expireAt < today && c.status === 'valid') {
      changed = true;
      return { ...c, status: 'expired' };
    }

    return c;
  });

  return { updated, changed };
}

/**
 * getNextCouponId
 * 
 * Generates the next unique ID for a new coupon based on existing coupons.
 *
 * @param {Array} coupons - An array of coupon objects. Each object should have an `id` property.
 * @returns {number} - The next available ID for a new coupon.
 *
 * How it works:
 * 1. First, check if `coupons` is a valid array and not empty:
 *    - If it is not an array or is empty, return 1 as the first ID.
 * 2. If there are existing coupons:
 *    - Use `map()` to extract all `id` values and convert them to numbers.
 *    - Use `Math.max()` to find the highest existing ID.
 *    - Add 1 to the maximum ID to generate the next available ID.
 */
function getNextCouponId(coupons) {
  if (!Array.isArray(coupons) || coupons.length === 0) {
    return 1; // first coupon ID
  }

  const maxId = Math.max(...coupons.map(c => Number(c.id))); // find the largest existing ID
  return maxId + 1; // return the next ID
}

/* ------------------ ROUTES ---------------------- */

/**
 * GET /coupons
 * 
 * Endpoint to retrieve all coupons from the server.
 * 
 */
app.get('/coupons', async (req, res) => {
  try {
    // Read all existing coupons
    let coupons = await readCoupons();

    // check and update expired coupons
    const { updated, changed } = updateExpiredCoupons(coupons);

    // if any coupons were updated, write them back
    if (changed) {
      await writeCoupons(updated);
    }

    // respond with the updated coupon list
    res.json(updated);

  } catch (err) {
    // if reading or writing fails, log the error to the server console.
    console.error('GET /coupons error:', err);
    // respond with HTTP 500 and a JSON error message.
    res.status(500).json({ error: 'Failed to read coupons' });
  }
});


/**
 * POST /coupons
 * 
 * Endpoint to add a new coupon to the server.
 * 
 */
app.post('/coupons', async (req, res) => {
  try {
    const body = req.body; // extract the request body containing coupon details from the client
    const coupons = await readCoupons(); // read existing coupons

    const nextId = getNextCouponId(coupons); // generate next unique ID

    // create and normalize new coupon
    const newCoupon = normalizeCouponFields({
      id: nextId,
      status: 'valid', // default status
      ...body
    });

    // validation
    const validationError = validateCoupon(newCoupon);
    if (validationError) return res.status(400).json({ error: validationError });

    coupons.push(newCoupon); // add to coupon list

    await writeCoupons(coupons); // save updated coupons

    res.status(201).json(newCoupon); // respond with new coupon

  } catch (err) {
    // if reading or writing fails, log the error to the server console.
    console.error('POST /coupons error:', err);
    // respond with HTTP 500 and a JSON error message.
    res.status(500).json({ error: 'Failed to add coupon' });
  }
});



/**
 * POST /coupons/redeem
 * 
 * Endpoint to redeem a coupon for a given purchase amount and coupon code(ID).
 * 
 */
app.post('/coupons/redeem', async (req, res) => {
  try {
    const { id, purchaseAmount } = req.body; // extract `id` (coupon ID) and `purchaseAmount` from the request body.

    const coupons = await readCoupons(); // read all existing coupons

    const coupon = coupons.find(c => c.id === Number(id)); //find the coupon matching the provided `id`.

    if (!coupon) return res.status(404).json({ error: 'Coupon not found' }); //If not found, respond with 404 (Not Found).

    // Validate expired
    if (coupon.expireDate) {
      const expireAt = new Date(coupon.expireDate);
      expireAt.setHours(23, 59, 59, 999);

      if (expireAt < new Date()) {
        coupon.status = 'expired';
        await writeCoupons(coupons);
        return res.status(400).json({ error: 'Coupon is expired' });
      }
    }

    // check the coupon's status: if not 'valid' , respond with 400 (Bad Request).
    if (coupon.status !== 'valid')
      return res.status(400).json({ error: `Coupon is ${coupon.status}` });

    if (isNaN(Number(purchaseAmount)))
      return res.status(400).json({ error: 'Invalid purchaseAmount' });

    // check if the `purchaseAmount` meets the coupon's `minPurchase` requirement: 
    // if not, respond with 400 and indicate the minimum required amount.
    if (purchaseAmount < Number(coupon.minPurchase || 0)) {
      return res.status(400).json({
        error: `Minimum purchase of $${coupon.minPurchase} required`
      });
    }

    const discount = Number(coupon.discount || 0);

    // calculate the final amount: `finalAmount = purchaseAmount - discount`
    const finalAmount = Math.max(0, purchaseAmount - discount);

    coupon.status = 'redeemed'; // mark the coupon's status as 'redeemed' and save the updated coupons list 
    await writeCoupons(coupons); // save updated coupons

    // respond with a success message, discount applied, and final amount.
    res.json({
      message: 'Coupon redeemed successfully',
      discount,
      finalAmount
    });

  } catch (err) {
    // if reading or writing fails, log the error to the server console.
    console.error('Redeem error:', err);
    // respond with HTTP 500 and a JSON error message.
    res.status(500).json({ error: 'Failed to redeem coupon' });
  }
});

/**
 * PUT /coupons/:id
 * 
 * Endpoint to edit/update an existing coupon by ID.
 */
app.put('/coupons/:id', async (req, res) => {
  try {
    const id = Number(req.params.id); // extract `id` from the request URL parameters
    const updates = req.body; // extract `updates` from the request body

    const coupons = await readCoupons(); // read all existing coupons
    const index = coupons.findIndex(c => c.id === id); // find the index of the coupon with the matching `id`

    if (index === -1) // if not found, respond with 404 (Not Found)
      return res.status(404).json({ error: 'Coupon not found' });

    const updatedCoupon = normalizeCouponFields({
      ...coupons[index], // spread original coupon obj
      ...updates, // spread updated coupon obj, will overwrite the original
      id
    });

    const validationError = validateCoupon(updatedCoupon);
    if (validationError) return res.status(400).json({ error: validationError });

    coupons[index] = updatedCoupon;

    await writeCoupons(coupons); // save updated coupons

    // respond with a success message and the updated coupon object
    res.json({
      message: 'Coupon updated successfully',
      coupon: coupons[index]
    });

  } catch (err) {
    // if reading or writing fails, log the error to the server console.
    console.error('PUT error:', err);
    // respond with HTTP 500 and a JSON error message.
    res.status(500).json({ error: 'Failed to update coupon' });
  }
});

/**
 * DELETE /coupons/:id
 * 
 * Endpoint to delete a coupon by ID.
 */
app.delete('/coupons/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let coupons = await readCoupons(); // read existing coupons

    const index = coupons.findIndex(c => c.id === Number(id)); // find coupon by ID
    if (index === -1)
      // if not found, respond with 404 (Not Found).
      return res.status(404).json({ error: 'Coupon not found' });

    coupons.splice(index, 1); // remove coupon from list

    await writeCoupons(coupons); // save updated coupons

    res.json({ message: 'Deleted successfully' }); //respond with a success message in JSON.

  } catch (err) {
    // if reading or writing fails, log the error to the server console.
    console.error('DELETE error:', err);
    // respond with HTTP 500 and a JSON error message.
    res.status(500).json({ error: 'Failed to delete coupon' });
  }
});

//listen, server will need to listen ... all the time!!
app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);

//uncomment the line below to run the unit tests on some back end functions!
export { normalizeCouponFields, updateExpiredCoupons, getNextCouponId, validateCoupon };