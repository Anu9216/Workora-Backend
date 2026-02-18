const User = require('../models/User');

exports.updateUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const updates = req.body;

        // Check for role-based restrictions or validation if needed
        // For simplicity, allow updating straightforward fields

        // Fields allowed to be updated
        const updateFields = {
            ...(updates.username && { username: updates.username }),
            ...(updates.email && { email: updates.email }),
            ...(updates.profile && { profile: updates.profile }), // Assuming nested structure matches schema
            ...(updates.isSeller !== undefined && { isSeller: updates.isSeller }),
        };

        // Handle profile specifically if partially sent (needs merging if not using $set properly with mongoose)
        // But likely we send full profile object or individual fields.
        // Let's refine based on schema: profile is an object with bio, skills, profilePicture.

        if (updates.bio) updateFields['profile.bio'] = updates.bio;
        if (updates.skills) updateFields['profile.skills'] = updates.skills;
        if (updates.profilePicture) updateFields['profile.profilePicture'] = updates.profilePicture;

        // Or if req.body has nested profile object
        if (req.body.profile) {
            updateFields.profile = { ...req.body.profile };
        }

        const user = await User.findByIdAndUpdate(userId,
            { $set: updateFields },
            { new: true, runValidators: true }
        ).select("-password");

        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json(user);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUser = async (req, res) => {
    try {
        console.log("getUser request for ID:", req.params.id);

        // Validate ID format first
        if (!req.params.id || !req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
            console.log("Invalid ID format:", req.params.id);
            return res.status(400).json({ message: "Invalid User ID format" });
        }

        const user = await User.findById(req.params.id).select("-password");

        if (!user) {
            console.log("User not found in DB for ID:", req.params.id);
            return res.status(404).json({ message: "User not found" });
        }

        console.log("getUser found:", user.username);
        res.status(200).json(user);
    } catch (error) {
        console.error("getUser error:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (req.user.id !== user._id.toString()) {
            return res.status(403).json({ message: "You can delete only your account!" });
        }

        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "User has been deleted." });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
