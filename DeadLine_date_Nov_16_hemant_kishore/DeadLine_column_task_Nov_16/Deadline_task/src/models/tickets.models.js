const util = require('../middleware/utils');
const date = require('date-and-time')


exports.fetchTickets = async (req, count, status_name) => {
    
    let[search_query, search_placeholders, filters, page_limit, sortBy, sortField] = util.filtersCondition(req, status_name);

    let search_query_statement = "SELECT id, creation_date, ticket_no, psp_staff_id, sub_ticket, ticket_status_id, ticket_priority_id, ticket_group_id, ticket_application_id, server_id, subject, last_updated FROM ticket WHERE " + search_query + " ORDER BY " + sortField + ' ' + sortBy + " LIMIT " + page_limit + ", 50"
    let count_search_query_statement = "SELECT count(id) as total_count FROM ticket WHERE " + search_query

    if (!count)
    {
        const result = await req.app.get('db').query(search_query_statement, search_placeholders);
        return [result, filters];
    } else {
        const count_rows = await req.app.get('db').query(count_search_query_statement, search_placeholders);
        return count_rows;
    }
}

exports.fetchStatus = async (req) => {
    const result = await req.app.get('db').query("SELECT id, name, hex_code FROM ticket_status");
    if(result.length) {
       
        return result;
    }
    return [];
}

exports.fetchServer = async (req) => {
    const result = await req.app.get('db').query("SELECT id, name, public_ip, is_live FROM server");
    if(result.length) {
        return result;
    }
    return [];
}

exports.fetchApplication = async (req) => {
    const result = await req.app.get('db').query("SELECT id, name, server_id, monitor_email FROM ticket_application");
    if(result.length) {
        return result;
    }
    return [];
}

exports.fetchPriority = async (req) => {
    const result = await req.app.get('db').query("SELECT id, level, reminder_days FROM ticket_priority");
    if(result.length) {
        return result;
    }
    return [];
}

exports.fetchUsers = async (req) => {
    const result = await req.app.get('db').query("SELECT id, first_name, last_name, email, abbreviation FROM psp_staff");
    if(result.length) {
        return result;
    }
    return [];
}

exports.fetchTicketGroups = async (req) => {
    const result = await req.app.get('db').query("SELECT id, name, unique_ref, monitor_email FROM ticket_group");
    if(result.length) {
        return result;
    }
    return [];
}

exports.fetchTicketById = async (req, ticketId) => {
    if(!ticketId) {
        ticketId = req.params.ticketId;
    }
    // const result = await req.app.get('db').query("SELECT id, deadline_startDate, deadline_endDate, source, creation_date, ticket_no, psp_staff_id, ticket_status_id, ticket_priority_id, ticket_group_id, ticket_application_id, server_id, subject, test_mode, active, last_updated FROM ticket WHERE id = ?", [ticketId]);

    const result = await req.app.get('db').query("SELECT id, source, creation_date, ticket_no, psp_staff_id, ticket_status_id, ticket_priority_id, ticket_group_id, ticket_application_id, server_id, subject, test_mode, active, last_updated FROM ticket WHERE id = ?", [ticketId]);
    console.log(result);
    if(result.length) {
        return result;
    }
    return [];
}

exports.fetchTicketDetailById = async (req, ticketId) => {
    if(!ticketId) {
        ticketId = req.params.ticketId;
    }

    const result = await req.app.get('db').query("select id, description, group_concat(ticket_sub_link_id) as ticket_sub_link_ids, creation_date from ticket_detail where ticket_id = ? group by checksum order by id asc", [ticketId]);
    if(result.length) {
        // console.log(result);
        return result;
    }
    return [];
}

exports.fetchActivityById = async (req, ticketId, count) => {
    var activityPage = req.body.activityPage;

    if(!ticketId) {
        ticketId = req.params.ticketId;
    }

    if(!activityPage) {
        activityPage = 1;
    }

    var page_limit = ((activityPage * 10) - 10);

    if (!count)
    {
        const result = await req.app.get('db').query("SELECT id, psp_staff_id, note, creation_date FROM ticket_activity WHERE ticket_id = ? ORDER BY creation_date DESC LIMIT " + page_limit + ", 10",  [ticketId]);

        if(result.length) {
            return result;
        }
    } else {
        const result = await req.app.get('db').query("SELECT count(id) as total_count FROM ticket_activity WHERE ticket_id = ?",  [ticketId]); 
        return result;
    }
    return [];
}

exports.fetchCommentsById = async (req, ticketId, count) => {
    if(!ticketId) {
        ticketId = req.params.ticketId;
    }

    if (!count)
    {
        result = await req.app.get('db').query("SELECT id, psp_staff_id, comment_note, creation_date FROM ticket_comments WHERE ticket_id = ? ORDER BY creation_date DESC", [ticketId]);

        if(result.length) {
            return result;
        }

    } else {
        const result = await req.app.get('db').query("SELECT count(id) as total_count FROM ticket_comments WHERE ticket_id = ?",  [ticketId]); 
        return result;
    }
    return [];
}

exports.getUserById = async (req, userId) => {
    if(!userId)
    {
        userId = req.session.userId
    }

    const result = await req.app.get('db').query("SELECT first_name, last_name, email, is_admin, creation_date, active, abbreviation FROM psp_staff WHERE id = ? ORDER BY ID DESC LIMIT 1",  [userId]); 
    return result;

}

exports.getStatusById = async (req, statusId) => {
    const result = await req.app.get('db').query("SELECT name FROM ticket_status WHERE id = ? LIMIT 1",  [statusId]); 
    return result;
}

