module.exports = async function isAdmin(req, res, next) {
  try {
    if (req.user.role !== 'admin')
      return res
        .status(403)
        .send({ message: 'Forbidden !!! Access is Prohibited' });
    next();
  } catch (error) {
    console.log(error.message);
  }
};
