# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Notes / To Do / Roadmap]
* [AppCommon] Test runner for node.
* [AppMoney] New Category, Place from UI.

## [Unreleased / Work In Progress]
* [AppGeneral] Query params for filtering list REST methods use groups and expression structures. query = {groupConnector:"AND", content: [{field: "acc_id_status", op: "eq", value: "1"}]}


<hr/>

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