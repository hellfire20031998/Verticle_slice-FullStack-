import { getCustomerByPhone } from "../../services/customers/service.js";

export async function findCustomer(req, res) {
  try {
    const { phoneNumber } = req.params;

    const customer = await getCustomerByPhone(phoneNumber);

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
        phoneNumber,
      });
    }

    res.json(customer);
  } catch (error) {
    console.error("Error finding customer:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
