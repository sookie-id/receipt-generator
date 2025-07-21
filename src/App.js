import { useState } from "react";

const defaultItemList = [
  { name: "Soft Cookie 1 pcs", price: 20_000 },
  { name: "Soft Cookies 3 pcs", price: 55_000 },
  { name: "Soft Cookies 6 pcs", price: 100_000 },
  { name: "Soft Cookies 12 pcs", price: 190_000 },
  { name: "Tiramisu", price: 35_000 },
  { name: "Banana Milk", price: 35_000 },
  { name: "Brookies", price: 18_000 },
  { name: "Milo Dinosaur", price: 22_000 },
  { name: "Matcha Latte", price: 28_000 },
  { name: "Aren Latte", price: 25_000 },
  { name: "Cold Brew", price: 20_000 },
  { name: "Kefir", price: 28_000 },
  { name: "Mineral Water", price: 8_000 },
];

export default function App() {
  const [receiptData, setReceiptData] = useState(null);
  const [itemList, setItemList] = useState(
    JSON.parse(localStorage.getItem("itemList")) || defaultItemList
  );

  return (
    <div className="app">
      {receiptData ? (
        <Receipt
          purchasedItems={receiptData.purchasedItems}
          total={receiptData.total}
          onClose={() => setReceiptData(null)}
        />
      ) : (
        <Menu
          onGenerateReceipt={setReceiptData}
          itemList={itemList}
          onAddItem={setItemList}
        />
      )}
    </div>
  );
}

export function Menu({ onGenerateReceipt, itemList, onAddItem }) {
  const [quantities, setQuantities] = useState(Array(itemList.length).fill(0));

  const handleQuantityChange = (index, delta) => {
    setQuantities((prev) =>
      prev.map((qty, i) => (i === index ? Math.max(0, qty + delta) : qty))
    );
  };

  const handleGenerateReceipt = () => {
    const purchasedItems = itemList
      .map((item, i) => ({
        ...item,
        quantity: quantities[i],
        subtotal: item.price * quantities[i],
      }))
      .filter((item) => item.quantity > 0);

    const total = purchasedItems.reduce((sum, item) => sum + item.subtotal, 0);

    onGenerateReceipt({ purchasedItems, total });
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    const name = e.target.itemName.value.trim();
    const price = Number(e.target.itemPrice.value);
    if (!name || !price || price <= 0) return;
    const newItemList = [...itemList, { name, price }];
    onAddItem(newItemList);
    localStorage.setItem("itemList", JSON.stringify(newItemList));
    e.target.reset();
  };

  // Split the itemList into two columns
  const mid = Math.ceil(itemList.length / 2);
  const leftItems = itemList.slice(0, mid);
  const rightItems = itemList.slice(mid);

  return (
    <div className="menu" style={{ maxWidth: "1000px", margin: "0 auto" }}>
      <h2>Menu</h2>
      <div style={{ display: "flex", gap: "32px" }}>
        <MenuColumn
          items={leftItems}
          startIndex={0}
          quantities={quantities}
          handleQuantityChange={handleQuantityChange}
        />
        <MenuColumn
          items={rightItems}
          startIndex={mid}
          quantities={quantities}
          handleQuantityChange={handleQuantityChange}
        />
      </div>
      <button id="generate-receipt" onClick={handleGenerateReceipt}>
        Generate Receipt
      </button>

      <div style={{ marginTop: "24px" }}>
        <h3>Add New Item</h3>
        <form
          onSubmit={(e) => handleAddItem(e)}
          style={{ display: "flex", gap: "8px", alignItems: "center" }}
        >
          <input
            name="itemName"
            type="text"
            placeholder="Item name"
            required
            style={{ width: "160px" }}
          />
          <input
            name="itemPrice"
            type="number"
            placeholder="Price"
            min="1"
            required
            style={{ width: "100px" }}
          />
          <button type="submit">Add Item</button>
        </form>
      </div>
    </div>
  );
}

function MenuColumn({ items, startIndex, quantities, handleQuantityChange }) {
  const handleDelete = (globalIndex) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      const updatedItemList =
        JSON.parse(localStorage.getItem("itemList")) || [];
      updatedItemList.splice(globalIndex, 1);
      localStorage.setItem("itemList", JSON.stringify(updatedItemList));
      window.location.reload();
    }
  };

  return (
    <table style={{ flex: 1 }}>
      <thead>
        <tr>
          <th style={{ textAlign: "left" }}>Name</th>
          <th style={{ textAlign: "right" }}>Price</th>
          <th style={{ textAlign: "center" }}>Quantity</th>
        </tr>
      </thead>
      <tbody>
        {items.map((item, index) => (
          <tr key={startIndex + index}>
            <td>{item.name}</td>
            <td style={{ textAlign: "right" }}>
              {item.price.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
              })}
            </td>
            <td style={{ textAlign: "center" }}>
              <button
                onClick={() => handleQuantityChange(startIndex + index, -1)}
              >
                -
              </button>
              <span style={{ margin: "0 8px" }}>
                {quantities[startIndex + index]}
              </span>
              <button
                onClick={() => handleQuantityChange(startIndex + index, 1)}
              >
                +
              </button>
            </td>
            <td>
              <button
                onClick={() => handleDelete(startIndex + index)}
                title="Delete item"
              >
                🗑️
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Receipt({ purchasedItems, total, onClose }) {
  return (
    <div className="receipt" style={{ maxWidth: "456px", margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img src="/logo.png" alt="Logo" style={{ width: "200px" }} />
      </div>
      <div
        style={{ fontFamily: "Robotto", textAlign: "center", margin: "16px 0" }}
      >
        <p>Jl. Kebagusan Raya No. 17, Pasar Minggu, Jakarta Selatan</p>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          margin: "16px 0",
        }}
      >
        <span style={{ fontFamily: "Robotto" }}>
          {new Date().toLocaleDateString("id-ID", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
        <span style={{ fontFamily: "Robotto" }}>
          {new Date().toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </span>
      </div>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ textAlign: "left" }}>Item</th>
            <th style={{ textAlign: "center" }}>Quantity</th>
            <th style={{ textAlign: "right" }}>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {purchasedItems.map((item, idx) => (
            <tr key={idx}>
              <td>{item.name}</td>
              <td style={{ textAlign: "center" }}>{item.quantity}</td>
              <td style={{ textAlign: "right" }}>
                {item.subtotal.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}
              </td>
            </tr>
          ))}
          <tr>
            <td colSpan={2} style={{ textAlign: "left", fontWeight: "bold" }}>
              Total
            </td>
            <td style={{ textAlign: "right", fontWeight: "bold" }}>
              {total.toLocaleString("id-ID", {
                style: "currency",
                currency: "IDR",
              })}
            </td>
          </tr>
        </tbody>
      </table>
      <div
        style={{
          fontFamily: "Robotto",
          lineHeight: "1.2",
          margin: "24px 0",
          textAlign: "center",
          fontSize: "1.1em",
        }}
      >
        <p>
          Terima kasih! Selamat menikmati.
          <br />
          Ditunggu kedatangannya kembali.
        </p>
        <p>
          Kritik dan Saran:
          <br />
          0831 0729 4243 / Instagram: @sookie_id
        </p>
      </div>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
