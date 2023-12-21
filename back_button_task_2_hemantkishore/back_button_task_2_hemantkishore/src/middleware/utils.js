const bcrypt = require('bcrypt');
const date = require('date-and-time')
const rounds = 10;

// For authenticate login
const authenticateLogin = async (request, response) => {
    try {
        const { user_email, user_password } = request.body;
        
        const query = `SELECT * FROM psp_staff WHERE email = "${user_email}" LIMIT 1`;

        request.app.get('connection').query(query, function(error, data) {
            if (data === null || data.length == 0)
            {
                response.status(400).json({
                    field: "email_address",
                    message: "The email address you entered isn't connected to an account.",
                });
            } else
            {
                const result = data[0];
                bcrypt.compare(user_password, result.password, function(err, res) {
                    if (res == false) {
                        response.status(400).json({
                            field: "password",
                            message: "The password that you've entered is incorrect.",
                        });
                    } else {
                        request.session.email = result.email;
                        request.session.loggedin = true;
                        response.status(200).json({
                            message: "success",
                        });
                    }
                });
            }
        });
    } catch (error) {
        response.status(500).json({
            message: "An error occured",
        });
        console.log(error);
    }
}

// For User's Password Reset
const passwordReset = async (request, response) => {
    try {
        const { email, password } = request.body;

        const query = `SELECT * FROM psp_staff WHERE email = "${email}" LIMIT 1`;

        request.app.get('connection').query(query, function(error, data) {
            if (data === null || data.length == 0)
            {
                response.status(400).json({
                    field: "email_address",
                    message: "The email address you entered isn't connected to an account.",
                });
            } else
            {
                bcrypt.genSalt(rounds, (err, salt) => {
                    bcrypt.hash(password, salt, (err, hash) => {
                        console.log(hash);
                        // Now we can store the password hash in db.
                        const updatePassword = `UPDATE psp_staff SET password = "${hash}" WHERE email = "${email}" LIMIT 1`;
                        request.app.get('connection').query(updatePassword, function(error, data) {
                            if(data.affectedRows == 1) {
                                // Success 
                                response.status(200).json({
                                    message: "success",
                                });
                            } else {
                                response.status(400).json({
                                    message: "Error while decoding password",
                                });
                            }
                        });
                    });
                });
            }
        });
    } catch (error) {
        response.status(500).json({
            message: "An error occured",
        });
        console.log(error);
    }
}

const paginationMiddleware = (pageSize) => {
    return (req, res, next) => {
      const pageNumber = parseInt(req.query.page) || 1; // Get the current page number from the query parameters
      const startIndex = (pageNumber - 1) * pageSize;
      const endIndex = startIndex + pageSize;
  
      // Attach pagination data to the request object
      req.pagination = {
        page: pageNumber,
        limit: pageSize,
        startIndex,
        endIndex
      };
  
      next(); // Call the next middleware
    };
};

const formatDateTime = (input) => {
    return date.format((new Date(input)), 'DD.MM.YYYY HH:mm:ss');
};

