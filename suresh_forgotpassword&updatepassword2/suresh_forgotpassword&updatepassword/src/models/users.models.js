const bcrypt = require('bcrypt');

exports.fetchAllUsers = async (req, count) => {
    if (!count) {
        var page = req.body.page;

        if (!page) {
            page = 1;
        }

        var page_limit = ((page * 25) - 25);

        const result = await req.app.get('db').query("SELECT id, first_name, last_name, email, is_admin, creation_date, active, abbreviation FROM psp_staff WHERE email != ''" + " LIMIT " + page_limit + ", 25");
        return result;
    } else {
        const count_rows = await req.app.get('db').query("SELECT count(id) as total_count FROM psp_staff WHERE email != ''");
        return count_rows;
    }
}

exports.getUserById = async (req) => {
    const userId = req.session.userId
    const result = await req.app.get('db').query("SELECT id, first_name, last_name, email, is_admin, creation_date, active, abbreviation FROM psp_staff WHERE id = ? ORDER BY ID DESC LIMIT 1", [userId]);
    return result;

}

exports.createUser = async (req) => {
    const password = req.body.password
    const admin = Number(req.body.admin)

    bcrypt.genSalt(10, (err, salt) => {

        bcrypt.hash(password, salt, (err, hash) => {
            const query = 'INSERT INTO psp_staff (`psp_id`, `first_name`, `last_name`, `email`, `password`, `is_admin`, `active`, `abbreviation`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';

            result = req.app.get('db').query(query, [req.body.company, req.body.first_name, req.body.last_name, req.body.email, hash, admin, 1, req.body.abbreviation]);
        });
    });
}



exports.updateUserPassword = async (request, response) => {
    const user_id = request.id
    if (!user_id) {
        return undefined
    }
    const { newpassword } = request.body
    const hashedpassword = await bcrypt.hash(newpassword, 10)
    const query = `UPDATE psp_staff SET password = ? where id = ?`
    const result = await request.app.get("db").query(query, [hashedpassword, user_id])
    return result
}


exports.removeToken = async (request, response) => {
    const user_id = request.id
    const query = 'DELETE from password_reset_token where psp_staff_id = ?'
    const result = await request.app.get("db").query(query, [user_id])
    return result
}
