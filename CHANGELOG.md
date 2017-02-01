Changelog
=========

## [UNRELEASED]

### Configuration

* Updated production "wallaby.app_src" configuration value to point to CDN.

### Bugs

* Navigating after the session expired did not allow the user to
  re-authenticate. (reader)
* Sample page and authentication success page are not responsive. (mobile)
* Page numbers are 1 less than expected value. (api)
* Retrieving bookmarks with `limit=10` returns 11 results. (api)

### Features

* Add favicons and touch icons.
* Store and return "updatedAt" value with bookmarks. This string tracks the
  date and time that the bookmark was last updated.
