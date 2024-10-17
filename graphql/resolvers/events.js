import { Event } from '../../models/event.js';
import { User } from '../../models/user.js';
import { user, singleEvent, events } from './merge.js';
import { dateToString } from '../../helpers/date.js';

const transformEvent = event => {
    return { 
        ...event._doc,
        date: dateToString(event._doc.date),
        creator: user.bind(this, event.creator)
    }
}

const eventResolver = {
    events: async () => {
        const events = await Event.find()
    
        return events.map(event => {
            return transformEvent(event)
        })
    },
    createEvent: async (args, req) => {
        if (!req.isAuth) {
            throw new Error('Unauthenticated!');
        }
        try {
            const new_event = new Event({
                name: args.eventInput.name,
                description: args.eventInput.description,
                date: new Date(args.eventInput.date),
                price: +args.eventInput.price,
                creator: req.userId
            });

            const event = await new_event.save();
            const curuser = await User.findById(req.userId);
            if (!curuser) {
                throw new Error('User not found.');
            }
            curuser.createdEvents.push(event);
            await curuser.save();

            // console.log(event);
            return transformEvent(event);
        } catch (err) {
            console.log(err);
            throw err;
        }
    }
}
export default eventResolver;