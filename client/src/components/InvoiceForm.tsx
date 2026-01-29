import { useState, useMemo } from "react";
import type { LineItem } from "../types/invoice";
import { createInvoice } from "../api/invoices";
import { useNavigate } from "react-router-dom";

export default function InvoiceForm() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

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

  const updateItem = (i: number, field: keyof LineItem, value: any) => {
    const updated = [...items];
    updated[i][field] = value;
    setItems(updated);
  };

  // ----------------------------------------
  // TOTAL CALCULATION
  // ----------------------------------------
  const totals = useMemo(() => {
    const subTotal = items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );

    let discountAmount = 0;

    if (discountType === "PERCENT") {
      discountAmount = (subTotal * discountValue) / 100;
    } else if (discountType === "FIXED") {
      discountAmount = discountValue;
    }

    const finalTotal = Math.max(0, subTotal - discountAmount);

    return { subTotal, discountAmount, finalTotal };
  }, [items, discountType, discountValue]);

  // ----------------------------------------
  // VALIDATION
  // ----------------------------------------
  const validateForm = () => {
    if (!phoneNumber || phoneNumber.trim().length !== 10) {
      alert("Phone number must be 10 digits.");
      return false;
    }

    for (let i = 0; i < items.length; i++) {
      const item = items[i];

      if (!item.description.trim()) {
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

    if (discountType === "PERCENT" && (discountValue < 0 || discountValue > 100)) {
      alert("Percent discount must be between 0 and 100");
      return false;
    }

    if (discountType === "FIXED" && discountValue < 0) {
      alert("Fixed discount cannot be negative");
      return false;
    }

    return true;
  };

  const submit = () => {
    if (!validateForm()) return;

    createInvoice({
      phoneNumber,
      lineItems: items,
      discountType,
      discountValue: discountType === "NONE" ? 0 : discountValue,
      createdBy: user.id,
    }).then(() => navigate("/invoices"));
  };

  // ----------------------------------------
  // UI
  // ----------------------------------------
  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>

      {/* HEADER */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <h2 style={{ fontSize: "24px", fontWeight: "700" }}>Create Invoice</h2>

        <button
          onClick={() => navigate("/invoices")}
          style={{
            padding: "8px 14px",
            background: "#eee",
            borderRadius: "6px",
            border: "1px solid #ccc",
            cursor: "pointer",
          }}
        >
          ← Back to Invoices
        </button>
      </div>

      {/* CUSTOMER */}
      <div style={{ marginTop: "20px" }}>
        <h3 style={{ fontSize: "20px", fontWeight: 600 }}>Customer</h3>

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

      {/* LINE ITEMS */}
      <div style={{ marginTop: "20px" }}>
        <h3 style={{ fontSize: "20px", fontWeight: 600 }}>Line Items</h3>

        <div style={{ display: "flex", fontWeight: 600 }}>
          <div style={{ flex: 1 }}>Description</div>
          <div style={{ width: "90px", textAlign: "center" }}>Qty</div>
          <div style={{ width: "120px", textAlign: "center" }}>Unit Price</div>
          <div style={{ width: "70px", textAlign: "center" }}>Delete</div>
        </div>

        {items.map((item, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              marginTop: "10px",
              padding: "12px",
              gap: "12px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              background: "#fff",
            }}
          >
            <input
              placeholder="Description"
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #ccc"
              }}
              value={item.description}
              onChange={(e) => updateItem(i, "description", e.target.value)}
            />

            <input
              type="number"
              onWheel={(e) => e.currentTarget.blur()}
              style={{
                width: "90px",
                textAlign: "center",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #ccc",
              }}
              value={item.quantity}
              onChange={(e) => updateItem(i, "quantity", Number(e.target.value))}
            />

            <input
              type="number"
              onWheel={(e) => e.currentTarget.blur()}
              style={{
                width: "120px",
                textAlign: "center",
                padding: "8px",
                borderRadius: "6px",
                border: "1px solid #ccc",
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
              }}
            >
              Delete
            </button>
          </div>
        ))}

        <button
          onClick={addItem}
          style={{
            marginTop: "12px",
            padding: "10px 16px",
            background: "black",
            color: "white",
            borderRadius: "6px",
          }}
        >
          Add Item
        </button>
      </div>

      {/* DISCOUNT */}
      <div style={{ marginTop: "20px" }}>
        <h3 style={{ fontSize: "20px", fontWeight: 600 }}>Discount</h3>

        <div style={{ display: "flex", gap: "12px", marginTop: "10px" }}>
          <select
            style={{
              flex: 1,
              padding: "8px",
              borderRadius: "6px",
              border: "1px solid #ccc",
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
            onWheel={(e) => e.currentTarget.blur()}
            style={{
              width: "120px",
              padding: "8px",
              textAlign: "center",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
            value={discountValue}
            onChange={(e) => setDiscountValue(Number(e.target.value))}
          />
        </div>
      </div>

      {/* TOTAL SUMMARY */}
      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          borderRadius: "8px",
          border: "1px solid #ddd",
          background: "#f9f9f9",
        }}
      >
        <h3 style={{ fontSize: "18px", marginBottom: "10px" }}>Summary</h3>

        <div><strong>Subtotal:</strong> ₹{totals.subTotal.toFixed(2)}</div>
        <div><strong>Discount:</strong> -₹{totals.discountAmount.toFixed(2)}</div>

        <div style={{ fontSize: "20px", fontWeight: 600, marginTop: "10px" }}>
          Final Total: ₹{totals.finalTotal.toFixed(2)}
        </div>
      </div>

      {/* SUBMIT BUTTON */}
      <button
        onClick={submit}
        style={{
          marginTop: "20px",
          padding: "12px 20px",
          background: "black",
          color: "white",
          borderRadius: "6px",
        }}
      >
        Create Invoice
      </button>
    </div>
  );
}
