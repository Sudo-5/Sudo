const express = require("express");
const { fetchReadme } = require("@varandas/fetch-readme");
const LearningPath = require("../models/LearningPath");
const { route } = require("./Videos");
const router = express.Router();

router.post("/add", async (req, res) => {
  try {
    // const readme = await Promise.any([
    //   fetchReadme({
    //     username: req.body.organisation,
    //     repository: req.body.repository,
    //     readme: "readme.md",
    //   }),
    //   fetchReadme({
    //     username: req.body.organisation,
    //     repository: req.body.repository,
    //     readme: "README.md",
    //   }),
    // ]);

    const readme = await fetchReadme({
      username: req.body.organisation,
      repository: req.body.repository,
      readme: "README.md",
    });
    if (readme) {
      console.log(readme);
      const newBody = { ...req.body, readme };
      const path = await LearningPath.create(newBody);
      return res.status(200).json({
        data: path,
        success: true,
      });
    }
    // if (readme2) {
    //   console.log(readme2);
    //   const newBody = { ...req.body, readme: readme2 };
    //   const path = LearningPath.create(newBody);
    //   return res.status(200).json({
    //     data: path,
    //     success: true,
    //   });
    // }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      data: err,
    });
  }
});

router.get("/all", async (req, res) => {
  try {
    const paths = await LearningPath.find({}).lean().exec();
    res.status(200).json({
      data: paths,
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      data: err,
    });
  }
});

router.get("/path/:id", async (req, res) => {
  try {
    const path = await LearningPath.findById(req.params.id).lean().exec();
    res.status(200).json({
      data: path,
      success: true,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      data: err,
    });
  }
});

module.exports = router;
