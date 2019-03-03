# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Notes / To Do / Roadmap]
* Money
    * Balance
        * Balance new fields: comment, date_last_valid, swap charges-withdrawals legends
        * Display Average Balance on Balance page (using account daycheck information)
    * Movement features
        * Movements with pending status
        * Scheduled movements
        * Movement form validation server side
        * Movement form validation client side
        * Combo-item value validation against a provided list
* Tasks
    * Indicator for last finished task timestamp
    * Keyboard shortcuts for navigating from record list to next/previous record list and focus into first task in the list
    * Once focused on estimated time, pressing arrow up/down should navigate to previous/next task in the list, focusing on the task description
    * Option to show/hide Indicators
    * Clean up Indicators legacy section
    * Unset schedule, unset link
* Login
    * Login basic CSS.
    * Login server user validation.
    * Login logged user identity service.
* Common
    * Refactor database view generation for using joins on catalog instead of subqueries.
    * Refactor accounts with balance endpoint to have an endpoint that uses a sql query as param.
    * Unit test runner for server.
    * Unit test runner for client.
    * [AppCommon] Display version in main page footer.
    * [AppCommon] Node build into `/dist` folder.
    * [AppCommon] Angular build into `/dist` folder.
    * [AppCommon] Deploy BE + FE in `/dist` folder.

## [Unreleased / Work In Progress]
* [AppMultimedia][new] Be able to edit ep id in form in order to create or edit posterior episodes.

<hr/>

## v1.7.31 (2019-01-25)

* [AppCommon][new] Config for azure deploy.

## v1.7.30 (2019-01-24)

* [AppMultimedia][new] Load details into form on selecting a MultimediaDet record.

## v1.7.29 (2019-01-23)

* [AppMultimedia][new] MultimediaDet listing on selecting Multimedia record.

## v1.7.28 (2019-01-22)

* [AppMultimedia][new] Integrate form with MultimediaDet, MultimediaView and Multimedia endpoints as a single Sync API call.
* [AppMultimedia][new] Update handler compatible to work with Sync API.

## v1.7.27 (2019-01-21)

* [AppMultimedia][new] MultimediaDet service to integrate with backend endpoint using Sync API.
* [AppMultimedia][new] MultimediaView service to integrate with backend endpoint using Sync API.

## v1.7.26 (2019-01-18)

* [AppMultimedia][new] MultimediaDet / Multimedia View creation form.

## v1.7.25 (2019-01-17)

* [AppCommon][new] SyncCustom support for `MultimediaView`.

## v1.7.24 (2019-01-16)

* [AppCommon][new] SyncAPI `asSyncQueue` and `requestQueue` methods.
* [AppCommon][new] `SyncQueue` interface extracted to an individual file.

## v1.7.23 (2019-01-15)

* [AppCommon][fix] `Utility.getPKFromEntity()` was not returning pk, now it does.

## v1.7.22 (2019-01-14)

* [AppMultimedia][new] Added listing, create and update methods for MultimediaDet, reachable through Sync (list) and through `/multimediadet` (create, update).

## v1.7.21 (2019-01-11)

* [AppMultimedia][new] Added catalog loading, submit form, connection with Sync API to multimedia methods.
* [AppCommon][new] Added multimedia link to menu.

## v1.7.20 (2019-01-10)

* [AppMultimedia][new] Added listing UI and creation form.
* [AppCommon][new] Added `PREVIOUS-CHANGELOG.md` for old versions documentation.

## v1.7.19 (2019-01-09)

* [AppMultimedia][new] Added FE service to connect to Sync API.

## v1.7.18 (2019-01-08)

* [AppCommon][new] Added listing logic to Sync API.

## v1.7.17 (2019-01-07)

* [AppMultimedia][new] Added multimedia create/update methods to Sync API.

## v1.7.16 (2019-01-04)

* [AppMultimedia][new] Added create and update routes/endpoints.

## v1.7.15 (2019-01-03)

* [AppMultimedia][new] Created `/multimedia` routes and listing endpoint.

## v1.7.14 (2019-01-02)

* [AppMultimedia][fix] Fix PK of multimedia tables, added installation of those tables.

## v1.7.13 (2018-12-21)

* [AppGenerator][fix] Added `isRecordName` flag to fields of entities that does not have set any field as record name.

## v1.7.12 (2018-12-20)

* [AppGenerator][new] UI consumes endpoint to check selected entities on the backend.

## v1.7.11 (2018-12-19)

* [AppGenerator][new] Endpoint to check selected entities on the backend, currently checks if entities have recordName fields.

## v1.7.10 (2018-12-18)

* [AppGenerator][new] UI consumes endpoint to generate selected entities on the backend.

## v1.7.9 (2018-12-17)

* [AppMultimedia][new] Entity definition templates for: multimedia, multimediadet and multimediaview.
* [AppCommon][new] Login service can be asked for a user.

## v1.7.8 (2018-12-14)

* [AppMoney][fix] Avegare balance calculation for January was not calculating correctly previous months.

## v1.7.7 (2018-12-13)

* [AppCommon] Added methods to calculate year/month ahead and previous.

## v1.7.6 (2018-12-12)

* [AppMoney] Improved apply entries to balance routine when used in movements for previous month.
* [AppMoney] Added base routine for initialization on remote for Money App.

## v1.7.5 (2018-12-11)

* [AppMoney] Improved transfer endpoint when used in range rebuild and transfer.

## v1.7.4 (2018-12-10)

* [AppMoney] Improved rebuild endpoint when used in range rebuild and transfer.

## v1.7.4 (2018-12-10)

* [AppCommon] `MoSQL.toChangesObject()` now returns null if no changes were found.

## v1.7.3 (2018-12-06)

* [AppMoney][fix] Balance, fixed error on balance month change if no account was selected.

## v1.7.2 (2018-12-05)

* [AppLastTime] Edit notes button and request on UI.

## v1.7.1 (2018-12-04)

* [AppLastTime] Listing now filters ACTIVE records.

## v1.7.0 (2018-12-03)

* [Breaking][AppCommon] Config module now handles changes to cfg.json for two db configuration.
* [Breaking][AppCommon] `ConnectionService` improvements to handle cfg.json and db selector.
