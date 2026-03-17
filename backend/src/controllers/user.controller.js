import e from "express";
import { User } from "../models/user.model.js";

export async function addAddress(req, res) {
    try {
       const { label, fullName, streetAddress, city, state, zipcode, zipCode, phoneNumber, isDefault } =
        req.body;
        const normalizedZipcode = zipcode ?? zipCode;
        const user = req.user;
 
        if (!label || !fullName || !streetAddress || !city || !state || !normalizedZipcode || !phoneNumber) {
            return res.status(400).json({message:"All fields are required"});
        }

    if(isDefault){
        user.addresses.forEach((addr) => {
            addr.isDefault = false;
        });
    }

    user.addresses.push({
        label,
        fullName,
        streetAddress,
        city,
        state,
        zipcode: normalizedZipcode,
        phoneNumber,
        isDefault: isDefault || false
    });

    await user.save();

    res.status(201).json({message:"Address added successfully", addresses: user.addresses});


}catch (error) {
        res.status(500).json({message:"something went wrong"});
    }
}
export async function getAddresses(req, res) {
    try {
        const user = req.user;
        res.status(200).json({addresses: user.addresses});
    }catch (error) {
        res.status(500).json({message:"something went wrong"});
    }
}

export async function updateAddress(req, res) {
    try {
        const { label, fullName, streetAddress, city, state, zipcode, zipCode, phoneNumber, isDefault } =
         req.body;
        const normalizedZipcode = zipcode ?? zipCode;
        const {addressId} = req.params;

        const user = req.user;
        const address = user.addresses.id(addressId);

        if(!address){
            return res.status(404).json({message:"Address not found"});
        }

        if (!label || !fullName || !streetAddress || !city || !state || !normalizedZipcode || !phoneNumber) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // Update the address fields
        address.label = label;
        address.fullName = fullName;
        address.streetAddress = streetAddress;
        address.city = city;
        address.state = state;
        address.zipcode = normalizedZipcode;
        address.phoneNumber = phoneNumber;
        address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;

        await user.save();
        res.status(200).json({message:"Address updated successfully", addresses: user.addresses});

    }catch (error) {
        res.status(500).json({message:"something went wrong"});
    }
}

export async function deleteAddress(req, res) {
    try {
        const {addressId} = req.params;
        const user = req.user;
        user.addresses.pull(addressId);
        await user.save();
        res.status(200).json({message:"Address deleted successfully", addresses: user.addresses});
        }catch (error) {
        res.status(500).json({message:"something went wrong"});
    }
}

export async function addToWishlist(req, res) {
        try {
        const {productId} = req.body;
        const user = req.user;

        if(user.wishlist.includes(productId)){
            return res.status(400).json({message:"Product already in wishlist"});
        }
        user.wishlist.push(productId);
        await user.save();
        res.status(200).json({message:"Product added to wishlist", wishlist: user.wishlist});
        }catch (error) {
        res.status(500).json({message:"something went wrong"});
}
}

export async function removeFromWishlist(req, res) {
        try {
            const {productId} = req.params;
            const user = req.user;

            if(!user.wishlist.includes(productId)){
                return res.status(400).json({message:"Product not in wishlist"});
            }

            user.wishlist.pull(productId);
            await user.save();
            res.status(200).json({message:"Product removed from wishlist", wishlist: user.wishlist});

        }catch (error) {
            console.error("Error fetching wishlist:", error);
        res.status(500).json({message:"something went wrong"});
    }
}
export async function getWishlist(req, res) {
        try {
            const user = await User.findById(req.user._id).populate("wishlist");
            res.status(200).json({wishlist: user.wishlist});
        }catch (error) {
            console.error("Error fetching wishlist:", error);
        res.status(500).json({message:"something went wrong"});
    }
}
