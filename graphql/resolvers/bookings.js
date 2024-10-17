import  { Booking } from "../../models/booking.js"
import { Event } from "../../models/event.js"
import {  user, events, singleEvent } from "./merge.js"
import { dateToString } from "../../helpers/date.js"

const transformBooking = booking => {
    return { 
        ...booking._doc,
        user: user.bind(this, booking._doc.user),
        event: singleEvent.bind(this, booking._doc.event),
        createdAt: dateToString(booking._doc.createdAt),
        updatedAt: dateToString(booking._doc.updatedAt)
    }
}
const transformEvent = event => {
    return { 
        ...event._doc,
        date: dateToString(event._doc.date),
        creator: user.bind(this, event.creator)
    }
}

const bookingResolver = {
    bookings : async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!')
        }
        try {
            const bookings = await Booking.find()
            return bookings.map(booking => {
                return transformBooking(booking)
            })
        } catch (err) {
            console.log(err)
            throw err
        }
    },

    bookingEvent : async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!')
        }

        const fetchedEvent = await Event.findOne({ _id: args.eventId })
        const booking = new Booking({
            user: '6710a3422ef340340b420552',
            event: fetchedEvent
        })
        const result = await booking.save()
        return transformBooking(result)
    },

    cancelBooking : async (args, req) => {
        if(!req.isAuth) {
            throw new Error('Unauthenticated!')
        }
        try {
            const booking = await Booking.findById(args.bookingId).populate('event')
            const event = transformEvent(booking.event)
            await Booking.deleteOne({ _id: args.bookingId })
            return event
        } catch (err) {
            console.log(err)
            throw err
        }
    }
}
export default bookingResolver