Changelog
=========

## 1.1.1 / 2017-02-04

### Bugs

* Deleting a bookmark did not remove it from collections. (api)
* Console error when rendering collections filter dropdown. (client)

## 1.1.0 / 2017-02-04

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
* Import and export bookmarks through the web UI and API.
* Validate user inputs, and handle validation failures by sending the
  appropriate HTTP status.
* Group and filter bookmarks by collections.
