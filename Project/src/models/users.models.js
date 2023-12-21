const bcrypt = require("bcrypt");

exports.fetchAllUsers = async (req, count) => {
  if (!count) {
    var page = req.body.page;

    if (!page) {
      page = 1;
    }

    var page_limit = page * 24 - 24;

    const result = await req.app
      .get("db")
      .query(
        "SELECT id, first_name, last_name, email, is_admin, creation_date, active, abbreviation FROM psp_staff WHERE email != ''" +
          " LIMIT " +
          page_limit +
          ", 24"
      );
    return result;
  } else {
    const count_rows = await req.app
      .get("db")
      .query(
        "SELECT count(id) as total_count FROM psp_staff WHERE email != ''"
      );
    return count_rows;
  }
};

exports.getUserById = async (req) => {
  const userId = req.session.userId;
  const result = await req.app
    .get("db")
    .query(
      "SELECT id, first_name, last_name, email, is_admin, creation_date, active, abbreviation FROM psp_staff WHERE id = ? ORDER BY ID DESC LIMIT 1",
      [userId]
    );
  return result;
};

exports.createUser = async (req) => {
  const password = req.body.password;
  const admin = Number(req.body.admin);

  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
      const query =
        "INSERT INTO psp_staff (`psp_id`, `first_name`, `last_name`, `email`, `password`, `is_admin`, `active`, `abbreviation`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

      result = req.app
        .get("db")
        .query(query, [
          req.body.company,
          req.body.first_name,
          req.body.last_name,
          req.body.email,
          hash,
          admin,
          1,
          req.body.abbreviation,
        ]);
    });
  });
};
