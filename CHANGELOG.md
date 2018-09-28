# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Notes / To Do / Roadmap]
* [AppCommon] Test runner for node.
* [AppCommon] Display version in main page footer.
* [AppCommon] Login UI.

## [Unreleased / Work In Progress]
* [AppCommon] Node build into `/dist` folder.
* [AppCommon] Angular build into `/dist` folder.
* [AppCommon] Deploy BE + FE in `/dist` folder.

* Money
    * Import
        * Remove automatically-asigned budget from movement import
        * Tag properly from movement import
    * Reports
        * Send an email with node
        * Movement report with shared movements
            * 1809 shared-50  | movement shared 50/50
            * 1809 shared-100 | movement payed 100% by mate (Lau)
            * 1809 shared-me  | movement payed 100% by me and to be discounted from final amount
    * Balance
        * Balance new fields: comment, date_last_valid, swap charges-withdrawals legends
        * Display Average Balance on Balance page (using account daycheck information)
    * Movement features
        * Scheduled movements
        * Movement form validation server side.
        * Movement form validation client side.
        * Combo-item value validation against a provided list.
* Tasks
    * [AppTasks] Use tasks from server.
    * Indicator for last finished task timestamp
    * Keyboard shortcuts for navigating from record list to next/previous record list and focus into first task in the list
    * Once focused on estimated time, pressing arrow up/down should navigate to previous/next task in the list, focusing on the task description
    * Option to show/hide Indicators
    * Clean up Indicators legacy section
    * Unset schedule, unset link
* Common
    * Refactor database view generation for using joins on catalog instead of subqueries.
    * Unit test runner for server.
    * Unit test runner for client.
    * Refactor accounts with balance endpoint to have an endpoint that uses a sql query as param.
* Multimedia
    * Entity Definition
* Last Time
    * Entity Definition new fields
        _validity Days to consider this as valid
        _tags For grouping and filtering
    * Routing and Basic capture
    * Last Time listing
* Login
    * Login basic CSS.
    * Login server routing and user validation.
    * Login logged user identity.

<hr/>

## v1.4.34 (2018-09-11)

### Added
* [AppCommon] `ApiModule.listWithSQL()` method to create endpoints with just a sql query.

## v1.4.33 (2018-09-10)

### Added
* [AppCommon] Support for `<` and `>=` operators in filter object parser for sql.

## v1.4.32 (2018-09-07)

### Added
* [AppTasks] Create REST API list endpoint for tasks at `/api/tasks`.

## v1.4.31 (2018-09-06)

### Modified
* [AppMoney][Balance] Filter Non-Zero Balance now filters out based on all columns being zero, not just final balance.

## v1.4.30 (2018-09-05)

### Modified
* [AppMoney][Fix] Fixed retrieval of accounts and balance after saving a movement (new/edit).

## v1.4.29 (2018-09-04)

### Modified
* [AppCommon] Rename script to start application `start:node` to just `start`.

## v1.4.28 (2018-09-03)

### Added
* [AppMoney][Movements] Movement cards full width on mobile.

## v1.4.27 (2018-08-31)

### Added
* [AppMoney][Movements] After saving a movement (new/edit) retrieves new account/balance information to populate account combo.

## v1.4.26 (2018-08-30)

### Added
* [AppCommon] `DateUtils.lastDayInMonth()` and `DateUtils.addMonths()` added.
* [AppMoney][Movements] Account to combo items now render current balance.

## v1.4.25 (2018-08-29)

### Added
* [AppMoney][Movements] REST API Endpoint for calculating average balance for a period in `/api/movements/average-balance`.
  query params are:
  - account: account id for the account to be calculated.
  - checkday: if true, use the account check day for the calculation, otherwise use day 1 of month.
  - year: base year to be calculated.
  - month: base month to be calculated.
  If checkday is falsy, uses first day of the provided year/month to calculate the average balance through the last day of the month.
  If checkday is true, it will start with calculation from the checkday of the account from the previous month through
  provided year/month checkday-previous day.

## v1.4.24 (2018-08-28)

### Added
* [AppMoney][Movements] Enable Presets based on Transfers.

## v1.4.23 (2018-08-27)

### Added
* [AppMoney][Movements] Account combo list displays current account balance.

## v1.4.22 (2018-08-24)

### Added
* [AppMoney][Movements] Endpoint for retrieving accounts with current final balance for displaying in accounts combo.

## v1.4.21 (2018-08-23)

### Added
* [AppGeneral] Fix date fields initialization when value is null, now it assigns null instead of the date returned by `new Date(null)`.

## v1.4.20 (2018-08-22)

