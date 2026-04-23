const { ObjectId } = require('mongodb');
const heroSliderModel = require('../models/HeroSlider');
const { getImageUrl } = require('../config/cloudinary');
const fs = require('fs');
const path = require('path');

// Default content fallbacks
const DEFAULT_CONTENT = {
  subtitle_en: '✦ DISCOVER THE WORLD',
  subtitle_bn: '✦ বিশ্ব জুড়ে অন্বেষণ',
  title_en: 'Explore Beyond<br/><em>The Horizon</em>',
  title_bn: 'দিগন্তের ওপারে<br/><em>অন্বেষণ করুন</em>',
  description_en: 'Unforgettable journeys crafted for the curious soul.<br />বিশ্বজুড়ে অসাধারণ অভিজ্ঞতার সন্ধানে।',
  description_bn: 'উৎসুক আত্মার জন্য তৈরি অবিস্মরণীয় যাত্রা।<br />বিশ্বজুড়ে অসাধারণ অভিজ্ঞতার সন্ধানে।',
  ctaText_en: 'Start Exploring',
  ctaText_bn: 'অন্বেষণ শুরু করুন',
  ctaLink: '#travel'
};

const DEFAULT_SETTINGS = {
  autoPlay: true,
  transitionSpeed: 5000,
  showDots: true,
  showArrows: true
};

/**
 * GET /admin/hero-manage - Render admin management page
 */
exports.getHeroSliderAdmin = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();

    // Get hero slider data from MongoDB using native driver
    let heroSlider = await heroSliderModel.getOrCreateHeroSlider(db);

    // Also fetch legacy data from sitecontents for backward compatibility
    const heroText = await db.collection('sitecontents').findOne({ section: 'homepage', key: 'homepage-hero-text' }) || {};

    // Merge legacy content with new model data (legacy takes precedence during migration)
    const content = {
      ...heroSlider.content,
      ...(heroText.subtitle_en ? { subtitle_en: heroText.subtitle_en } : {}),
      ...(heroText.subtitle_bn ? { subtitle_bn: heroText.subtitle_bn } : {}),
      ...(heroText.title_en ? { title_en: heroText.title_en } : {}),
      ...(heroText.title_bn ? { title_bn: heroText.title_bn } : {}),
      ...(heroText.description_en ? { description_en: heroText.description_en } : {}),
      ...(heroText.description_bn ? { description_bn: heroText.description_bn } : {})
    };

    res.render('admin/hero/manage', {
      title: 'Manage Hero Slider',
      admin: req.admin || req.session?.admin || { username: 'Admin' },
      activePage: 'hero-manage',
      heroSlider,
      heroContent: content,
      heroText
    });
  } catch (error) {
    console.error('Error in getHeroSliderAdmin:', error);
    res.status(500).send('Internal Server Error: ' + error.message);
  }
};

/**
 * POST /admin/hero-slider/update - Update hero slider content and images
 */
