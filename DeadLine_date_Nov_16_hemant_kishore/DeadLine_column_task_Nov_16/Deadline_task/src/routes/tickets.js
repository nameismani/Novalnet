const express = require('express');
const router = express.Router();
const util = require('../middleware/utils');
const tickets_model = require('../models/tickets.models');
const { check, validationResult } = require('express-validator');  
const fs = require('fs')


router.all('/', async (req, res, next) => {
    res.locals.user = req.session;
    res.locals.active_tab = 'tickets';
    res.locals.active_menu = '';

     console.log("Initial sess=>",req.session);
   
    try {
 
        if(req.session.prev_page.isBack == false && req.session.checkUserActivity.lockPage == 0){
            req.session.checkUserActivity.lockPage = 1
            console.log("filtering or pagination when you hit home page its will give home")
        }

        if(req.body.back != "back" && req.session.checkUserActivity.lockPage == 1 ){
            req.session.prev_page ={
                isBack : false,
                status_name : null,
                formData:null,
            }
           console.log("Initial Run")
        }

        if(req.body.back != "back" && req.session.checkUserActivity.lockPage == 0){

            
            req.session.checkUserActivity.lockPage = 1
            req.session.prev_page.isBack = true
            
            if(req.session.prev_page.status_url != null){
                req.session.prev_page.isBack = false
            }
            console.log("user stays on select page")

        }
        if(req.body.back=="back" && req.session.checkUserActivity.lockPage == 0){
            // req.session.prev_page.isBack = true
            req.session.prev_page.isBack = true
            req.session.checkUserActivity.lockPage = 1
            console.log("when you click back on tickets_detail page")
            // console.log("back data",req.session.prev_page);
        }
        if(req.body && req.body.page || req.body.filter == 1){
    
                req.session.prev_page.isBack = true
                req.session.prev_page.formData = req.body
                req.session.save()
            }
            console.log("end sess",req.session);
           
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
            let[page, total_count, sortBy, sortField, displayFilter, page_limit, no_of_sub_pages] = util.paginationRule(req, response);
                   
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
                
            });

        });
   
    } catch (error) {
        // Handle your error here
        console.log(error);
        res.end();
    }


})


