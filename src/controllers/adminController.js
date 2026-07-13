import Product from "../models/Product.js";

/** Keep data URLs intact; normalize /uploads/ paths */
function normalizeImageUrl(url) {
    if (!url || typeof url !== 'string') return '';
    const trimmed = url.trim();
    if (trimmed.startsWith('data:')) return trimmed;
    const match = trimmed.match(/\/uploads\/[^?#\s]+/i);
    if (match) return match[0];
    return trimmed;
}

function prioritizeImages(images) {
    const embedded = images.filter((url) => url.startsWith('data:'));
    const uploaded = images.filter((url) => url.startsWith('/uploads/'));
    const other = images.filter((url) => !url.startsWith('data:') && !url.startsWith('/uploads/'));
    return [...embedded, ...uploaded, ...other];
}

function normalizeProductPayload(body) {
    let images = Array.isArray(body.images)
        ? body.images.map(normalizeImageUrl).filter(Boolean)
        : [];

    if (body.imageUrl?.trim()) {
        const normalized = normalizeImageUrl(body.imageUrl);
        if (normalized && !images.includes(normalized)) {
            images.unshift(normalized);
        }
    } else if (body.image?.trim()) {
        const normalized = normalizeImageUrl(body.image);
        if (normalized && !images.includes(normalized)) {
            images.unshift(normalized);
        }
    }

    images = prioritizeImages(images);

    const primary = images[0] || '';

    return {
        ...body,
        images,
        imageUrl: primary,
        image: primary,
    };
}

export const addProduct = async (req, res) => {
    try {
        const payload = normalizeProductPayload(req.body);
        if (!payload.images?.length) {
            return res.status(400).json({ message: 'At least one product image is required' });
        }
        const newProduct = new Product(payload);
        const savedProduct = await newProduct.save();
        res.status(201).json({ message: "Product added successfully", product: savedProduct });
    } catch (error) {
        res.status(500).json({ message: "Failed to add product", error: error.message });
    }
};

export const updateProduct = async (req, res) => {
    const { productId } = req.params;
    try {
        const payload = normalizeProductPayload(req.body);
        if (!payload.images?.length) {
            return res.status(400).json({ message: 'At least one product image is required' });
        }
        const updatedProduct = await Product.findByIdAndUpdate(productId, payload, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }   
        res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
        res.status(500).json({ message: "Failed to update product", error: error.message });
    }   
};
export const deleteProduct = async (req, res) => {
    const { productId } = req.params;
    try {
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete product", error: error.message });
    }
};

export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json({ products });
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve products", error: error.message });
    }
};