import ProductModel from "../models/product.js";

export const AddProduct = async (req, res) => {
  const {
    title,
    description,
    sku,
    category,
    images,
    src,
    color,
    colors,
    size,
    Size,
    price,
    compareAtPrice,
    stock,
    brand,
    tags = [],
    status = "draft",
    createdBy,
  } = req.body;

  // Process images & src
  const rawImages = src || images || [];
  const imageArr = Array.isArray(rawImages) ? rawImages : (rawImages ? [rawImages] : []);
  const formattedImages = imageArr.map(img => (typeof img === 'string' ? { url: img } : img));
  const formattedSrc = imageArr.map(img => (typeof img === 'string' ? img : img?.url)).filter(Boolean);

  // Process color & colors
  const rawColor = colors || color || [];
  const colorArr = Array.isArray(rawColor) ? rawColor : (rawColor ? [rawColor] : []);

  // Process size & Size
  const rawSize = Size || size || [];
  const sizeArr = Array.isArray(rawSize) ? rawSize : (rawSize ? [rawSize] : []);

  const product = {
    title,
    description,
    sku,
    category: category || null,
    images: formattedImages,
    src: formattedSrc,
    color: colorArr,
    colors: colorArr,
    size: sizeArr,
    Size: sizeArr,
    price,
    compareAtPrice,
    stock,
    brand,
    tags,
    status,
    createdBy,
  };

  try {
    const result = await ProductModel.create(product);
    res.status(201).json({ success: true, product: result });
    console.log('New product added..!');
  } catch (err) {
    console.log('product add failed.', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const GetProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ProductModel.findOne({ _id: id });
    if (!result) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json(result);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const GetAllProducts = async (req, res) => {
  try {
    const filter = req.query.status ? { status: req.query.status } : {};
    const AllProducts = await ProductModel.find(filter).sort({ createdAt: -1 });
    res.status(200).json(AllProducts);
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const DeleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ProductModel.findOneAndDelete({ _id: id });
    if (!result) {
      return res.status(404).json({ success: false, message: "Product doesn't exist in Database." });
    }
    res.status(200).json({ success: true, message: "Product deleted" });
    console.log('One Product has been deleted');
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const UpdateProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const updateData = { ...req.body };

    const rawImages = updateData.src || updateData.images;
    if (rawImages !== undefined) {
      const imageArr = Array.isArray(rawImages) ? rawImages : (rawImages ? [rawImages] : []);
      updateData.images = imageArr.map(img => (typeof img === 'string' ? { url: img } : img));
      updateData.src = imageArr.map(img => (typeof img === 'string' ? img : img?.url)).filter(Boolean);
    }

    const rawColor = updateData.colors || updateData.color;
    if (rawColor !== undefined) {
      const colorArr = Array.isArray(rawColor) ? rawColor : (rawColor ? [rawColor] : []);
      updateData.color = colorArr;
      updateData.colors = colorArr;
    }

    const rawSize = updateData.Size || updateData.size;
    if (rawSize !== undefined) {
      const sizeArr = Array.isArray(rawSize) ? rawSize : (rawSize ? [rawSize] : []);
      updateData.size = sizeArr;
      updateData.Size = sizeArr;
    }

    const updatedProduct = await ProductModel.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    console.log('Product updated successfully.');
    res.status(200).json({ success: true, product: updatedProduct });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