const filtersCondition = (req, status_name) => {
   

    const isBack = req.session.prev_page.isBack
    const formData = isBack? req.session.prev_page.formData : req.body
   
     var page = isBack ? Number(req.session.prev_page.formData.page) : req.body.page;

     var sortBy = formData.sortBy 
    var sortField = formData.sortField 
    let filters = new Object()
    const ticket_no = formData.ticket_no 
    const subject =  formData.subject 
    const filter_date_range = formData.filter_date_range
    const filter_date = formData.filter_date 
    const assignees = formData.assignees 
    const status = formData.status 
    const priority =formData.priority 
    const application = formData.application 
    const server = formData.server 
    const subTickets = formData.subTickets 
    var to_date = ""; var from_date = '';

    if(!page) {
        page = 1;
    }

    if(!sortBy) {
        sortBy = 'DESC';
    }

    if(!sortField) {
        sortField = 'last_updated';
    }

    var page_limit = ((page * 50) - 50);

    if (filter_date != undefined)
    {
        var filter_date_split = filter_date.split(' - ')

        from_date = filter_date_split[0].split('.').reverse().join('-')
        if(filter_date_split[1]) {
            to_date = filter_date_split[1].split('.').reverse().join('-')
        }

    }

    let search_query = "test_mode = ? AND active = ?";
    let search_placeholders = [0, 1];

    if (status_name == 'mytickets') {
        search_query += " AND psp_staff_id = ?";
        search_placeholders.push(req.session.userId)
    } else if (status_name == 'iresolved') {
        search_query += " AND psp_staff_id = ?";
        search_placeholders.push(req.session.userId)

        search_query += " AND ticket_status_id = ?";
        search_placeholders.push(6)
    } else if (status_name == 'open') {
        search_query += " AND ticket_status_id = ?";
        search_placeholders.push(1) 
    } else if (status_name == 'assigned') {
        search_query += " AND ticket_status_id = ?";
        search_placeholders.push(2) 
    } else if (status_name == 'progress') {
        search_query += " AND ticket_status_id = ?";
        search_placeholders.push(3)
    } else if (status_name == 'waiting') {
        search_query += " AND ticket_status_id = ?";
        search_placeholders.push(4)
    } else if (status_name == 'hold') {
        search_query += " AND ticket_status_id = ?";
        search_placeholders.push(5)
    } else if (status_name == 'resolved') {
        search_query += " AND ticket_status_id = ?";
        search_placeholders.push(6)
    } else if (status_name == 'falsepositive') {
        search_query += " AND ticket_status_id = ?";
        search_placeholders.push(7)
    } else {
        // search_query += " AND ticket_status_id != 7";
    }
    
    if(ticket_no != undefined && ticket_no != '') {
        search_query += " AND ticket_no = ?";
        search_placeholders.push(ticket_no)
        filters.ticket_no = ticket_no
    }

    if(subject != undefined && subject != '') {
        search_query += " AND subject LIKE ? ";
        search_placeholders.push('%' + subject + '%')
        filters.subject = subject
    }

    if(status != undefined && status != 0) {
        search_query += " AND ticket_status_id = ?";
        search_placeholders.push(status)
        filters.status = status
    }

    if(priority != undefined && priority != 0)  {
        search_query += " AND ticket_priority_id = ?";
        search_placeholders.push(priority)
        filters.priority = priority
    }

    if(assignees != undefined && assignees != 0) {
        search_query += " AND psp_staff_id = ?";
        search_placeholders.push(assignees)
        filters.assignees = assignees
    }

    if(application != undefined && application != 0) {
        search_query += " AND ticket_application_id = ?";
        search_placeholders.push(application)
        filters.application = application
    }

    if(server != undefined && server != 0) {
        search_query += " AND server_id = ?";
        search_placeholders.push(server)
        filters.server = server
    }

    if(subTickets != undefined && subTickets != 0) {
        search_query += " AND sub_ticket = ?";
        search_placeholders.push(subTickets)
        filters.subTickets = subTickets
    }

    if(from_date != '' && to_date == '') {
        search_query += " AND date(creation_date) = ?";
        search_placeholders.push(from_date)
        filters.filter_date = filter_date
        filters.filter_date_range = filter_date_range
    } else if(from_date != '' && to_date != '') {
        search_query += " AND date(creation_date) >= ? AND date(creation_date) <= ?";
        search_placeholders.push(from_date)
        search_placeholders.push(to_date)
        filters.filter_date = filter_date
        filters.filter_date_range = filter_date_range
    }

    return [search_query, search_placeholders, filters, page_limit, sortBy, sortField];
};

const paginationRule = (req, result) => {
    var page = req.body.page 

    if(req.session.prev_page.isBack){
        page = Number(req.session.prev_page.formData.page)
    }
   
    var sortBy =req.body.sortBy;
    var sortField = req.body.sortField;
    var displayFilter = 'none';
    var total_count = 0;
    result[1].forEach(element => {
        total_count = element.total_count;
    });
    var no_per_page = 50
    var no_of_sub_pages = Math.ceil(parseInt(total_count)/no_per_page)
 
    if(!page) {
        page = 1;
    }

    if(!sortBy) {
        sortBy = 'DESC';
    }

    if(!sortField) {
        sortField = 'ticket_no';
    }

    if (Object.keys(result[0][1]).length > 0)
    {
        displayFilter = 'block'
    }

    var page_limit = ((page * 50) - 50);
   

    return [page, total_count, sortBy, sortField, displayFilter, page_limit, no_of_sub_pages];
};

module.exports =  {
    authenticateLogin,
    passwordReset,
    paginationMiddleware,
    formatDateTime,
    filtersCondition,
    paginationRule,
};
