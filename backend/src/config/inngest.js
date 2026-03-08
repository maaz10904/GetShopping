import {Inngest} from 'inngest'
import {connectDB} from "./db.js"
import User from '../models/user.model.js'

export const inngest = new Inngest({ id: "GetShopping" })

const syncUser = inngest.createFunction(
    { id: "Sync User" },
    {event: "clerk.user.created"},
    async ({ event }) => {
        await connectDB();
        const { email_addresses, first_name, last_name, profile_image_url, id } = event.data
        const newUser = {
            clerkId: id,
            email: email_addresses[0].email_address,
            name: `${first_name || ""} ${last_name || ""}` || "User",
            image_url: image_url,
            addresses: [],
            wishList: [],
        }
        await User.create(newUser)
    }
);

const deleteUserFromDB = inngest.createFunction(
    { id: "Delete User From DB" },
    { event: "clerk.user.deleted" },
    async ({ event }) => {
        await connectDB();
        const { id } = event.data;
        await User.deleteOne({ clerkId: id });
    }
);

export const functions = [syncUser, deleteUserFromDB]

