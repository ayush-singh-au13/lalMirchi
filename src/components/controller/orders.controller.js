const mongoose = require('mongoose')
const _ = require('lodash')
const userModel = require('./../models/user.model')
const orderModel = require('./../models/orders.model')
const messageTypes = require('./../../responses')
const userItemMapping = require('../models/userItemMapping.model')
const { createObjectID } = require('mongo-object-reader')
const { auto_increment, counterModel } = require('./../models/counters.model')

class Orders {
  constructor() {
    this.message = messageTypes.orders
  }
  addItemToCart = async (req, res) => {
    try {
      let items = req.body.items,
        userId = req.params.userId

      let dataToInsert = []

      /** @Desc item selected by user from list of item on UI **/
      items
        ? items.map((item, i) => {
            dataToInsert.push({
              productId: item.productId,
              category: item.category,
              discount_pr: item.discount_pr,
              qty: item.qty,
              productName: item.productName,
              price: item.price,
            })
          })
        : []

      /** @Desc storing item in cart **/
      let addedItem = await userItemMapping.create({
        cartId: createObjectID(),
        items: dataToInsert,
        userId: mongoose.Types.ObjectId(userId),
      })

      if (addedItem && !_.isEmpty(addedItem)) {
        return res
          .status(201)
          .json({ message: this.message.itemAddedToCart, data: addedItem })
      } else {
        return res.status(409).json({ message: this.message.itemNotAdded })
      }
    } catch (err) {
      console.log(err)
      return res.status(500).json({ message: 'Internal Server Error !' })
    }
  }

  /**@Desc Listing of items from cart */
  listCartItems = async (req, res) => {
    try {
      let pageSize = !req.query.page ? 1 : req.query.page,
        limit = !req.query.limit ? 10 : req.query.limit,
        skipDocs = parseInt(pageSize - 1) * limit

      let projection = {
        isOrderPlaced: false,
        isDeleted: false,
      }

      let totalItemsInCart = await userItemMapping.countDocuments({
        ...projection,
      })

      let cartItems = await userItemMapping
        .find({ ...projection })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skipDocs)

      let pageMeta = {
        total: totalItemsInCart,
        list: cartItems,
        skip: skipDocs,
        limit: limit,
      }

      if (cartItems.length > 0 && !_.isEmpty(cartItems)) {
        return res.status(200).json({
          message: this.message.itemListFetchedSuccessfully,
          data: pageMeta,
        })
      } else {
        return res.status(409).json({ message: this.message.noDataFound })
      }
    } catch (err) {
      console.log(err)
      return res.status(500).json({ message: 'Internal Server Error !' })
    }
  }

  /** @Desc remove item from cart */
  updateItem = async (req, res) => {
    try {
      let cartId = req.params.cartId
      let id = req.body._ids
        ? req.body._ids.map((id) => {
            return mongoose.Types.ObjectId(id)
          })
        : []

      let isUpdate = await userItemMapping.updateMany(
        { cartId: mongoose.Types.ObjectId(cartId) },
        { $pull: { items: { _id: { $in: id } } } },
      )
      // console.log('=========>', isUpdate)

      if (isUpdate && isUpdate.modified > 0) {
        return res.status(200).json({ message: this.message.cartUpdated })
      } else {
        return res.status(409).json({ message: this.message.cartNotUpdated })
      }
    } catch (err) {
      console.log(err)
      return res.status(500).json({ message: 'Internal Server Error !' })
    }
  }

  /**@Desc Placing an order by user */
  orderPlacing = async (req, res) => {
    try {
      let totalPrice = 0,
        totalDiscount = 0,
        cartId = req.params.cartId

      // fetching the items available in the carts
      let cartItem = await userItemMapping
        .find({ cartId: mongoose.Types.ObjectId(cartId) })
        .lean()
      // console.log(cartItem,"-------------->");

      if (cartItem.length > 0 && cartItem[0].items.length > 0) {
        cartItem[0].items.map((item) => {
          totalDiscount += item.price * item.qty * (item.discount_pr / 100)
          totalPrice += item.price * item.qty
        })

        let amountToBePaid = totalPrice - totalDiscount
        let orderId = await auto_increment('userId')
        let user = await userModel
          .findOne({ email: req.user.email })
          .lean()
          .select('username email')

        // order placing
        let placeNewOrder = await orderModel.create({
          orderId: orderId.seq,
          products: cartItem[0].items,
          orderedBy: user,
          userEmail: user.email,
          totalPrice: totalPrice,
          dateOfOrder: new Date(),
        })

        if (!_.isEmpty(placeNewOrder)) {
          await userItemMapping.updateOne(
            { cartId: mongoose.Types.ObjectId(cartId) },
            { $set: { isOrderPlaced: true } },
          )

          return res.status(200).json({
            message: this.message.orderPlacedSuccessfully,
            data: { placeNewOrder, amountToBePaid },
          })
        }
      } else {
        return res
          .status(409)
          .json({ message: this.message.orderPlacingFailed })
      }
    } catch (err) {
      console.log(err)
      return res.status(500).json({ message: 'Internal Server Error !' })
    }
  }

  /**@Desc List of orders of All the Users */
  ordersList = async (req, res) => {
    try {
      let startDate = !req.query.startDate
          ? new Date()
          : new Date(req.query.startDate),
        endDate = !req.query.endDate ? new Date() : new Date(req.query.endDate),
        limit = !req.query.limit ? 10 : parseInt(req.query.limit),
        page = !req.query.page ? 1 : parseInt(req.query.page),
        skipRec = parseInt(page - 1) * limit

      startDate = startDate.setHours(0, 0, 0, 0)
      endDate = endDate.setHours(23, 59, 59, 999)
      startDate = new Date(startDate).toISOString()
      endDate = new Date(endDate).toISOString()
      console.log('startDate', startDate, endDate)

      let populate = {
        isDeleted: false,
        createdAt: { $gte: startDate, $lte: endDate },
      }

      let ordersList = await orderModel
        .find({ ...populate })
        .lean()
        .limit(limit)
        .skip(skipRec)

      if(ordersList.length > 0 && !_.isEmpty(ordersList)){
        return res.status(200).json({message:this.message.ordersList, data:ordersList})
      }else {
        return res.status(400).json({message:this.message.ordersListNotFound})
      }
    } catch (err) {
      console.log(err)
      return res.status(500).json({ message: 'Internal Server Error !' })
    }
  }

  /** @Desc approve or reject orders of user by SuperAdmin*/
  approveOrder = async (req, res) => {
    console.log('Approval Done !!!')
  }
}
module.exports = new Orders()