exports.updateHeroSlider = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const {
      subtitle_en, subtitle_bn,
      title_en, title_bn,
      description_en, description_bn,
      ctaText_en, ctaText_bn,
      ctaLink,
      slideOrders
    } = req.body;

    // Get or create hero slider using native driver
    let heroSlider = await heroSliderModel.getOrCreateHeroSlider(db);

    // Update text content with sanitization
    const sanitizeHtml = (str) => {
      if (!str) return '';
      // Allow only <br/>, <em>, </em> tags
      return str.replace(/<(?!\/?(?:br\/?|em)\b)[^>]*>/gi, '');
    };

    heroSlider.content = {
      subtitle_en: sanitizeHtml(subtitle_en)?.trim() || DEFAULT_CONTENT.subtitle_en,
      subtitle_bn: sanitizeHtml(subtitle_bn)?.trim() || DEFAULT_CONTENT.subtitle_bn,
      title_en: sanitizeHtml(title_en)?.trim() || DEFAULT_CONTENT.title_en,
      title_bn: sanitizeHtml(title_bn)?.trim() || DEFAULT_CONTENT.title_bn,
      description_en: sanitizeHtml(description_en)?.trim() || DEFAULT_CONTENT.description_en,
      description_bn: sanitizeHtml(description_bn)?.trim() || DEFAULT_CONTENT.description_bn,
      ctaText_en: sanitizeHtml(ctaText_en)?.trim() || DEFAULT_CONTENT.ctaText_en,
      ctaText_bn: sanitizeHtml(ctaText_bn)?.trim() || DEFAULT_CONTENT.ctaText_bn,
      ctaLink: ctaLink?.trim() || DEFAULT_CONTENT.ctaLink
    };

    // Process uploaded images
    if (req.files && req.files.length > 0) {
      // Update slides with new images into their specific slots
      req.files.forEach((file) => {
        // Extract the slot index from the uploaded file's originalname (injected by frontend)
        const match = file.originalname.match(/\[(\d+)\]/);
        const slotIndex = match ? parseInt(match[1]) : 0;

        if (slotIndex >= 0 && slotIndex < 4) {
          const imageUrl = getImageUrl(file, 'hero');

          if (heroSlider.slides[slotIndex]) {
            heroSlider.slides[slotIndex].imageUrl = imageUrl;
          } else {
            heroSlider.slides.push({ imageUrl, order: slotIndex, isActive: true });
          }
        }
      });
    }

    // Ensure we have exactly 4 slides
    while (heroSlider.slides.length < 4) {
      heroSlider.slides.push({
        imageUrl: '',
        order: heroSlider.slides.length,
        isActive: true
      });
    }

    // Update order and active status based on form data
    if (slideOrders) {
      const orders = typeof slideOrders === 'string' ? JSON.parse(slideOrders) : slideOrders;
      orders.forEach((orderData, idx) => {
        if (heroSlider.slides[idx]) {
          heroSlider.slides[idx].order = orderData.order ?? idx;
          heroSlider.slides[idx].isActive = orderData.isActive !== false;
        }
      });
    }

    // Save using native driver
    heroSlider = await heroSliderModel.saveHeroSlider(db, heroSlider);

    // Also update legacy sitecontents collection for backward compatibility
    await db.collection('sitecontents').updateOne(
      { section: 'homepage', key: 'homepage-hero-text' },
      {
        $set: {
          ...heroSlider.content,
          section: 'homepage',
          key: 'homepage-hero-text',
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    // Update individual slide records in sitecontents for legacy support
    for (let i = 0; i < heroSlider.slides.length; i++) {
      const slide = heroSlider.slides[i];
      await db.collection('sitecontents').updateOne(
        { section: 'homepage', key: `hero-${i + 1}` },
        {
          $set: {
            imageUrl: slide.imageUrl,
            order: slide.order,
            isActive: slide.isActive,
            updatedAt: new Date()
          }
        },
        { upsert: true }
      );
    }

    if (req.xhr || req.headers.accept?.includes('application/json')) {
      res.json({
        success: true,
        message: 'Hero slider updated successfully',
        data: heroSlider
      });
    } else {
      res.redirect('/admin/hero-manage');
    }
  } catch (error) {
    console.error('Error updating hero slider:', error);
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      res.status(500).json({
        success: false,
        message: 'Failed to update hero slider',
        error: error.message
      });
    } else {
      res.status(500).send('Error updating hero slider: ' + error.message);
    }
  }
};

/**
 * POST /admin/hero-slider/reset - Reset to default content
 */
exports.resetHeroSlider = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();

    let heroSlider = await heroSliderModel.getOrCreateHeroSlider(db);

    // Reset content to defaults but keep images
    heroSlider.content = DEFAULT_CONTENT;
    heroSlider.settings = DEFAULT_SETTINGS;
    heroSlider = await heroSliderModel.saveHeroSlider(db, heroSlider);

    // Also reset legacy data
    await db.collection('sitecontents').updateOne(
      { section: 'homepage', key: 'homepage-hero-text' },
      { $set: { ...DEFAULT_CONTENT, updatedAt: new Date() } },
      { upsert: true }
    );

    if (req.xhr || req.headers.accept?.includes('application/json')) {
      res.json({
        success: true,
        message: 'Hero slider reset to defaults',
        data: heroSlider
      });
    } else {
      res.redirect('/admin/hero-manage');
    }
  } catch (error) {
    console.error('Error resetting hero slider:', error);
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      res.status(500).json({
        success: false,
        message: 'Failed to reset hero slider',
        error: error.message
      });
    } else {
      res.status(500).send('Error resetting hero slider: ' + error.message);
    }
  }
};

