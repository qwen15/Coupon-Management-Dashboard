import express from 'express';
import fs from 'fs/promises';
import cors from 'cors';

const app = express();
const PORT = 3000;

app.use(cors()); //manage cors headers
app.use(express.json()); //messages will be passed in JSON
app.use(express.urlencoded({ extended: true }));


// ==== Helper functions for reading/writing JSON ====

const FILE = './coupons.json';

async function readCoupons() {
  try {
    const data = await fs.readFile(FILE, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

async function writeCoupons(coupons) {
  await fs.writeFile(FILE, JSON.stringify(coupons, null, 2), 'utf-8');
}

// order coupon field
function normalizeCouponFields(coupon) {
  return {
    id: String(coupon.id),
    name: coupon.name,
    minPurchase: Number(coupon.minPurchase),
    discount: Number(coupon.discount),
    status: coupon.status,
    expireDate: coupon.expireDate
  };
}

// expired
function updateExpiredCoupons(coupons, today = new Date()) {
  let changed = false;
  const updated = coupons.map(c => {
    if (c.expireDate) {
      const expireAt = new Date(`${c.expireDate}T23:59:59`);
      if (expireAt < today && c.status === 'valid') {
        changed = true;
        return { ...c, status: 'expired' };
      }
    }
    return c;
  });
  return { updated, changed };
}

/**
 * get next id
 * @param {Array} coupons array stores all coupons
 * @returns {number} next id
 */
function getNextCouponId(coupons) {
  if (!Array.isArray(coupons) || coupons.length === 0) {
    return 1;
  }

  const maxId = Math.max(...coupons.map(c => Number(c.id)));
  return maxId + 1;
}




// ==== GET /coupons ====

app.get('/coupons', async (req, res) => {
  try {
    let coupons = await readCoupons();

    const { updated, changed } = updateExpiredCoupons(coupons);

    if (changed) {
      await writeCoupons(updated);
      //console.log('Expired coupons updated.');
    }

    res.json(updated);

  } catch (err) {
    console.error('GET /coupons error:', err);
    res.status(500).json({ error: 'Failed to read coupons' });
  }
});

// ==== POST /coupons (add) ====

app.post('/coupons', async (req, res) => {
  try {
    const body = req.body;
    const coupons = await readCoupons();

    const nextId = getNextCouponId(coupons);

    const newCoupon = normalizeCouponFields({
      id: nextId,
      status : 'valid',
      ...body
    });

    coupons.push(newCoupon);

    await writeCoupons(coupons);

    res.status(201).json(newCoupon);

  } catch (err) {
    console.error('POST /coupons error:', err);
    res.status(500).json({ error: 'Failed to add coupon' });
  }
});

// ==== POST /coupons/redeem ====

app.post('/coupons/redeem', async (req, res) => {
  try {
    const { id, purchaseAmount } = req.body;

    const coupons = await readCoupons();

    const coupon = coupons.find(c => c.id == id);

    if (!coupon) return res.status(404).json({ error: 'Coupon not found' });

    if (coupon.status !== 'valid')
      return res.status(400).json({ error: `Coupon is ${coupon.status}` });

    if (purchaseAmount < Number(coupon.minPurchase || 0)) {
      return res.status(400).json({
        error: `Minimum purchase of $${coupon.minPurchase} required`
      });
    }

    const discount = Number(coupon.discount || 0);

    const finalAmount = purchaseAmount - discount;

    coupon.status = 'redeemed';
    await writeCoupons(coupons);

    res.json({
      message: 'Coupon redeemed successfully',
      discount,
      finalAmount
    });

  } catch (err) {
    console.error('Redeem error:', err);
    res.status(500).json({ error: 'Failed to redeem coupon' });
  }
});

// ==== PUT /coupons/:id (edit) ====

app.put('/coupons/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const coupons = await readCoupons();
    const index = coupons.findIndex(c => c.id == id);

    if (index === -1)
      return res.status(404).json({ error: 'Coupon not found' });

    coupons[index] = normalizeCouponFields({
      ...coupons[index],
      ...updates,
      id
    });

    await writeCoupons(coupons);

    res.json({
      message: 'Coupon updated successfully',
      coupon: coupons[index]
    });

  } catch (err) {
    console.error('PUT error:', err);
    res.status(500).json({ error: 'Failed to update coupon' });
  }
});

// ==== DELETE /coupons/:id ====

app.delete('/coupons/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let coupons = await readCoupons();

    const index = coupons.findIndex(c => c.id == id);
    if (index === -1)
      return res.status(404).json({ error: 'Coupon not found' });

    coupons.splice(index, 1);

    await writeCoupons(coupons);

    res.json({ message: 'Deleted successfully' });

  } catch (err) {
    console.error('DELETE error:', err);
    res.status(500).json({ error: 'Failed to delete coupon' });
  }
});

app.listen(PORT, () =>
  console.log(`Server running at http://localhost:${PORT}`)
);

export {normalizeCouponFields, updateExpiredCoupons, getNextCouponId};