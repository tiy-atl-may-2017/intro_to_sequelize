const express =  require('express');
const router = express.Router();
const models = require('./models');

router.get('/', function(req, res) {
  res.redirect('/students');
});

const getStudent = function(req, res, next) {
  models.Student.findById(req.params.studentid).then(function(student) {
    if (student) {
      req.student = student;
      next();
    } else {
      res.status(404).send("Not Found");
    }
  });
}

router.get("/students", function(req, res) {
  models.Student.findAll().then(function(students) {
    res.render("index", {
      students: students
    });
  });
});

router.post("/students", function(req, res) {
  req.checkBody("name", "Name must be present.").notEmpty();

  const data = {
    name: req.body.name,
    email: req.body.email,
    like_js: req.body.like_js,
    fav_candy: req.body.fav_candy,
    spec: req.body.spec
  };

  req.getValidationResult().then(function(result) {
    if (result.isEmpty()) {
      models.Student.create(data).then(function(student) {
        res.redirect("/");
      });
    } else {
      res.redirect("/students");
    }
  });
});

router.post("/students/:studentid/delete", getStudent, function(req, res) {
  req.student.destroy().then(function() {
    res.redirect("/");
  });
});

module.exports = router;
