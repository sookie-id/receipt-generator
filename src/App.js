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
  const itemList =
    JSON.parse(localStorage.getItem("itemList")) || defaultItemList;

  return (
    <div className="app">
      {receiptData ? (
        <Receipt
          purchasedItems={receiptData.purchasedItems}
          total={receiptData.total}
          onClose={() => setReceiptData(null)}
        />
      ) : (
        <Menu onGenerateReceipt={setReceiptData} itemList={itemList} />
      )}
    </div>
  );
}

export function Menu({ onGenerateReceipt, itemList }) {
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

  return (
    <>
      <h2>Menu</h2>
      <ul>
        {itemList.map((item, index) => (
          <li key={index}>
            {item.name} - Rp{item.price.toLocaleString()} &nbsp;
            <button onClick={() => handleQuantityChange(index, -1)}>-</button>
            <span style={{ margin: "0 8px" }}>{quantities[index]}</span>
            <button onClick={() => handleQuantityChange(index, 1)}>+</button>
          </li>
        ))}
      </ul>
      <button onClick={handleGenerateReceipt}>Generate Receipt</button>
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
            {item.name} x {item.quantity} = {item.subtotal.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}
          </li>
        ))}
      </ul>
      <h3>Total: {total.toLocaleString("id-ID", { style: "currency", currency: "IDR" })}</h3>
      <button onClick={onClose}>Close</button>
    </div>
  );
}