/**
 * GET /api/hero-slider - Public API endpoint for frontend
 */
exports.getHeroSliderAPI = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();

    // Try to get from native HeroSlider model first
    let heroSlider = await heroSliderModel.getHeroSlider(db);

    if (!heroSlider) {
      // Fallback to legacy sitecontents collection
      const [slider, heroText] = await Promise.all([
        db.collection('sitecontents').find({
          section: 'homepage',
          key: { $in: ['hero-1', 'hero-2', 'hero-3', 'hero-4'] },
          imageUrl: { $ne: '' }
        }).sort({ order: 1 }).toArray(),
        db.collection('sitecontents').findOne({ section: 'homepage', key: 'homepage-hero-text' })
      ]);

      return res.json({
        success: true,
        data: {
          slides: slider.map(s => ({
            imageUrl: s.imageUrl,
            order: s.order,
            isActive: s.isActive !== false
          })),
          content: heroText || DEFAULT_CONTENT,
          settings: DEFAULT_SETTINGS
        }
      });
    }

    // Return formatted data from HeroSlider model
    res.json({
      success: true,
      data: {
        slides: heroSlider.slides
          .filter(s => s.isActive && s.imageUrl)
          .sort((a, b) => a.order - b.order)
          .map(s => ({
            imageUrl: s.imageUrl,
            order: s.order,
            isActive: s.isActive
          })),
        content: heroSlider.content,
        settings: heroSlider.settings
      }
    });
  } catch (error) {
    console.error('Error fetching hero slider API:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch hero slider',
      error: error.message
    });
  }
};

/**
 * PUT /admin/api/admin/hero-slides/:id - Update single slide image (legacy API)
 */
exports.updateSlide = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid slide ID' });
    }

    const updateDoc = {
      updatedAt: new Date()
    };

    if (req.file) {
      updateDoc.imageUrl = getImageUrl(req.file, 'hero');
    } else {
      return res.status(400).json({ success: false, message: 'No image provided' });
    }

    const result = await db.collection('sitecontents').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateDoc },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({ success: false, message: 'Slide slot not found' });
    }

    // Also update HeroSlider model
    let heroSlider = await heroSliderModel.getOrCreateHeroSlider(db);
    const slideIndex = parseInt(result.key?.replace('hero-', '')) - 1;

    if (slideIndex >= 0 && slideIndex < 4) {
      if (heroSlider.slides[slideIndex]) {
        heroSlider.slides[slideIndex].imageUrl = updateDoc.imageUrl;
      } else {
        heroSlider.slides[slideIndex] = {
          imageUrl: updateDoc.imageUrl,
          order: slideIndex,
          isActive: true
        };
      }
      heroSlider = await heroSliderModel.saveHeroSlider(db, heroSlider);
    }

    res.json({ success: true, message: 'Slide image updated successfully', data: result });
  } catch (error) {
    console.error('Error updating slide:', error);
    res.status(500).json({ success: false, message: 'Failed to update slide', error: error.message });
  }
};

/**
 * GET /admin/api/admin/hero-slides - Get all slides (legacy API)
 */
exports.getSlides = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();

    // Fetch slots 1 to 4
    let slides = await db.collection('sitecontents')
      .find({ section: 'homepage', key: { $in: ['hero-1', 'hero-2', 'hero-3', 'hero-4'] } })
      .toArray();

    const existingKeys = slides.map(s => s.key);
    const newSlides = [];

    // Initialize missing slots
    for (let i = 1; i <= 4; i++) {
      if (!existingKeys.includes(`hero-${i}`)) {
        newSlides.push({
          key: `hero-${i}`,
          section: 'homepage',
          imageUrl: '',
          order: i,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }
    }

    if (newSlides.length > 0) {
      await db.collection('sitecontents').insertMany(newSlides);
      slides = await db.collection('sitecontents')
        .find({ section: 'homepage', key: { $in: ['hero-1', 'hero-2', 'hero-3', 'hero-4'] } })
        .toArray();
    }

    // Sort by order 1-4
    slides.sort((a, b) => a.order - b.order);

    res.json({ success: true, message: 'Slides fetched successfully', data: slides });
  } catch (error) {
    console.error('Error fetching slides:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch slides', error: error.message });
  }
};
