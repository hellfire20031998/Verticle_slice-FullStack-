import { useState } from "react";
import type { LineItem } from "../types/invoice";
import { createInvoice } from "../api/invoices";
import { useNavigate } from "react-router-dom";

export default function InvoiceForm() {
  const navigate = useNavigate();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [items, setItems] = useState<LineItem[]>([
    { description: "", quantity: 1, unitPrice: 0 },
  ]);

  const [discountType, setDiscountType] = useState("NONE");
  const [discountValue, setDiscountValue] = useState(0);

  const addItem = () => {
    setItems([...items, { description: "", quantity: 1, unitPrice: 0 }]);
  };

  const removeItem = (i: number) => {
    if (items.length === 1) {
      alert("At least one line item is required.");
      return;
    }
    setItems(items.filter((_, idx) => idx !== i));
  };

  // -------------------------
  // VALIDATION
  // -------------------------
  const validateForm = () => {
    if (!phoneNumber || phoneNumber.trim().length !== 10) {
      alert("Phone number must be 10 digits.");
      return false;
    }

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (!item.description || item.description.trim().length === 0) {
        alert(`Description is required for line item #${i + 1}`);
        return false;
      }

      if (item.quantity <= 0) {
        alert(`Quantity must be > 0 for item #${i + 1}`);
        return false;
      }

      if (item.unitPrice < 0) {
        alert(`Unit price cannot be negative for item #${i + 1}`);
        return false;
      }
    }

    if (discountType === "PERCENT") {
      if (discountValue < 0 || discountValue > 100) {
        alert("Percent discount must be between 0 and 100");
        return false;
      }
    }

    if (discountType === "FIXED") {
      if (discountValue < 0) {
        alert("Fixed discount cannot be negative");
        return false;
      }
    }

    return true;
  };

  const updateItem = (i: number, field: keyof LineItem, value: any) => {
    const updated = [...items];
    updated[i][field] = value;
    setItems(updated);
  };

  const submit = () => {
    if (!validateForm()) return;

    createInvoice({
      phoneNumber,
      lineItems: items,
      discountType,
      discountValue: discountType === "NONE" ? 0 : discountValue,
      createdBy: "op1",
    }).then(() => navigate("/"));
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "30px", width: "100%" }}>

      {/* HEADER WITH BACK BUTTON */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1px",
        }}
      >
        <h2 style={{ fontSize: "24px", fontWeight: 700 }}>Create Invoice</h2>

        <button
          onClick={() => navigate("/")}
          style={{
            padding: "8px",
            background: "#eee",
            color: "black",
            borderRadius: "6px",
            border: "1px solid #ccc",
            cursor: "pointer",
          }}
        >
          ← Back to Invoices
        </button>
      </div>

      {/* CUSTOMER PHONE SECTION */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <h3 style={{ fontSize: "20px", fontWeight: 600 }}>Customer</h3>

        <div>
          <label style={{ fontWeight: 600 }}>Phone Number</label>
          <input
            type="text"
            maxLength={10}
            placeholder="Enter 10 digit phone number"
            style={{
              width: "250px",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              marginTop: "6px",
            }}
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
          />
        </div>
      </div>

      {/* LINE ITEMS */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <h3 style={{ fontSize: "20px", fontWeight: 600 }}>Line Items</h3>

        <div style={{ display: "flex", fontSize: "14px", fontWeight: 600 }}>
          <div style={{ flex: 1 }}>Description</div>
          <div style={{ width: "90px", textAlign: "center" }}>Quantity</div>
          <div style={{ width: "120px", textAlign: "center" }}>Unit Price</div>
          <div style={{ width: "70px", textAlign: "center" }}>Delete</div>
        </div>

        {items.map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              gap: "12px",
              alignItems: "center",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #ddd",
              background: "white",
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
            }}
          >
            <input
              placeholder="Description"
              style={{ flex: 1, padding: "8px", border: "1px solid #ccc", borderRadius: "6px" }}
              value={item.description}
              onChange={(e) => updateItem(i, "description", e.target.value)}
            />

            <input
              type="number"
              style={{
                width: "90px",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "6px",
                textAlign: "center",
              }}
              value={item.quantity}
              onChange={(e) => updateItem(i, "quantity", Number(e.target.value))}
            />

            <input
              type="number"
              style={{
                width: "120px",
                padding: "8px",
                border: "1px solid #ccc",
                borderRadius: "6px",
                textAlign: "center",
              }}
              value={item.unitPrice}
              onChange={(e) => updateItem(i, "unitPrice", Number(e.target.value))}
            />

            <button
              onClick={() => removeItem(i)}
              style={{
                padding: "6px",
                background: "red",
                color: "white",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer",
              }}
            >
              Delete
            </button>
          </div>
        ))}

        <button
          onClick={addItem}
          style={{
            padding: "10px 16px",
            background: "black",
            color: "white",
            borderRadius: "6px",
            width: "fit-content",
          }}
        >
          Add Item
        </button>
      </div>

      {/* DISCOUNT SECTION */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <h3 style={{ fontSize: "20px", fontWeight: 600 }}>Discount</h3>

        <div style={{ display: "flex", fontSize: "14px", fontWeight: 600 }}>
          <div style={{ flex: 1 }}>Type</div>
          <div style={{ width: "120px", textAlign: "center" }}>Value</div>
        </div>

        <div
          style={{
            display: "flex",
            gap: "12px",
            padding: "12px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            background: "white",
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
          }}
        >
          <select
            style={{
              flex: 1,
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "6px",
            }}
            value={discountType}
            onChange={(e) => setDiscountType(e.target.value)}
          >
            <option value="NONE">None</option>
            <option value="PERCENT">Percent</option>
            <option value="FIXED">Fixed</option>
          </select>

          <input
            type="number"
            style={{
              width: "120px",
              padding: "8px",
              border: "1px solid #ccc",
              borderRadius: "6px",
              textAlign: "center",
            }}
            value={discountValue}
            onChange={(e) => setDiscountValue(Number(e.target.value))}
          />
        </div>
      </div>

      <button
        onClick={submit}
        style={{
          padding: "10px 18px",
          background: "black",
          color: "white",
          borderRadius: "6px",
          width: "fit-content",
        }}
      >
        Create Invoice
      </button>
    </div>
  );
}