exports.getPriorityById = async (req, priorityId) => {
    const result = await req.app.get('db').query("SELECT level FROM ticket_priority WHERE id = ? LIMIT 1",  [priorityId]); 
    return result;
}

exports.getTicketDetailsById = async (req, ticketId) => {
    const result = await req.app.get('db').query("SELECT ts.name as name, tp.level as level FROM ticket tk, ticket_status ts, ticket_priority tp  where tk.id = ? and tk.ticket_status_id = ts.id and tk.ticket_priority_id = tp.id LIMIT 1",  [ticketId]); 
    return result;

}

exports.fetchSubTickets = async (req, ticketId) => {
    if(!ticketId) {
        ticketId = req.params.ticketId;
    }

    result = await req.app.get('db').query("SELECT id, creation_date FROM ticket_sub_link WHERE ticket_id = ?", [ticketId]);
    if(result.length) {
        return result;
    }
    return [];
}

exports.updateTicketById = async (req, ticketId) => {
    if(!ticketId) {
        ticketId = req.params.ticketId;
    }

    const assignees = req.body.assignees
    const status = req.body.status
    const priority = req.body.priority
    // const startDate = req.body.deadLine.startDate
    // const endDate = req.body.deadLine.endDate

    let update_query = "";let note = "";
    let update_placeholders = [];
    
    if(assignees != undefined && assignees != 0) {
        update_query += "psp_staff_id = ?";
        update_placeholders.push(assignees)
    }

    if(status != undefined && status != '') {
        update_query += "ticket_status_id = ?";
        update_placeholders.push(status)
    }

    if(priority != undefined && priority != 0) {
        update_query += "ticket_priority_id = ?";
        update_placeholders.push(priority)
    }

    // if(startDate != undefined && startDate != null){
    //     update_query += 'deadline_startDate ='
    //     update_placeholders.push(startDate)
    // }

    // if(endDate != undefined && endDate != null){
    //     update_query += 'deadline_endDate ='
    //     update_placeholders.push(endDate)
    // }

    update_placeholders.push(ticketId)

    result = await req.app.get('db').query("UPDATE ticket SET " + update_query +" WHERE id = ?", update_placeholders);
    if(result.length) {
        return result;
    }
    return [];
}

exports.addComments = async (req, ticketId) => {
    if(!ticketId) {
        ticketId = req.params.ticketId;
    }

    const note = req.body.note

    await req.app.get('db').query("UPDATE ticket SET last_updated = ? WHERE id = ?", [date.format((new Date()), 'YYYY-MM-DD HH:mm:ss'), ticketId]);

    const query = 'INSERT INTO ticket_comments (`ticket_id`, `psp_staff_id`, `comment_note`) VALUES (?, ?, ?)';

    result = await req.app.get('db').query(query, [ticketId, req.session.userId, note]);
    return result;

}

exports.addActivityEntry = async (req, ticketId, note) => {
    if(!ticketId) {
        ticketId = req.params.ticketId;
    }

    const query = 'INSERT INTO ticket_activity (`ticket_id`, `psp_staff_id`, `note`) VALUES (?, ?, ?)';

    result = await req.app.get('db').query(query, [ticketId, req.session.userId, note]);
    return result;

}

exports.fetchAllTicketCounts = async (req) => {
    const total_tickets = await req.app.get('db').query("SELECT count(id) as total_tickets FROM ticket where test_mode = ? and active = ?", [0, 1]);
    const user_tickets = await req.app.get('db').query("SELECT count(id) as user_tickets FROM ticket where test_mode = ? and active = ? and psp_staff_id = ?", [0, 1, req.session.userId]);
    const user_resolved_tickets = await req.app.get('db').query("SELECT count(id) as user_resolved_tickets FROM ticket where test_mode = ? and active = ? and psp_staff_id = ? and ticket_status_id = 6", [0, 1, req.session.userId]);
    const all_open_tickets = await req.app.get('db').query("SELECT count(id) as all_open_tickets FROM ticket where test_mode = ? and active = ? and ticket_status_id = 1", [0, 1]);
    const all_assigned_tickets = await req.app.get('db').query("SELECT count(id) as all_assigned_tickets FROM ticket where test_mode = ? and active = ? and ticket_status_id = 2", [0, 1]);
    const all_progress_tickets = await req.app.get('db').query("SELECT count(id) as all_progress_tickets FROM ticket where test_mode = ? and active = ? and ticket_status_id = 3", [0, 1]);
    const all_hold_tickets = await req.app.get('db').query("SELECT count(id) as all_hold_tickets FROM ticket where test_mode = ? and active = ? and ticket_status_id = 5", [0, 1]);
    const all_resolved_tickets = await req.app.get('db').query("SELECT count(id) as all_resolved_tickets FROM ticket where test_mode = ? and active = ? and ticket_status_id = 6", [0, 1]);
    const all_waiting_tickets = await req.app.get('db').query("SELECT count(id) as all_waiting_tickets FROM ticket where test_mode = ? and active = ? and ticket_status_id = 4", [0, 1]);
    const all_false_tickets = await req.app.get('db').query("SELECT count(id) as all_false_tickets FROM ticket where test_mode = ? and active = ? and ticket_status_id = 7", [0, 1]);
    /* const recent_updated_tickets = await req.app.get('db').query("SELECT count(id) as recent_updated_tickets FROM ticket where test_mode = ? and active = ? and date(last_updated) BETWEEN CURDATE() - INTERVAL 1 DAY AND CURDATE()", [0, 1]); */
    return [total_tickets, user_tickets, user_resolved_tickets, all_open_tickets, all_assigned_tickets, all_progress_tickets, all_hold_tickets, all_resolved_tickets, all_waiting_tickets, all_false_tickets]
}