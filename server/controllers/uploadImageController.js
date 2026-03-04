const uploadImageController = (req, res) => {
  try {
    const file = req.file;

    console.log(file);
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

export default uploadImageController;
