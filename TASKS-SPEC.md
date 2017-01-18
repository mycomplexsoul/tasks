
    /*
Milestone 1 (POC)
    Basics (visual)
    - [x] Shows a text field to capture task
    - [x] Shows a button 'Add Task' -> saves task captured and show it on open tasks
    - [x] When saving a task, task must have: id, record inferred from capture, order to be the next available
    - [x] Displays an open tasks list (each task has a checkbox and a details button)
    - [x] In the open task list, tasks are grouped by record associated
    - [x] Displays a closed tasks list (each task has a checkbox checked and a details button)
    - [x] When click on 'details' button -> show a panel with all the task info, the panel has a 'hide' button
    - [x] When click on 'hide' button on task details -> the panel must close
    Working on tasks (Actions)
    - [x] Can edit task name, when finished editing -> changes must be persisted
    - [x] Persist tasks and retrieve from/to local storage
    - [x] Click on checkbox in an open task -> mark task as done and updates the finished date
    - [x] Click on checkbox in a closed task -> mark task as open (updates finished date)
    Organization (reorder and movements)
    - [x] Can reorder tasks with Alt + Up and Alt + Down -> changes to order must be persisted
    - [x] Can move between tasks with Up and Down -> can jump even between groups
    - [x] When user is in the input to write a new task, if press Down Arrow -> jumps to (focus) first group first task
    Time Tracking
    - [x] Can start/end a timer with F2 key (defined as running state), timer must be visible and must increment each second until stopped
    - [x] While task has a timer running, the task item must be highlighted in UI
    - [x] When timer is stopped, elapsed time is persisted (it can be multiple timer data)
    - [x] Task must display total time spent and total time tracking items in a bubble if task has them
    - [x] Time tracking history is shown in details view of task
    - [x] Time tracking items can be deleted individually (via a 'delete' button) -> remaining items must be renumbered, total time spent must be recalculated
    - [x] If the task is in running state, the related time tracking entry could not be deleted
    - [x] On page load, if a task is in running state, timer should be displayed with current elapsed time
    - [x] Time tracking items can be edited (start and end timestamps) and must be persisted and sumed up to the total time spent of the task
    - [+] Time tracking item that is currently running can be edited (start timestamp only) and the running timer must be adjusted
    - [+] Click on checkbox in a running task -> stops timer (persisting that data), mark task as done and updates the finished date
    Finished Today
    - [x] Add a 'View Finished' button, that toggles display of the 'Today' section
    - [x] Add an 'Info' section, it must contain: Total tasks done today, total time spent (even in tasks not finished yet)
    - [x] Display a list of done tasks today, each task must be striked and has a checkbox marked indicating task is done, total time spent must be shown
    - [x] When the checkbox is clicked, the task is marked as not done and moved to open tasks
    - [ ] User can edit task finished date, data is persisted automatically when a valid date is captured
    Utilitary Information
    - [x] Add an 'Information' section, it must contain: Total tasks, pending
    - [ ] If task has more than 3 days of creation, show a section at the end with the legend 'XX days old' and colored depending on days old: =0 -> green (legend changes for 'today'), <3 -> black, <5 -> brown, <10 -> red
    View All
    - [+] Add a 'View All' button, that toggles display of the 'Reports' section
    - [ ] Add a "View All" section, it should display all closed tasks and total time spent and history time tracking entries count, grouped by day in descending order (lastest first)
    Options
    - [+] Add a 'View Options' button, that toggles display of the 'Options' section
    - [+] Add an 'Options' section, it must contain a button 'delete all tasks'
    - [+] When user clicks 'delete all tasks' all tasks should be deleted and the view should be cleared
    Preventing Overload / Prioritizing
    - [x] When adding a new task, it will be in state BACKLOG
    - [x] In the buttons section will appear a button 'Show Backlog' / 'Hide Backog' which toggles the Backlog section
    - [x] A new section 'Backlog' will contain a group of tasks in BACKLOG state grouped by list
    - [x] Each task in BACKLOG state will have a button 'Move to Open', clicking this button will change state of the task to OPEN
    - [x] In the 'Info' Section will appear a backlog task counter
    Parsing Estimated Duration of Task from task text
    - [x] If task contains '%', the text between '%' and ' ' or end of text should be interpreted as the estimated duration of the task in the notation %#h##m
    - [x] The notation %#h#m could be any of the following cases: (# = any number of any digits)
        %#   | %5    -> interpreted as minutes
        %#m  | %27m  -> interpreted as minutes
        %#h  | %2h   -> interpreted as hours
        %#h# | %1h15 -> interpreted as hours (#h) and add the following as minutes (#)
        %#h#m| %2h23m-> interpreted as hours (#h) and add the following as minutes (#m)
        %#h# | %1:15 -> interpreted as hours (#:) and add the following as minutes (#)
        %#h#m| %2:23m-> interpreted as hours (#:) and add the following as minutes (#m)
    - [x] After the estimated duration has been extracted, it should be replaced in the task text as any of the following cases:
        '%#h#m ' -> ''
        ' %#h#m' -> ''
        '%#h#m'  -> ''
    - [ ] If the string '%%' is present, it should be replaced to '%' and the parsing of estimated time should not be done on that block
    - [x] When a task has estimated duration 0 it should be displayed '0m' in red
    - [ ] In running state, if the elapsed time + total time spent is greater than the estimated duration, it must show a browser notification 'Estimated time exceeded ##h##m for task: [TASK]'
    - [x] Total time estimated should be displayed in 'Info' section, it will show two values: total ETA remaining (for OPEN tasks), total ETA today (for OPEN and CLOSED today tasks)
    - [x] Estimated duration can be edited after task is added, it is not saved unless it has a valid value in same format as when task creation, otherwise zero is set
    - [x] Having total ETA for open tasks (sumETA) and total time spent on tasks today (sumSpent), show a ratio of the two (sumETA/sumSpent) with label "Productivity Ratio", where value < 1 is bad, > 1 is good, show colors
    Backup & Import
    - [x] In the 'Options' section, a button 'Backup' and a button 'Import' are shown, also there must exist a message area to notify action results, shows also a textbox for interaction with data
    - [x] If user clicks 'Backup' the complete JSON of tasks should be displayed in a textbox in stringified format, a message is shown in the messages area 'Backup copied to clipboard'
    - [x] If user clicks 'Import' it will try to get the textbox data, parse it as JSON, get tasks and add them to existent ones, and save to storage, a message is shown in the messages area 'Added tasks from import process successfully'
    Parse special tokens
    - [x] If task has token '[DATE]' when adding, it should be replaced with today's date in format 'yyyy-MM-dd'
    - [x] If task has token '[DATETIME]' when adding, it should be replaced with today's date in format 'yyyy-MM-dd HH:mm:ss'
    Batch Add tasks
    - [x] If user press F2 when focused on task text input, it should toggle into a textarea, where the user could add multiple tasks, one per row, when added it should be trated each the same as individual input
    - [x] After adding batch tasks, textarea should hide and text input should be visible again
    Parse Start Date and End Date
    - [x] Start date should be parsed with this format: '[yyyy-MM-dd HH:mm]' if it lacks time data it should not be parsed
    - [x] Start date and End date should be parsed with this format: '[yyyy-MM-dd HH:mm - HH:mm]' if it lacks time data it should not be parsed
    - [x] Parsed dates must be persisted
            Examples
            datetime duration %[2016-12-18 18:29 + 2h30m]
            time duration %[18:30 + 1h15m]
            datetime end %[2016-12-18 18:29 - 19:12]
            time end %[18:31 - 19:12]
            datetime %[2016-12-18 18:29]
            time %[11:21]
    Postpone Task Until certain date
    - [x] When user edits task text and adds this text ' --pos X', on blur event this syntax is interpreted and must validate '--pos' part as a date until the task must be kept unseen from user
    - [x] When interpreted, it should be removed from original text of the task
    - [x] When the user postpones a task, it is not seen until the date X has passed
        Examples
        // --pos 17:30
        // --pos now +2h30m
        // --pos tomorrow 09:00
        // --pos 2016-12-31 23:59
    Cancel tasks
    - [x] User can cancel the task via a hotkey in edit mode via Ctrl + Supr
    - [x] Upon cancellation, the task changes its status to CANCELLED and is removed from view
    Qualifiers
    - [x] Qualifiers should be parsed from task text with syntax "$[starred,important,urgent]"
    - [x] Parsing is optional and if present it should be trimmed from task text
    - [x] Qualifiers must be persisted along the task
    - [x] Qualifiers can be edited in the task details' view
        
Milestone 2 (MVP)
    Working on tasks
    - [ ] Task UI capture should parse these schemes on capture (and must persist values):
        {[Record] Name %[Estimated] #Tags $Qualifiers +Notes}
        {[Record] Name %[ScheduleStart+Estimated] #Tags $Qualifiers +Notes}
        {[Record] Name %[ScheduleStart-ScheduleEnd] #Tags $Qualifiers +Notes}
    Visual
    - [ ] Task UI display on row:
        {[x] [##:##] Name %Estimated #Tags }
        {[x] [2/TT:TT + ##:##] Name @Estimated #Tags }
            {[details][start/stop][up][down][cancel]}{Notes}
    Fields for scheduling repetitions
    - On Schedule/On Completion
      Daily/Weekly
      Some Days of the Week [DLMXJVS], On Every Given Period [Number + [days,weeks,months,years]], On A Day of Each Month [1st, 2nd, ..., 5th, Last + [DLMXJVS]]
      End Repeat [never, on date, after # repetitions]
    Fields for alarms array
    - Relative alarm: days, before/after, hours, minutes
    - On Date: datetime
    tsk_ctg_repeat (true/false)
    tsk_ctg_repeat_type (on schedule/on completion)
    tsk_ctg_repeat_code (daily/weekly/some-days/period)
    tsk_repeat_value (number | some-days: [DLMXJVS]/period: num/each-month: num)
    tsk_repeat_unit (period: [days,weeks,...]/each-month: [DLMXJVS])
    tsk_ctg_repeat_end_code (never/on-date/num-repetitions)
    tsk_repeat_end_value (on-date: date/num-repetitions: number)
    tsk_repeat_template (replaceable-tokens: [NEXT#]/[NEXTDAY]/[NEXTWEEK])
    tsk_repeat_template_data ({"code": "[NEXT#]", value: "20"})
    tsk_repeat_num_repetition (number)
     */

    //     "actividad":[
