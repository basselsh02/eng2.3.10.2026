/**
 * procurement-memos module — route registration
 *
 * Paste the lines below into your main app.js / server.js
 * alongside the existing route registrations (publication-memos, booklet-sales, etc.)
 */

const memosRoutes           = require('./routes/memosRoutes');
const offersRoutes          = require('./routes/offersRoutes');
const supplyOrdersRoutes    = require('./routes/supplyOrdersRoutes');
const committeeMembersRoutes = require('./routes/committeeMembersRoutes');
const lookupsRoutes         = require('./routes/lookupsRoutes');

// ─── Mount ────────────────────────────────────────────────────────────────────
app.use('/api/memos',             memosRoutes);
app.use('/api/offers',            offersRoutes);
app.use('/api/supply-orders',     supplyOrdersRoutes);
app.use('/api/committee-members', committeeMembersRoutes);

// Lookup / dropdown endpoints (committee-types, offer-types, decision-reasons,
// fiscal-years, projects, companies, units)
app.use('/api',                   lookupsRoutes);