router.all('/:status_name', check('status_name').trim().matches(/^[a-zA-Z]+$/), async (req, res, next) => {
    const status_name = req.params.status_name;

    const errors = validationResult(req);
	if (!errors.isEmpty()) {
	   res.redirect('/tickets');
	}
    res.locals.user = req.session;
    res.locals.active_tab = 'tickets';
    res.locals.active_menu = status_name;
    
    console.log("initial", req.session)
    
    try {
        if(req.body.back != "back" && req.session.checkUserActivity.lockPage == 1 ){
            req.session.prev_page ={
                isBack : false,
                formData: null,
                status_name : null,
            }
           console.log("Initial Run")
        }
        if(req.body.back != "back" && req.session.checkUserActivity.lockPage == 0){
           
            req.session.checkUserActivity.lockPage = 1
            req.session.prev_page.isBack = true
            console.log("user stays on select page")
        }
        if(req.body.back=="back" && req.session.checkUserActivity.lockPage == 0){

            req.session.prev_page.isBack = true
            req.session.checkUserActivity.lockPage = 1
            console.log("when you click back on tickets_detail page")

            if(status_name != req.session.prev_page.status_name){

                req.session.prev_page ={
                    isBack : false,
                    formData: null,
                    status_name : null,
                }
                req.session.checkUserActivity.lockPage = 1
            }
            
        }

         if(req.body && req.body.page || req.body.filter == 1 ){
                req.session.prev_page.isBack = true
                req.session.prev_page.formData =  req.body
                req.session.save()
            }


        req.session.prev_page.status_name = status_name

        console.log("end",req.session)
        // console.log(req.body)

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
            let[page, total_count, sortBy, sortField, displayFilter, page_limit, no_of_sub_pages] = util.paginationRule(req, response);

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
    // console.log("detail=> ",req.body);
    const ticketId = req.params.ticketId.replace(/[^0-9 ]/g, '');
    const note = res.locals.user.first_name + ' ' + res.locals.user.last_name + ' open and view the task';
    res.locals.user = req.session;
    res.locals.active_tab = 'tickets';
    tickets_model.addActivityEntry(req, ticketId, note);
    const previous_url = req.headers.referer
  
    const url = previous_url.includes(req.session.prev_page.status_name) ? previous_url : null

    if(url!=null){
        req.session.prev_page.status_url = url
        req.session.save()
    }
     
    let date_dead;
    const jsonData = fs.readFileSync("media/data.json","utf8")
    const deadLine_Data = await JSON.parse(jsonData)
    const existingItem = await deadLine_Data.find((item) => item.ticketId == ticketId) 
    if( existingItem != undefined){
        date_dead = {
            startDate: await existingItem.deadLine.startDate,
            endDate: await existingItem.deadLine.endDate
        }
    }else{
        date_dead = {
            startDate: null,
            endDate: null
        }
    }

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
        ]).then(async(response) => {
            
            var activityPage = req.body.activityPage;
            var commentPage = req.body.commentPage;
            var total_count = response[11][0].total_count
            var total_comment_count = response[12][0].total_count
            var no_per_page = 10
            var no_of_activity_pages = Math.ceil(parseInt(total_count)/no_per_page)
            var no_of_comments_pages = Math.ceil(parseInt(total_comment_count)/no_per_page)

            if(!activityPage) {
                activityPage = 1;
            }

            if(!commentPage) {
                commentPage = 1;
            }
          
            var page_limit = ((activityPage * 10) - 10);
            console.log(response[0][0].creation_date);

            res.render('tickets_detail', {
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
                previous_url:req.session.prev_page.status_url,
                deadLine_startDate : date_dead.startDate,
                deadLine_endDate :  date_dead.endDate
            });
        });
} catch (error) {
        // Handle your error here
        console.log(error);
        res.end();
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
    const deadLine = req.body.deadLine
    
    const ticketDetails = await tickets_model.getTicketDetailsById(req, ticketId)
   
    res.locals.user = req.session;

    if(assignees != undefined && assignees != 0) {
        const assigneeDetails = await tickets_model.getUserById(req, assignees)
        note = res.locals.user.first_name + ' ' + res.locals.user.last_name + ' assigned the task to ' + assigneeDetails[0].first_name + ' ' + assigneeDetails[0].last_name
    } else if(status != undefined && status != '') {
        const currentStatus = await tickets_model.getStatusById(req, status);
        note = res.locals.user.first_name + ' ' + res.locals.user.last_name + ' changed the task status from ' + ticketDetails[0].name + ' to ' + currentStatus[0].name
    } else if(priority != undefined && priority != '') {
        const currentPriority = await tickets_model.getPriorityById(req, priority);
        note = res.locals.user.first_name + ' ' + res.locals.user.last_name + ' changed the task priority from ' + ticketDetails[0].level +' to ' + currentPriority[0].level
    }else if(deadLine != undefined && deadLine != '') {
            
        let jsonFile = await JSON.parse(fs.readFileSync('media/data.json','utf-8'))
        const existingData = await jsonFile.findIndex((data)=> data.ticketId === req.body.ticketId)
       
        if(existingData !== -1 ){
            if(req.body.deadLine.startDate != undefined && req.body.deadLine.startDate != null){
                note = res.locals.user.first_name + ' ' + res.locals.user.last_name  +' changed the deadline start date from ' + jsonFile[existingData].deadLine.startDate +' to ' + req.body.deadLine.startDate
                jsonFile[existingData].deadLine.startDate = req.body.deadLine.startDate
            }else{
                note = res.locals.user.first_name + ' ' + res.locals.user.last_name  +' changed the deadline end date from ' + jsonFile[existingData].deadLine.endDate + " to "  + req.body.deadLine.endDate 
                jsonFile[existingData].deadLine.endDate = req.body.deadLine.endDate
            }
        }else{
            jsonFile.push(req.body)
            if(req.body.deadLine.startDate != undefined && req.body.deadLine.startDate != null){
               
                note = res.locals.user.first_name + ' ' + res.locals.user.last_name  +' set the deadline start date to ' + req.body.deadLine.startDate +'.'
            }else{
              
                note = res.locals.user.first_name + ' ' + res.locals.user.last_name  +' set the deadline end date to ' + req.body.deadLine.endDate +"."
            }
          
        }

        const updateJsonFile = JSON.stringify(jsonFile,null,2)

        fs.writeFileSync('media/data.json', updateJsonFile)
            console.log("Deadline is updated on "+ ticketId + " tickets") 

            res.status(200).json({
               message:"success"
            })

     }

    tickets_model.addActivityEntry(req, ticketId, note);

     try {
       if(deadLine == undefined){
           Promise.all([
               tickets_model.updateTicketById(req, ticketId)
           ]).then((response) => {
               res.end();
           });
       }
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

    console.log("comment ticket",req.session)
    var ticketId = req.params.ticketId.replace(/[^0-9 ]/g, '')
    var fetchCommentsById = await tickets_model.fetchCommentsById(req, ticketId , 1);
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