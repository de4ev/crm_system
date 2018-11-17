const moment = require('moment')
const Order = require('../models/Order')
const errorHandler = require('../utils/errorHandler')

module.exports.overview = async function(req, res) {
    try {
        const allOrders = await Order.find({user: req.user.id}).sort({date: 1})
        const ordersMap = getOrdersMap(allOrders)
        const yesterdayOrders = ordersMap[moment().add(-1, 'd').format('DD.MM.YYYY')] || []

        //Количество заказов
        const totalOrders = allOrders.length

        //Количество заказов вчера
        const yesterdayOrdersNumber = yesterdayOrders.length

        //Количество дней
        const totalDays = Object.keys(ordersMap).length

        //Среднее количество заказов в день
        const ordersPerDay = (totalOrders / totalDays).toFixed(0)

        //Процент для количества заказов
        const ordersPercent = (((yesterdayOrdersNumber / ordersPerDay) - 1) * 100).toFixed(2)

        //Общая выручка
        const totalGain = calculatePrice(allOrders)

        //Выручка в день
        const gainPerDay = totalGain / totalDays

        //Выручка за вчера
        const gainYesterday = calculatePrice(yesterdayOrders)

        //Процент для выручки
        const gainPercent = (((gainYesterday / gainPerDay) - 1) * 100).toFixed(2)

        //Сравнение выручки
        const compareGain = (gainYesterday - gainPerDay).toFixed(2)

        //Сравнение заказов
        const compareOrdersNumber = (yesterdayOrders - ordersPerDay)

        res.status(200).json({
            gain: {
                percent: Math.abs(+gainPercent),
                compare: Math.abs(+compareGain),
                yesterday: +gainYesterday,
                isHigher: +gainPercent > 0
            },
            orders: {
                percent: Math.abs(+ordersPercent),
                compare: Math.abs(+compareOrdersNumber),
                yesterday: +yesterdayOrdersNumber,
                isHigher: +ordersPercent > 0
            }
        })

    } catch(e) {
        errorHandler(res, e)
    }
}

module.exports.analytics = async function(req, res) {
}

function getOrdersMap(orders = []) {
    const daysOrders = {}
    orders.forEach(order => {
        const date = moment(order.date).format('DD.MM.YYYY')

        if (date === moment().format('DD.MM.YYYY')) {
            return
        }

        if (!daysOrders[date]) {
            daysOrders[date] = []
        }

        daysOrders[date].push(order)

    })
    return daysOrders
}

function calculatePrice(orders = []) {
    return orders.reduce((total, order) => {
        const orderCost = order.list.reduce((orderTotal, item) => {
            return orderTotal += item.cost * item.quantity
        }, 0)
        return total += orderCost
    }, 0)
}