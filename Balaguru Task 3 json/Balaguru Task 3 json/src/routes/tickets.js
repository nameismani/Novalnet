const express = require('express');
const router = express.Router();
const util = require('../middleware/utils');
const tickets_model = require('../models/tickets.models');
const { check, validationResult } = require('express-validator');
const fs = require("fs")

router.all('/', async (req, res, next) => {
    res.locals.user = req.session;
    res.locals.active_tab = 'tickets';
    res.locals.active_menu = '';

    try {
        Promise.all([
            tickets_model.fetchTickets(req),
            tickets_model.fetchTickets(req, 1),
            tickets_model.fetchAllTicketCounts(req),
            tickets_model.fetchStatus(req),
            tickets_model.fetchPriority(req),
            tickets_model.fetchUsers(req),
            tickets_model.fetchApplication(req),
            tickets_model.fetchServer(req),
        ]).then((response) => {
            let [page, total_count, sortBy, sortField, displayFilter, page_limit, no_of_sub_pages] = util.paginationRule(req, response);

            let matched_user = JSON.parse(fs.readFileSync("./media/mailalert.json", 'utf8')).find(user => user.email === req.session.email && user.mailLoginALert === 1);

            res.render('tickets', {
                active_menu: '',
                tickets: response[0][0],
                filters: response[0][1],
                status: response[3],
                priority: response[4],
                users: response[5],
                application: response[6],
                server: response[7],
                total_count: total_count,
                current: page,
                sortBy: sortBy,
                sortField: sortField,
                displayFilter: displayFilter,
                util: util,
                page_limit: page_limit,
                no_of_sub_pages: no_of_sub_pages,
                total_tickets: total_count,
                tickets_counts: response[2],
                matched_user_checked: matched_user
            });
        });
    } catch (error) {
        // Handle your error here
        console.log(error);
        res.end();
    }
})

router.all('/:status_name', check('status_name').trim().matches("^(mytickets||iresolved||open||assigned||progress||waiting||hold||resolved||falsepositive)$"), async (req, res, next) => {
    const status_name = req.params.status_name;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.redirect('/tickets');
    }


    res.locals.user = req.session;
    res.locals.active_tab = 'tickets';
    res.locals.active_menu = status_name;

    try {
        Promise.all([
            tickets_model.fetchTickets(req, 0, status_name),
            tickets_model.fetchTickets(req, 1, status_name),
            tickets_model.fetchAllTicketCounts(req),
            tickets_model.fetchStatus(req),
            tickets_model.fetchPriority(req),
            tickets_model.fetchUsers(req),
            tickets_model.fetchApplication(req),
            tickets_model.fetchServer(req),
        ]).then((response) => {
            let [page, total_count, sortBy, sortField, displayFilter, page_limit, no_of_sub_pages] = util.paginationRule(req, response);
            let matched_user = JSON.parse(fs.readFileSync("./media/mailalert.json", 'utf8')).find(user => user.email === req.session.email && user.mailLoginALert === 1);


            res.render('tickets', {
                tickets: response[0][0],
                filters: response[0][1],
                status: response[3],
                priority: response[4],
                users: response[5],
                application: response[6],
                server: response[7],
                total_count: total_count,
                current: page,
                sortBy: sortBy,
                sortField: sortField,
                displayFilter: displayFilter,
                util: util,
                page_limit: page_limit,
                no_of_sub_pages: no_of_sub_pages,
                total_tickets: total_count,
                tickets_counts: response[2],
                matched_user_checked: matched_user

            });
        });
    } catch (error) {
        // Handle your error here
        console.log(error);
        res.end();
    }
})