//         {
//             "act_num_actividad": 1
//             , "act_id_contenedor": "actividad"
//             , "act_id_registro": "0"
//             , "act_nombre": "Generate json struct"
//             , "act_notas": "struct init {}"
//             , "act_padre": 0
//             , "act_orden": 0
//             , "act_cve_tarea": 2
//             , "act_fecha_finalizado": new Date(2015,8,12,12,25,0)
//             , "act_tiempo_total_dedicado": 0
//             , "act_tiempo_historial": [
//                 {
//                     "ach_num_actividad": 1
//                     , "ach_num_secuencial": 1
//                     , "ach_fecha_inicio": null
//                     , "ach_fecha_fin": null
//                     , "ach_tiempo_dedicado": 0
//                     , "ach_num_usuario": 2
//                     , "ach_fecha_alta": new Date(2015,8,12,12,25,0)
//                     , "ach_fecha_ult_mod": new Date(2015,8,12,12,25,0)
//                 }
//             ]
//             , "act_cve_en_proceso": 1
//             , "act_calificadores": "star,gray"
//             , "act_etiquetas": "#ActividadApp,#json"
//             , "act_fecha_prog_inicio": new Date(2015,9,12,11,20,0)
//             , "act_fecha_prog_fin": new Date(2015,9,12,12,20,0)
//             , "act_prog_duracion": (1 * 60 * 60)
//             , "act_prog_historial": [
//                 {
//                     "aph_num_actividad": 1
//                     , "aph_num_secuencial": 1
//                     , "aph_fecha_prog_inicio": null
//                     , "aph_fecha_prog_fin": null
//                     , "aph_prog_duracion": 0
//                     , "aph_fecha_cambio": null
//                     , "aph_num_usuario": 1
//                     , "aph_fecha_alta": new Date(2015,8,12,12,25,0)
//                     , "aph_fecha_ult_mod": new Date(2015,8,12,12,25,0)
//                 }
//             ]
//             , "act_num_usuario_alta": 2
//             , "act_num_usuario_asignado": 2
//             , "act_fecha_alta": new Date(2015,8,12,12,25,0)
//             , "act_fecha_ult_mod": new Date(2015,8,12,12,25,0)
//             , "act_cve_estatus": 1
//         }