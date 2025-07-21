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
    <>
      <h2>Menu</h2>
      <div style={{ display: "flex", gap: "32px" }}>
        {/* Left Column */}
        <table style={{ flex: 1 }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>Name</th>
              <th style={{ textAlign: "right" }}>Price</th>
              <th style={{ textAlign: "center" }}>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {leftItems.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td style={{ textAlign: "right" }}>
                  {item.price.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })}
                </td>
                <td style={{ textAlign: "center" }}>
                  <button onClick={() => handleQuantityChange(index, -1)}>
                    -
                  </button>
                  <span style={{ margin: "0 8px" }}>{quantities[index]}</span>
                  <button onClick={() => handleQuantityChange(index, 1)}>
                    +
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Right Column */}
        <table style={{ flex: 1 }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>Name</th>
              <th style={{ textAlign: "right" }}>Price</th>
              <th style={{ textAlign: "center" }}>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {rightItems.map((item, index) => (
              <tr key={mid + index}>
                <td>{item.name}</td>
                <td style={{ textAlign: "right" }}>
                  {item.price.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })}
                </td>
                <td style={{ textAlign: "center" }}>
                  <button onClick={() => handleQuantityChange(mid + index, -1)}>
                    -
                  </button>
                  <span style={{ margin: "0 8px" }}>
                    {quantities[mid + index]}
                  </span>
                  <button onClick={() => handleQuantityChange(mid + index, 1)}>
                    +
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button onClick={handleGenerateReceipt}>Generate Receipt</button>
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
            style={{ flex: 1 }}
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
    </>
  );
}

function Receipt({ purchasedItems, total, onClose }) {
  return (
    <div className="receipt">
      <h2>Receipt</h2>
      <ul>
        {purchasedItems.map((item, idx) => (
          <li key={idx}>
            {item.name} x {item.quantity} ={" "}
            {item.subtotal.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
            })}
          </li>
        ))}
      </ul>
      <h3>
        Total:{" "}
        {total.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
      </h3>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
