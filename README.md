wallaby
=======
> bookmarklet to save where you left off in digital comics

A simple application to handle saving "bookmarks" in a Redis database, using
Riot for the client, and Koa for the server. Built to solve the problem that
the Marvel reader application does not provide functionality to save progress
while reading comics.

The application provides a bookmarklet that adds a new button to the comic
reader application allowing the user to save their current spot.

Users must authenticate using their GitHub credentials; all bookmarks stored
in the database are tied to the user's GitHub account.

## Configuration

The following environment variables must be set:

  * `GH_CLIENT_ID`: GitHub application client ID, used for OAuth.
  * `GH_CLIENT_SECRET`: GitHub application secret.
  * `GH_REDIRECT_URI`: GitHub callback redirect URL.
  * `REDIS_URL`: connection parameters for the Redis database. If blank, then
    uses the default connection parameters with no authentication.
  * `HOST`: the hostname where the application is running (e.g.,
    "http://localhost:3000")

Additional configuration values can be set by creating "config/local.json", and
overwriting the values from "config/default.json".
