const express = require('express');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const Invoice = require('../models/Invoice');
const { auth, managerAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/invoices
// @desc    Get all invoices with filtering and pagination
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      customer,
      startDate,
      endDate
    } = req.query;

    const filter = {};
    if (status) filter.status = status;
    if (customer) filter.customer = customer;
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const invoices = await Invoice.find(filter)
      .populate('customer', 'name email phone')
      .populate('booking', 'service date')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Invoice.countDocuments(filter);

    res.json({
      invoices,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get invoices error:', error);
    res.status(500).json({ message: 'Server error fetching invoices' });
  }
});

// @route   GET /api/invoices/:id
// @desc    Get invoice by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate('customer', 'name email phone address')
      .populate('booking', 'service date startTime endTime');

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.json(invoice);
  } catch (error) {
    console.error('Get invoice error:', error);
    res.status(500).json({ message: 'Server error fetching invoice' });
  }
});

// @route   POST /api/invoices
// @desc    Create new invoice
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const {
      customer,
      booking,
      items,
      tax,
      discount,
      dueDate,
      notes
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Items are required' });
    }

    // Calculate totals
    const subtotal = items.reduce((sum, item) => {
      item.total = item.quantity * item.unitPrice;
      return sum + item.total;
    }, 0);

    const taxAmount = tax ? (subtotal * tax.rate / 100) : 0;
    const total = subtotal + taxAmount - (discount || 0);

    const invoice = new Invoice({
      invoiceNumber: `INV-${moment().format('YYYYMM')}-${uuidv4().substring(0, 6).toUpperCase()}`,
      customer,
      booking,
      items,
      subtotal,
      tax: {
        rate: tax?.rate || 0,
        amount: taxAmount
      },
      discount: discount || 0,
      total,
      dueDate: new Date(dueDate),
      notes
    });

    await invoice.save();
    await invoice.populate('customer', 'name email phone');
    await invoice.populate('booking', 'service date');

    res.status(201).json({
      message: 'Invoice created successfully',
      invoice
    });
  } catch (error) {
    console.error('Create invoice error:', error);
    res.status(500).json({ message: 'Server error creating invoice' });
  }
});

// @route   PUT /api/invoices/:id
// @desc    Update invoice
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const {
      items,
      tax,
      discount,
      dueDate,
      notes,
      status
    } = req.body;

    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    // Update fields
    if (items) {
      invoice.items = items;
      invoice.subtotal = items.reduce((sum, item) => {
        item.total = item.quantity * item.unitPrice;
        return sum + item.total;
      }, 0);
    }

    if (tax) invoice.tax = tax;
    if (discount !== undefined) invoice.discount = discount;
    if (dueDate) invoice.dueDate = new Date(dueDate);
    if (notes !== undefined) invoice.notes = notes;
    if (status) invoice.status = status;

    // Recalculate total
    const taxAmount = invoice.tax.rate ? (invoice.subtotal * invoice.tax.rate / 100) : 0;
    invoice.tax.amount = taxAmount;
    invoice.total = invoice.subtotal + taxAmount - invoice.discount;

    await invoice.save();
    await invoice.populate('customer', 'name email phone');

    res.json({
      message: 'Invoice updated successfully',
      invoice
    });
  } catch (error) {
    console.error('Update invoice error:', error);
    res.status(500).json({ message: 'Server error updating invoice' });
  }
});

// @route   PUT /api/invoices/:id/payment
// @desc    Record payment for invoice
// @access  Private
router.put('/:id/payment', auth, async (req, res) => {
  try {
    const { paymentMethod } = req.body;

    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    if (invoice.status === 'paid') {
      return res.status(400).json({ message: 'Invoice is already paid' });
    }

    invoice.status = 'paid';
    invoice.paidDate = new Date();
    invoice.paymentMethod = paymentMethod;

    await invoice.save();
    await invoice.populate('customer', 'name email phone');

    res.json({
      message: 'Payment recorded successfully',
      invoice
    });
  } catch (error) {
    console.error('Record payment error:', error);
    res.status(500).json({ message: 'Server error recording payment' });
  }
});

// @route   DELETE /api/invoices/:id
// @desc    Delete invoice
// @access  Manager
router.delete('/:id', managerAuth, async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    if (invoice.status === 'paid') {
      return res.status(400).json({ message: 'Cannot delete paid invoice' });
    }

    await Invoice.findByIdAndDelete(req.params.id);

    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error('Delete invoice error:', error);
    res.status(500).json({ message: 'Server error deleting invoice' });
  }
});

module.exports = router;