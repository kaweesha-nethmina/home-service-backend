const User = require('../models/User');
const Service = require('../models/Service');
const Work = require('../models/Work');

exports.getProviderProfile = async (req, res) => {
    try {
        const providerId = req.params.id || req.user.userId;
        const provider = await User.findById(providerId).select('-password -works');
        if (!provider) return res.status(404).json({ message: 'Provider not found' });

        // Optionally include a few recent works
        const recentWorks = await Work.find({ provider: providerId }).sort({ date: -1 }).limit(5).populate('service');

        res.json({ provider, recentWorks });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updateProviderProfile = async (req, res) => {
    try {
        const updates = {};
        const { bio, skills, location, phone } = req.body;
        if (bio !== undefined) updates.bio = bio;
        if (skills !== undefined) updates.skills = skills;
        if (location !== undefined) updates.location = location;
        if (phone !== undefined) updates.phone = phone;

        updates.updatedAt = Date.now();

        const provider = await User.findByIdAndUpdate(req.user.userId, updates, { new: true }).select('-password');
        if (!provider) return res.status(404).json({ message: 'Provider not found' });
        res.json({ message: 'Profile updated', provider });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.addWork = async (req, res) => {
    try {
        const { title, description, images, date, serviceId } = req.body;

        const provider = await User.findById(req.user.userId);
        if (!provider) return res.status(404).json({ message: 'Provider not found' });

        const work = await Work.create({
            provider: req.user.userId,
            title,
            description,
            images: images || [],
            date: date ? new Date(date) : new Date(),
            service: serviceId
        });

        res.status(201).json({ message: 'Work created', work });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.updateWork = async (req, res) => {
    try {
        const { id } = req.params; // work id
        const { title, description, images, date } = req.body;

        const work = await Work.findOne({ _id: id, provider: req.user.userId });
        if (!work) return res.status(404).json({ message: 'Work not found' });

        if (title !== undefined) work.title = title;
        if (description !== undefined) work.description = description;
        if (images !== undefined) work.images = images;
        if (date !== undefined) work.date = new Date(date);

        await work.save();
        res.json({ message: 'Work updated', work });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.deleteWork = async (req, res) => {
    try {
        const { id } = req.params; // work id

        const work = await Work.findOne({ _id: id, provider: req.user.userId });
        if (!work) return res.status(404).json({ message: 'Work not found' });

        await work.remove();
        res.json({ message: 'Work deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

exports.getProviderWorks = async (req, res) => {
    try {
        const providerId = req.params.id || req.user.userId;

        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = Math.min(parseInt(req.query.limit, 10) || 10, 100);
        const skip = (page - 1) * limit;

        const query = { provider: providerId };
        const [total, works] = await Promise.all([
            Work.countDocuments(query),
            Work.find(query).sort({ date: -1 }).skip(skip).limit(limit).populate('service')
        ]);

        res.json({ total, page, limit, works });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
