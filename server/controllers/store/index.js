const createSlug = require("../../utils/createSlug");
const { removeUploadFile } = require("../../utils/removeUploadFile");
const { uploadMediaToCloudinary } = require("../../utils/cloudinary");
const { Product, Gallery, Store } = require("../../models");

async function getStoreInfo(req, res) {
  const slug = req.params;
  try {
    const store = await Store.findOne({
      where: { slug },
      attributes: [{ exclude: ["userId"] }],
    });

    if (!store) return res.status(404).json({ message: "Store not found" });

    const payload = {
      name: store.name,
      slug: slug,
      image: store.image,
      city: store.city,
      avatar: store.avatar,
      description: store.description,
    };

    return res.status(200).json({ data: payload });
  } catch (error) {
    res.status(500).send({
      message: "Failed to retrieve store info",
      error: error.message,
    });
  }
}

async function createProduct(req, res) {
  try {
    const storeId = req.user?.storeId;

    if (!storeId) {
      return res.status(400).send({ message: "You don't have a store." });
    }

    const { name, description, price, stock, categoryId } = req.body;

    if (!name || !description || !price || !stock || !categoryId) {
      return res.status(400).send({ message: "All fields are required" });
    }

    if (!req.files || req.files.length === 0) {
      return res
        .status(400)
        .send({ message: "You must upload at least 1 image" });
    }

    const slug = await createSlug(name);

    const existingProduct = await Product.findOne({ where: { slug } });
    if (existingProduct) {
      return res.status(400).send({
        message: "Product name must be unique, Please choose another",
      });
    }

    const newProduct = await Product.create({
      storeId,
      name,
      slug,
      description,
      price,
      stock,
      categoryId,
    });

    const uploadPromises = req.files.map(async (file) => {
      // Upload media ke Cloudinary
      const uploadedMedia = await uploadMediaToCloudinary(file.path);

      // Setelah berhasil upload, hapus file lokal
      await removeUploadFile(file.path);

      return uploadedMedia;
    });

    const uploadedImages = await Promise.all(uploadPromises);

    const images = uploadedImages.map((url) => ({
      productId: newProduct.id,
      image: url.secure_url, // Misalnya Cloudinary mengembalikan URL di property secure_url
    }));

    await Gallery.bulkCreate(images);

    return res.status(201).send({ message: "New product is added" });
  } catch (error) {
    return res.status(500).send({
      message: "Failed to create new product",
      error: error.message,
    });
  }
}

async function getAllStoreProducts(req, res) {
  try {
  } catch (error) {}
}

async function updateProduct(req, res) {
  try {
  } catch (error) {}
}

async function deleteProduct(req, res) {
  try {
  } catch (error) {}
}

// admin only
async function getAllStores(req, res) {
  try {
  } catch (error) {}
}

async function getStoreStatistic(req, res) {
  const slug = req.params;
  try {
    const store = await Store.findOne({
      where: { slug },
      attributes: [{ exclude: ["userId"] }],
      include: [{ model: Product, as: "product" }],
    });

    if (!store) return res.status(404).json({ message: "Store not found" });

    return res.status(200).json({ data: store });
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve store detail",
      error: error.message,
    });
  }
}

async function updateStore(req, res) {
  try {
  } catch (error) {}
}

// admin only
async function deleteStore(req, res) {
  try {
  } catch (error) {}
}

async function getMyStoreProduct(req, res) {
  try {
  } catch (error) {}
}

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getAllStores,
  getStoreInfo,
  getStoreStatistic,
  getAllStoreProducts,
};
