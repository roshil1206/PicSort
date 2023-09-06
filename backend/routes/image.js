const router = require("express").Router();
const {
  addImageDetailsToDb,
  getImagesByTag,
  getImageByIdDB,
} = require("../db/queries");
const upload = require("../utils/multer");
const { uploadFile, fetchFile } = require("../utils/s3");
const { response } = require("../utils/functions");
const { verify } = require("../middleware/auth");
const uuid = require("uuid");
const extractText = require("../utils/textact");
const { getCloudFrontDomain } = require("../utils/CloudFront");

router.use(verify);

router.post("/upload", upload.single("file"), async (req, res) => {
  const { file } = req;
  const { user } = req;
  const folder = "unsorted";
  const ImageId = uuid.v4();
  const path = user.id + "/" + ImageId;

  const uploadedFile = await uploadFile(path, file);
  const domainName = await getCloudFrontDomain();

  await addImageDetailsToDb({
    id: ImageId,
    userId: user.id,
    name: file.originalname,
    key: uploadedFile.key,
    folder,
    url: "https://" + domainName + "/" + uploadedFile.key,
    tags: [],
  });
  return response(res, 200, true, { message: "File Successfully uploaded." });
});

router.get("/:tag", async (req, res) => {
  const { user } = req;
  const { tag } = req.params;

  return response(res, 200, true, await getImagesByTag(user.id, tag));
});

router.get("/image/:id", async (req, res) => {
  const { user } = req;
  const { id } = req.params;

  console.log(await getImageByIdDB(id));
  return response(res, 200, true, await getImageByIdDB(id));
});

router.get("/", async (req, res) => {
  const { user } = req;
  return response(res, 200, true, { tags: user.tags });
});

router.post("/getText", async (req, res) => {
  const { id } = req.body;
  const imageData = await getImageByIdDB(id);
  const file = await fetchFile(imageData.key);
  const text = await extractText(file.Body);

  return response(res, 200, true, text);
});

module.exports = router;
