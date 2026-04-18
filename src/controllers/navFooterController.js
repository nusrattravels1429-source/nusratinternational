const { ObjectId } = require('mongodb');

// ==========================================
// NAVBAR MANAGEMENT
// ==========================================

exports.getNavbar = async (req, res) => {
    try {
        const db = await req.app.locals.getDb();
        const navItems = await db.collection('navitems').find().sort({ order: 1 }).toArray();
        res.json({ success: true, data: navItems });
    } catch (error) {
        console.error('getNavbar Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch navbar links', error: error.message });
    }
};

exports.createNavbarLink = async (req, res) => {
    try {
        const db = await req.app.locals.getDb();
        const { labelEn, labelBn, link, isActive, isExternal } = req.body;

        const count = await db.collection('navitems').countDocuments();

        const doc = {
            label: { en: labelEn || '', bn: labelBn || '' },
            link: link || '/',
            order: count,
            isActive: isActive === 'true' || isActive === true,
            isExternal: isExternal === 'true' || isExternal === true,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const result = await db.collection('navitems').insertOne(doc);
        doc._id = result.insertedId;

        res.status(201).json({ success: true, message: 'Navbar link created', data: doc });
    } catch (error) {
        console.error('createNavbarLink Error:', error);
        res.status(500).json({ success: false, message: 'Failed to create navbar link', error: error.message });
    }
};

exports.updateNavbarLink = async (req, res) => {
    try {
        const db = await req.app.locals.getDb();
        const { id } = req.params;
        const { labelEn, labelBn, link, isActive, isExternal } = req.body;

        const updateDoc = {
            'label.en': labelEn || '',
            'label.bn': labelBn || '',
            link: link || '/',
            isActive: isActive === 'true' || isActive === true,
            isExternal: isExternal === 'true' || isExternal === true,
            updatedAt: new Date()
        };

        const result = await db.collection('navitems').findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: updateDoc },
            { returnDocument: 'after' }
        );

        if (!result) return res.status(404).json({ success: false, message: 'Link not found' });
        
        res.json({ success: true, message: 'Navbar link updated', data: result });
    } catch (error) {
        console.error('updateNavbarLink Error:', error);
        res.status(500).json({ success: false, message: 'Failed to update navbar link', error: error.message });
    }
};

exports.deleteNavbarLink = async (req, res) => {
    try {
        const db = await req.app.locals.getDb();
        const { id } = req.params;

        const result = await db.collection('navitems').findOneAndDelete({ _id: new ObjectId(id) });
        if (!result) return res.status(404).json({ success: false, message: 'Link not found' });

        res.json({ success: true, message: 'Navbar link deleted', data: result });
    } catch (error) {
        console.error('deleteNavbarLink Error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete navbar link', error: error.message });
    }
};

exports.reorderNavbarLinks = async (req, res) => {
    try {
        const db = await req.app.locals.getDb();
        const items = req.body; // Expecting array of { _id, order }

        if (!Array.isArray(items)) {
            return res.status(400).json({ success: false, message: 'Invalid data format' });
        }

        const bulkOps = items.map(item => ({
            updateOne: {
                filter: { _id: new ObjectId(item._id) },
                update: { $set: { order: item.order, updatedAt: new Date() } }
            }
        }));

        if (bulkOps.length > 0) {
            await db.collection('navitems').bulkWrite(bulkOps);
        }

        res.json({ success: true, message: 'Navbar links reordered' });
    } catch (error) {
        console.error('reorderNavbarLinks Error:', error);
        res.status(500).json({ success: false, message: 'Failed to reorder navbar links', error: error.message });
    }
};

// ==========================================
// FOOTER MANAGEMENT
// ==========================================

exports.getFooter = async (req, res) => {
    try {
        const db = await req.app.locals.getDb();
        let footer = await db.collection('footersettings').findOne({});
        
        // Return default structure if it doesn't exist
        if (!footer) {
            footer = {
                companyName: { en: 'Nusrat International', bn: 'নুসরাত ইন্টারন্যাশনাল' },
                phone: '', email: '', whatsapp: '',
                address: { en: '', bn: '' },
                businessHours: {
                    mon: { open: '09:00', close: '18:00', closed: false },
                    tue: { open: '09:00', close: '18:00', closed: false },
                    wed: { open: '09:00', close: '18:00', closed: false },
                    thu: { open: '09:00', close: '18:00', closed: false },
                    fri: { open: '09:00', close: '18:00', closed: false },
                    sat: { open: '09:00', close: '18:00', closed: false },
                    sun: { open: '', close: '', closed: true }
                },
                socialLinks: { facebook: '', instagram: '', youtube: '', linkedin: '', twitter: '' },
                quickLinks: [],
                copyright: { en: '© Nusrat International. All Rights Reserved.', bn: '© নুসরাত ইন্টারন্যাশনাল. সর্বস্বত্ব সংরক্ষিত.' }
            };
        }

        res.json({ success: true, data: footer });
    } catch (error) {
        console.error('getFooter Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch footer settings', error: error.message });
    }
};

exports.updateFooter = async (req, res) => {
    try {
        const db = await req.app.locals.getDb();
        const payload = req.body; // Assuming the frontend sends form data matching schema, parsed by multer or express json

        const updateDoc = {
            companyName: { en: payload.companyNameEn || '', bn: payload.companyNameBn || '' },
            phone: payload.phone || '',
            email: payload.email || '',
            whatsapp: payload.whatsapp || '',
            address: { en: payload.addressEn || '', bn: payload.addressBn || '' },
            socialLinks: {
                facebook: payload.facebook || '',
                instagram: payload.instagram || '',
                youtube: payload.youtube || '',
                linkedin: payload.linkedin || '',
                twitter: payload.twitter || ''
            },
            copyright: { en: payload.copyrightEn || '', bn: payload.copyrightBn || '' },
            businessHours: {},
            quickLinks: [],
            updatedAt: new Date()
        };

        // Parse business hours from flat form fields
        const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
        days.forEach(day => {
            updateDoc.businessHours[day] = {
                open: payload[`${day}Open`] || '',
                close: payload[`${day}Close`] || '',
                closed: payload[`${day}Closed`] === 'true' || payload[`${day}Closed`] === true
            };
        });

        // Parse quick links - frontend will send arrays for these 
        // Example: qlLabelEn[] = ['Link1', 'Link2'], qlLabelBn[] = ['লিংক১', 'লিংক২'], qlLink[] = ['/1', '/2']
        if (payload.qlLabelEn) {
            const labelsEn = Array.isArray(payload.qlLabelEn) ? payload.qlLabelEn : [payload.qlLabelEn];
            const labelsBn = Array.isArray(payload.qlLabelBn) ? payload.qlLabelBn : [payload.qlLabelBn];
            const links = Array.isArray(payload.qlLink) ? payload.qlLink : [payload.qlLink];
            
            for (let i = 0; i < labelsEn.length; i++) {
                if (labelsEn[i] || labelsBn[i]) {
                    updateDoc.quickLinks.push({
                        label: { en: labelsEn[i] || '', bn: labelsBn[i] || '' },
                        link: links[i] || '#'
                    });
                }
            }
        }

        // Always work with a single document. If the document exists, update. If not, insert.
        // We'll just upsert an empty filter or a known signature
        await db.collection('footersettings').updateOne(
            {}, 
            { $set: updateDoc }, 
            { upsert: true }
        );

        res.json({ success: true, message: 'Footer settings updated' });
    } catch (error) {
        console.error('updateFooter Error:', error);
        res.status(500).json({ success: false, message: 'Failed to update footer', error: error.message });
    }
};
