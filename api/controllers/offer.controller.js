const Offer = require("./../models/offer");
const Cart = require("./../models/cart");
const ObjectId = require("mongoose").Types.ObjectId;

module.exports.getOffersForAdmin = async (req, res) => {
  const offers = await Offer.find({});
  res.json({ status: true, data: offers });
};

module.exports.getOffers = async (req, res) => {
  const offers = await Offer.find({
    is_viewable: true,
    $and: [
      { start_date: { $lte: new Date() } },
      { $or: [{ end_date: { $gte: new Date() } }, { end_date: null }] },
    ],
  });
  res.json({ status: true, data: offers });
};

module.exports.createOffer = async (req, res) => {
  const offer = new Offer(req.body);
  offer.save((err, banner) => {
    if (err) {
      return res.status(400).json({
        err: "NOT able to save user in DB",
      });
    }
    res.status(200).json({ status: true, message: "Offer Successfully added" });
  });
};

module.exports.toggleOffer = async (req, res) => {
  const offer = await Offer.findOne({
    _id: ObjectId(req.params.id),
  });
  if (!offer)
    return res.status(404).json({
      err: "offer not found",
    });
  offer.is_viewable = !offer.is_viewable;
  await offer.save();
  return res
    .status(200)
    .json({ status: true, message: "Status successfully updated" });
};

module.exports.deleteOffer = async (req, res) => {
  await Offer.remove({ _id: ObjectId(req.params.id) });
  return res
    .status(200)
    .json({ status: true, message: "Offer successfully deleted" });
};

module.exports.applyOffer = async (req, res) => {
  const offer = await Offer.findOne({
    name: req.body.offer_name,
    $and: [
      { start_date: { $lte: new Date() } },
      { $or: [{ end_date: { $gte: new Date() } }, { end_date: null }] },
    ],
  });
  if (!offer)
    return res.status(404).json({
      err: "Please enter valid promocode",
    });
  const cart = await Cart.findOne({ user: req.userId, status: "pending" });

  if (!cart)
    return res.status(404).json({
      err: "cart not found",
    });

  // if (cart.end_date) {
  // }

  if (offer.only_for_one_time) {
    const IsOfferUsed = await Cart.findOne({
      promocode: offer.name,
    });
    if (IsOfferUsed) {
      return res.status(404).json({
        err: "Please enter valid promocode",
      });
    }
  }
  let savedAmount = 0;
  if (offer.offer_type === "percentage")
    savedAmount = (cart.total / 100) * offer.offer_value;
  else savedAmount = offer.offer_value;

  if (req.body.save) {
    cart.promocode = req.body.offer_name;
    cart.discount = savedAmount;
    cart.payable = cart.total - savedAmount + cart.shiping_charges;
    await cart.save();
  }

  return res.status(200).json({
    status: true,
    data: { isApplied: true, saved: savedAmount },
    message: "You saved " + savedAmount,
  });
};

module.exports.removeOffer = async (req, res) => {
  const cart = await Cart.findOne({ user: req.userId, status: "pending" });

  if (!cart)
    return res.status(404).json({
      err: "cart not found",
    });

  if (!cart.promocode)
    return res.status(200).json({
      status: true,
      message: "Offer removed",
    });

  cart.promocode = null;
  cart.discount = 0;
  cart.payable = cart.total + cart.shiping_charges;
  await cart.save();

  return res.status(200).json({
    status: true,
    message: "Offer removed",
  });
};