router.all('/detail/:ticketId', check('ticketId').trim().matches(/^[0-9]+$/), async (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.redirect('/tickets');
    }


    const result = await req.app.get('db').query("SELECT id FROM ticket WHERE id = ?", [req.params.ticketId]);
    const note = res.locals.user.first_name + ' ' + res.locals.user.last_name + ' open and view the task';

    const ticketId = req.params.ticketId.replace(/[^0-9 ]/g, '');
    if (result.length > 0) {
        tickets_model.addActivityEntry(req, ticketId, note)
    }
    res.locals.user = req.session;
    res.locals.active_tab = 'tickets';


    try {
        Promise.all([
            tickets_model.fetchTicketById(req, ticketId),
            tickets_model.fetchTicketDetailById(req, ticketId),
            tickets_model.fetchSubTickets(req, ticketId),
            tickets_model.fetchActivityById(req, ticketId),
            tickets_model.fetchCommentsById(req, ticketId),
            tickets_model.fetchStatus(req),
            tickets_model.fetchPriority(req),
            tickets_model.fetchUsers(req),
            tickets_model.fetchApplication(req),
            tickets_model.fetchServer(req),
            tickets_model.fetchTicketGroups(req),
            tickets_model.fetchActivityById(req, ticketId, 1),
            tickets_model.fetchCommentsById(req, ticketId, 1),
        ]).then((response) => {

            let matched_user = JSON.parse(fs.readFileSync("./media/mailalert.json", 'utf8')).find(user => user.email === req.session.email && user.mailLoginALert === 1);

            var activityPage = req.body.activityPage;
            var commentPage = req.body.commentPage;
            var total_count = response[11][0].total_count
            var total_comment_count = response[12][0].total_count
            var no_per_page = 10
            var no_of_activity_pages = Math.ceil(parseInt(total_count) / no_per_page)
            var no_of_comments_pages = Math.ceil(parseInt(total_comment_count) / no_per_page)
            if (!activityPage) {
                activityPage = 1;
            }

            if (!commentPage) {
                commentPage = 1;
            }

            var page_limit = ((activityPage * 10) - 10);
            res.render('tickets_detail',
                {

                    result: result,
                    ticket: response[0][0],

                    ticket_detail: response[1],
                    sub_tickets: response[2],
                    activities: response[3],
                    comments: response[4],
                    status: response[5],
                    priority: response[6],
                    users: response[7],
                    util: util,
                    application: response[8],
                    server: response[9],
                    group: response[10],
                    total_count: total_count,
                    total_comment_count: total_comment_count,
                    currentActivityPage: activityPage,
                    currentCommentPage: commentPage,
                    page_limit: page_limit,
                    no_of_activity_pages: no_of_activity_pages,
                    no_of_comments_pages: no_of_comments_pages,
                matched_user_checked: matched_user

                });
        });
    } catch (error) {
        // Handle your error here
        res.end
    }


})

router.post('/update/:ticketId', check('ticketId').trim().matches(/^[0-9]+$/), async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.redirect('/tickets');
    }

    const ticketId = req.params.ticketId.replace(/[^0-9 ]/g, '')
    const assignees = req.body.assignees
    const status = req.body.status
    const priority = req.body.priority
    const ticketDetails = await tickets_model.getTicketDetailsById(req, ticketId)
    res.locals.user = req.session;

    if (assignees != undefined && assignees != 0) {
        const assigneeDetails = await tickets_model.getUserById(req, assignees)
        note = res.locals.user.first_name + ' ' + res.locals.user.last_name + ' assigned the task to ' + assigneeDetails[0].first_name + ' ' + assigneeDetails[0].last_name
    } else if (status != undefined && status != '') {
        const currentStatus = await tickets_model.getStatusById(req, status);
        note = res.locals.user.first_name + ' ' + res.locals.user.last_name + ' changed the task status from ' + ticketDetails[0].name + ' to ' + currentStatus[0].name
    } else {
        const currentPriority = await tickets_model.getPriorityById(req, priority);
        note = res.locals.user.first_name + ' ' + res.locals.user.last_name + ' changed the task priority from ' + ticketDetails[0].level + ' to ' + currentPriority[0].level
    }

    tickets_model.addActivityEntry(req, ticketId, note);

    try {
        Promise.all([
            tickets_model.updateTicketById(req, ticketId)
        ]).then((response) => {
            res.end();
        });
    } catch (error) {
        // Handle your error here
        console.log(error);
        res.end();
    }

})

router.post('/addComments/:ticketId', check('ticketId').trim().matches(/^[0-9]+$/), async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.redirect('/tickets');
    }
    var ticketId = req.params.ticketId.replace(/[^0-9 ]/g, '')
    var fetchCommentsById = await tickets_model.fetchCommentsById(req, ticketId, 1);
    fetchCommentsById = Number(fetchCommentsById[0].total_count) + 1;
    res.locals.user = req.session;

    const activityNote = res.locals.user.first_name + ' ' + res.locals.user.last_name + ' added comments to the task - Refer #' + fetchCommentsById

    tickets_model.addActivityEntry(req, ticketId, activityNote);

    try {
        Promise.all([
            tickets_model.addComments(req, ticketId)
        ]).then((response) => {
            res.end();
        });
    } catch (error) {
        // Handle your error here
        console.log(error);
        res.end();
    }

})



module.exports = router;