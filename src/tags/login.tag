<wallaby-login>
  <a href="#" onclick={ login } hide={ opts.state.auth }>
    <yield>
  </a>
  <div class="user" if={ opts.state.auth }>
    <span class="username">{ opts.state.auth.username }</span>
    <a href="#" onclick={ logout }>logout</a>
  </div>
  <script type="es6">
    this.loginWindow = null
    // only use github right now
    // TODO support multiple authentication providers
    this.provider = this.wallaby.config.providers
      .filter(provider => provider.key === 'github')
      .shift()

    this.on('mount', () => {
      // listen for message events on this page
      // oauth authentication happens in a child window
      // that window will send a message with the credentials when complete
      window.addEventListener('message', (e) => {
        const origin = event.origin || event.originalEvent.origin

        // check that this came from the wallaby application and not a stranger
        if (origin !== this.wallaby.config.host) {
          return
        }

        const data = e.data

        if (data.token && data.provider) {
          // load the auth data
          opts.state.auth = data

          if (this.loginWindow) {
            // close the child window that handled the oauth
            this.loginWindow.close()
            this.loginWindow = null
          }

          // update state
          opts.state.trigger('update')
        }
      }, false)
    })

    /**
     * Open a new window to handle the Oauth authentication.
     */
    this.login = (e) => {
      e.preventDefault()
      const authUrl = `${this.wallaby.config.base_uri}${this.provider.endpoint}`
      this.loginWindow = window.open(authUrl, '_blank')
      return false
    }

    /**
     * Delete the current session.
     */
    this.logout = (e) => {
      e.preventDefault()
      if (opts.state.auth) {
        this.wallaby.logoutSession(opts.state.auth)
        opts.state.trigger('destroy')
      }
      return false
    }
  </script>
</wallaby-login>
