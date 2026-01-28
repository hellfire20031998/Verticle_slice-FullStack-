import * as InvoiceService from "../../services/invoices/service.js";

export async function createInvoice(req, res, next) {
  try {
    const data = await InvoiceService.createInvoice(req.body);
    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
}

export async function listInvoices(req, res, next) {
  try {
    const data = await InvoiceService.listInvoices({
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10,
      status: req.query.status || "",
      phoneNumber: req.query.phoneNumber || "",
    });

    res.json(data);
  } catch (err) {
    next(err);
  }
}


export async function getInvoiceById(req, res, next) {
  try {
    const data = await InvoiceService.getInvoiceById(req.params.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function voidInvoice(req, res, next) {
  try {
    const data = await InvoiceService.voidInvoice(
      req.params.id,
      req.body.reason
    );
    res.json(data);
  } catch (err) {
    next(err);
  }
}