### Added
* [AppMoney][Movements] Form manage all cases independently.

## v1.4.19 (2018-08-21)

### Added
* [AppMoney][ComboItem] Basic styling for integration.

## v1.4.18 (2018-08-20)

### Added
* [AppMoney][Movements] Responsive form on mobile.

## v1.4.18 (2018-08-17)

### Added
* [AppMoney][Movements] Reset form properly for new movements.

## v1.4.17 (2018-08-16)

### Added
* [AppMoney][Movements] Show movement id if rendering an existing movement on form.

## v1.4.16 (2018-08-15)

### Added
* [AppMoney][Presets] Preset listing in movements UI form.
* [AppMoney][Presets] Preset connection with backend service new endpoint.

## v1.4.15 (2018-08-14)

### Added
* [AppCommon] Added Preset to installation.
* [AppMoney][Presets] UI service changes to push to server new presets.

## v1.4.14 (2018-08-13)

### Added
* [AppMoney][Presets] Entity File for Preset.
* [AppMoney][Presets] Route and Server with listing, create and update REST API endpoint handlers.

## v1.4.13 (2018-08-10)

### Added
* [AppMoney][Presets] Template definition for Preset entity.
* [AppCommon] On File Type generation, added a flag to identify if recordName
  has been set to at least one field on each Entity, not blocking but it
  will show an error on console.

## v1.4.12 (2018-08-09)

### Modified
* [AppCommon] Fix login component template reference.
* [AppMoney][Movements] Added CSS styling to card listing and form.

## v1.4.11 (2018-08-08)

### Added
* [AppMoney][Movements] Show badges for new and updated movements to identify them on the card listing.
* [AppMoney][Movements] Reset form after new movement is created or after a movement is edited/saved.

## v1.4.10 (2018-08-07)

### Added
* [AppMoney][Movements] Push new movement into card listing and order properly.
* [AppMoney][Movements] Update movement into card listing.

## v1.4.9 (2018-08-06)

### Added
* [AppMoney][Movements] `model.id` to identify when the form data is an existing movement or not.
* [AppMoney][Movements] `setModelDetails()` method for updating the form with values from an existing movement / details view.

## v1.4.8 (2018-08-02)

### Modified
* [AppMoney][Movements] Refactored `sort()` method to use outside of the service.
* [AppMoney][Movements] Refactored grid listing into card listing for movements page.

## v1.4.7 (2018-08-01)

### Added
* [AppMoney][Movements] Edit method and integration with backend update REST API endpoint.

## v1.4.6 (2018-07-31)

### Modified
* [AppCommon] Changes detection on `MoSQL` for dates now are properly handled and result is stored as date.
* [AppMoney] Disable save to localStorage on balance and entry services.

## v1.4.5 (2018-07-30)

### Added
* [AppCommon] Login basic UI components.

## v1.4.4 (2018-07-28)

### Modified
* [AppCommon] Fixed compilation issues.

## v1.4.3 (2018-07-27)

### Added
* [AppCommon] `/generator/database` route to generate all tables, pk indexes and views to database.
* [AppCommon] `InstallModule` to support database creation and data population.
* [AppCommon] `MoInstallSQL.createPKSQL()` and `MoInstallSQL.createViewSQL()` methods.
* [AppCommon] `ConnectionService.runSyncSql()` method to run sql one after another using callbacks.

## v1.4.2 (2018-07-26)

### Added
* [AppCommon] View information added to entity generation.

### Modified
* [AppCommon] Status fields now uses base template, this populates correctly the entity field.

## v1.4.1 (2018-07-25)

### Added
* [AppCommon] Added `cfg.json` setup to README.md.
* [AppCommon] Add `cfg.json` to gitignore. Structure for cfg is:
```javascript
[
    {
        "name"     : "default",
        "host"     : "localhost",
        "user"     : "some_user",
        "password" : "some_password",
        "database" : "some_db"
    }
]
```

## v1.4.0 (2018-07-24)

### Added
* [AppCommon] ApiModule Sync method.

### Modified
* [Breaking][AppCommon] Refactor to support sync method on ApiModule.

## v1.3.6 (2018-07-23)

### Added
* [AppMoney] Edit Movement REST endpoint, including updating Entries and Balance rebuild.

## v1.3.5 (2018-07-20)

### Added
* [AppMoney] Category create and Place create REST endpoints.
* [AppMoney] New Category, Place from UI and integration with REST endpoint.

## v1.3.4 (2018-07-19)

