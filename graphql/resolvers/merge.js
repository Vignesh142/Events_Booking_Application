import { Event } from '../../models/event.js'
import { User } from '../../models/user.js'
import { dateToString } from '../../helpers/date.js'

const transformEvent = event => {
    return { 
        ...event._doc,
        date: dateToString(event._doc.date),
        creator: user.bind(this, event.creator)
    }
}

export const events = async eventIds => {
    try {
        const events = await Event.find({ _id: { $in: eventIds } })
        return events.map(event => {
            return transformEvent(event)
        })
    } catch (err) {
        console.log(err)
        throw err
    }
}

export const singleEvent = async eventId => {
    try {
        const event = await Event.findById(eventId) 
        return transformEvent(event)
    }
    catch (err) {
        console.log(err)
        throw err
    }
}

export const user = async userId => {
    try {
        const user = await User.findById(userId)
        return { 
            ...user._doc, 
            createdEvents: events.bind(this, user._doc.createdEvents) 
        }
    } catch (err) {
        console.log(err)
        throw err
    }
}