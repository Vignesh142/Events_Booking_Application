import { buildSchema } from "graphql";

export const graphqlSchema = buildSchema(`
    type Booking {
        _id: ID!
        event: Event!
        user: User!
        createdAt: String!
        updatedAt: String!
    }

    type Event {
        _id: ID!
        name: String!
        description: String!
        date: String!
        price: Float!
        creator: User!
    }

    type User {
        _id: ID!
        email: String!
        password: String
        createdEvents: [Event!]
    }

    type AuthData {
        userId: ID!
        token: String!
        tokenExpiration: Int!
    }

    input UserInput {
        email: String!
        password: String!
    }

    input EventInput {
        name: String!
        description: String!
        date: String!
        price: Float!
    }

    type RootQuery {
        events: [Event!]!
        bookings: [Booking!]!
        login(email: String!, password: String!): AuthData!
    }
    
    type RootMutation {
        createUser(userInput: UserInput): User
        createEvent(eventInput: EventInput): Event
        bookingEvent(eventId: ID!): Booking
        cancelBooking(bookingId: ID!): Event!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }`
)