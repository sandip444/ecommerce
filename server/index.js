const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

let products = [
  {
    id: "SEN-1001",
    title: "ThermoSense Pro Temperature Sensor",
    category: "Temperature",
    price: 129.0,
    stock: 42,
    status: "In Stock",
    description:
      "Industrial-grade temperature sensor with rapid response time and high accuracy for HVAC and manufacturing environments.",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
    specs: ["-40°C to 125°C", "±0.2°C accuracy", "IP67 sealed housing"],
  },
  {
    id: "SEN-1002",
    title: "PulseGuard Vibration Sensor",
    category: "Vibration",
    price: 189.0,
    stock: 31,
    status: "In Stock",
    description:
      "Multi-axis vibration sensor for predictive maintenance with real-time alerts and analytics-ready output.",
    image:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=800&q=80",
    specs: ["3-axis monitoring", "4 kHz sampling", "Modbus-ready"],
  },
  {
    id: "SEN-1003",
    title: "AeroFlow Pressure Sensor",
    category: "Pressure",
    price: 149.0,
    stock: 18,
    status: "Low Stock",
    description:
      "Compact pressure sensor designed for airflow systems with long-life calibration and rugged casing.",
    image:
      "https://images.unsplash.com/photo-1581090700227-1e37b190418e?auto=format&fit=crop&w=800&q=80",
    specs: ["0-10 bar", "0.5% FS accuracy", "Stainless steel body"],
  },
  {
    id: "SEN-1004",
    title: "LumaTrace Optical Sensor",
    category: "Optical",
    price: 99.0,
    stock: 0,
    status: "Out of Stock",
    description:
      "Optical sensor for line detection and quality control with adjustable sensitivity and smart filtering.",
    image:
      "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=800&q=80",
    specs: ["0.1 mm resolution", "Auto-gain", "Class 2 laser"],
  },
  {
    id: "SEN-1005",
    title: "HydroSense Humidity Sensor",
    category: "Humidity",
    price: 139.0,
    stock: 27,
    status: "In Stock",
    description:
      "Precision humidity sensor for cleanrooms and storage facilities with quick drift compensation.",
    image:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
    specs: ["0-100% RH", "±1.5% RH", "Digital I2C output"],
  },
  {
    id: "SEN-1006",
    title: "GeoTrack Proximity Sensor",
    category: "Proximity",
    price: 159.0,
    stock: 12,
    status: "Low Stock",
    description:
      "Short-range proximity sensor ideal for automated sorting lines with configurable detection zones.",
    image:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
    specs: ["0-50 mm range", "PNP/NPN output", "IP68 rated"],
  },
];

const findProduct = (id) => products.find((product) => product.id === id);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/products", (req, res) => {
  res.json(products);
});

app.get("/api/products/:id", (req, res) => {
  const product = findProduct(req.params.id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  return res.json(product);
});

app.post("/api/products", (req, res) => {
  const { title, category, price, stock, description, image, specs, status } =
    req.body;

  if (!title || !category) {
    return res.status(400).json({ message: "Title and category are required." });
  }

  const newProduct = {
    id: `SEN-${Date.now()}`,
    title,
    category,
    price: Number(price) || 0,
    stock: Number(stock) || 0,
    status: status || (Number(stock) > 0 ? "In Stock" : "Out of Stock"),
    description: description || "Custom sensor configuration.",
    image:
      image ||
      "https://images.unsplash.com/photo-1555661530-68c8e98db4e0?auto=format&fit=crop&w=800&q=80",
    specs: Array.isArray(specs) ? specs : [],
  };

  products = [newProduct, ...products];
  return res.status(201).json(newProduct);
});

app.put("/api/products/:id", (req, res) => {
  const { id } = req.params;
  const product = findProduct(id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const updates = req.body;
  const updatedProduct = {
    ...product,
    ...updates,
    price:
      updates.price === undefined ? product.price : Number(updates.price) || 0,
    stock:
      updates.stock === undefined ? product.stock : Number(updates.stock) || 0,
  };
  if (!updates.status) {
    updatedProduct.status =
      updatedProduct.stock > 0 ? "In Stock" : "Out of Stock";
  }

  products = products.map((item) => (item.id === id ? updatedProduct : item));
  return res.json(updatedProduct);
});

app.delete("/api/products/:id", (req, res) => {
  const { id } = req.params;
  const product = findProduct(id);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  products = products.filter((item) => item.id !== id);
  return res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Sensor shop API running on port ${PORT}`);
});
