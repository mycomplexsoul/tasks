# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Notes]
* TODO: Test runner for node.

## [Unreleased]

* [Breaking -> 1.3] [AppCommon] All routing for node endpoints moved to /api.
* [Breaking -> 1.x] [AppCommon] iNode reduced to just `{req, res}` to clean up the interface.

<hr/>

<a name="1.2.22"></a>
## 1.2.22 (2018-07-13)
### Added
* [AppCommon] Generic Validation Class structure.
* [AppCommon] Change Balance FE class and use Balance Crosscommon class in FE.

<a name="1.2.21"></a>
## 1.2.21 (2018-07-12)
### Added
* [AppCommon] Route structure separated from server file and inside /api route.
* [AppMoney] /categories REST get endpoint for category listing.

<a name="1.2.20"></a>
## 1.2.20 (2018-07-11)
### Added
* [AppMoney] Routes to support Moevements and Balance pages data listing (movement, entry and balance).

<a name="1.2.19"></a>
## 1.2.19 (2018-07-10)
### Fixed
* [AppMoney] Fixed flow for applying entries to balance on movement creation via hooks.

<a name="1.2.18"></a>
## 1.2.18 (2018-07-09)
### Added
* [AppGenerator] Generator now creates Date objects for date fields on constructor.

<a name="1.2.17"></a>
## 1.2.17 (2018-07-08)
### Added
* [AppMoney] Balance Module for rebuild and transfer balance.

<a name="1.2.16"></a>
## 1.2.16 (2018-07-07)
### Fixed
* [AppMoney] Fixed promise compilation for UI components.

<a name="1.2.15"></a>
## 1.2.15 (2018-07-06)
### Added
* [AppMoney] Balance grid now has a new column with an option to show movements for an account/month/year in a table below.

<a name="1.2.14"></a>
## 1.2.14 (2018-07-05)
### Added
* [AppMoney] Movement import, entry and balance generation routes and methods.

<a name="1.2.13"></a>
## 1.2.13 (2018-07-04)
### Added
* [Generator] ApiModule and DateUtility base classes.

<a name="1.2.12"></a>
## 1.2.12 (2018-07-03)
### Added
* [AppMoney] Routing and server handlers for movements import, entry generation and balance generation.

<a name="1.2.11"></a>
## 1.2.11 (2018-07-02)
### Added
* [Generator] Added `MoBasicGenerator.ts`, `MoSQL.ts`, `MoGen.ts`, `MoInstallSQL.ts` and `Utility.ts` classes.

<a name="1.2.10"></a>
## 1.2.10 (2018-07-01)
### Added
* [Generator] Added method `recordName()` to iEntity and updated entities.

<a name="1.2.9"></a>
## 1.2.9 (2018-06-30)
### Added
* [Generator] Generated entities with metadata.

<a name="1.2.8"></a>
## 1.2.8 (2018-06-29)
### Added
* [Generator] EntityParser.ts and MoBasicGenerator.ts with FileType generation.

<a name="1.2.7"></a>
## 1.2.7 (2018-06-28)
### Added
* [Generator] Interfaces and classes for generator.

<a name="1.2.6"></a>
## 1.2.6 (2018-06-27)
### Added
* [Generator] Migration of existing Entities.

<a name="1.2.5"></a>
## 1.2.5 (2018-06-10)
### Added
* [Server.ts] Server, connection and config for node-typescript.

<a name="1.2.4"></a>
## 1.2.4 (2018-05-16)
### Added
* [Money] Entry - Client handler to display data from server (no localStorage saving).

<a name="1.2.3"></a>
## 1.2.3 (2018-05-14)
### Added
* [Money] Balance - Client handler to display data from server (no localStorage saving).

<a name="1.2.2"></a>
## 1.2.2 (2018-05-09)
### Added
* [Sync] "get" Method for general get requests.

### Changed
* [Money] Movements - Client handler to display data from server (no localStorage saving).
* [Tasks] Comparison - Fixes for markup and logic.

<a name="1.2.1"></a>
## 1.2.1 (2018-04-18)
### Added
* Basic Webpack bundling configuration, a little quirky but functional

<a name="1.2.0"></a>
## 1.2.0 (2018-03-03)
### Added
* Node :-D

<a name="1.1.1"></a>
## 1.1.1 (2018-03-02)
### Added
* Added real changelog.
* Send browser data to server on comparison results.
* Activated comparison results to solve differences as they come up.

<a name="1.1.0"></a>
## 1.1.0 (2018-02-27)
### Changed
* Current status :-)