### Added
* [AppMoney] Movements UI new movement integration with REST API create method.
* [AppGeneral] Query params for filtering list REST methods use groups and expression structures.
Example:
```javascript
{
    gc: "AND",
    cont: [{
        f: "acc_ctg_status",
        op: "eq",
        val: "1"
    }]
}
```

### Modified
* [AppCommon] Changed all filtering done through `MoSQL.toSelect()` that received a filtering object to use the new filter expressions.

## v1.3.3 (2018-07-18)

### Added
* [AppMoney] Movements UI now fetches Accounts, Categories and Places from server.
* [AppMoney] Filter accounts with status ACTIVE.

## v1.3.2 (2018-07-17)

### Added
* [AppCommon] Added `web.config` for node deploy with IIS.
* [AppCommon] Added `/status` route for verifying server status once deployed.

## v1.3.1 (2018-07-16)

### Added
* [AppMoney] Added routes for Entry, Place and Account.

### Modified
* [AppCommon] iNode now uses express types for request and response instead of node's native ones.
* [AppMoney] Movement routes moved under /api/movements.

## v1.3.0 (2018-07-15)

### Modified
* [Breaking][AppCommon] All routing for node endpoints moved to /api.
* [Breaking][AppCommon] `iNode` reduced to just `{req, res}` to clean up the interface.
* [Breaking][AppMoney] Balance endpoints moved under /api/balance.

## v1.2.22 (2018-07-13)

### Added
* [AppCommon] Generic Validation Class structure.
* [AppCommon] Change Balance FE class and use Balance Crosscommon class in FE.

## v1.2.21 (2018-07-12)

### Added
* [AppCommon] Route structure separated from server file and inside /api route.
* [AppMoney] /api/categories REST get endpoint for category listing.

## v1.2.20 (2018-07-11)

### Added
* [AppMoney] Routes to support Moevements and Balance pages data listing (movement, entry and balance).

## v1.2.19 (2018-07-10)

### Fixed
* [AppMoney] Fixed flow for applying entries to balance on movement creation via hooks.

## v1.2.18 (2018-07-09)

### Added
* [AppGenerator] Generator now creates Date objects for date fields on constructor.

## v1.2.17 (2018-07-08)

### Added
* [AppMoney] Balance Module for rebuild and transfer balance.

## v1.2.16 (2018-07-07)

### Fixed
* [AppMoney] Fixed promise compilation for UI components.

## v1.2.15 (2018-07-06)

### Added
* [AppMoney] Balance grid now has a new column with an option to show movements for an account/month/year in a table below.

## v1.2.14 (2018-07-05)

### Added
* [AppMoney] Movement import, entry and balance generation routes and methods.

## v1.2.13 (2018-07-04)

### Added
* [Generator] ApiModule and DateUtility base classes.

## v1.2.12 (2018-07-03)

### Added
* [AppMoney] Routing and server handlers for movements import, entry generation and balance generation.

## v1.2.11 (2018-07-02)

### Added
* [Generator] Added `MoBasicGenerator.ts`, `MoSQL.ts`, `MoGen.ts`, `MoInstallSQL.ts` and `Utility.ts` classes.

## v1.2.10 (2018-07-01)

### Added
* [Generator] Added method `recordName()` to iEntity and updated entities.

## v1.2.9 (2018-06-30)

### Added
* [Generator] Generated entities with metadata.

## v1.2.8 (2018-06-29)

### Added
* [Generator] EntityParser.ts and MoBasicGenerator.ts with FileType generation.

## v1.2.7 (2018-06-28)

### Added
* [Generator] Interfaces and classes for generator.

## v1.2.6 (2018-06-27)

### Added
* [Generator] Migration of existing Entities.

## v1.2.5 (2018-06-10)

### Added
* [Server.ts] Server, connection and config for node-typescript.

## v1.2.4 (2018-05-16)

### Added
* [Money] Entry - Client handler to display data from server (no localStorage saving).

## v1.2.3 (2018-05-14)

### Added
* [Money] Balance - Client handler to display data from server (no localStorage saving).

## v1.2.2 (2018-05-09)

### Added
* [Sync] "get" Method for general get requests.

### Changed
* [Money] Movements - Client handler to display data from server (no localStorage saving).
* [Tasks] Comparison - Fixes for markup and logic.

## v1.2.1 (2018-04-18)

### Added
* Basic Webpack bundling configuration, a little quirky but functional

## v1.2.0 (2018-03-03)

### Added
* Node :-D

## v1.1.1 (2018-03-02)

### Added
* Added real changelog.
* Send browser data to server on comparison results.
* Activated comparison results to solve differences as they come up.

## v1.1.0 (2018-02-27)

### Changed
* Current status :-)