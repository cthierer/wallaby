<wallaby-login>
  <a class="button" href="#" onclick={ login } hide={ opts.state.auth }>
    <yield>
  </a>
  <div class="user" if={ opts.state.auth }>
    <span class="username">{ opts.state.auth.username }</span>
    <a class="button" href="#" onclick={ logout }>logout</a>
  </div>
  <script type="es6">
    this.loginWindow = null
    // only use github right now
    // TODO support multiple authentication providers
    this.provider = this.wallaby.config.providers
      .filter(provider => provider.key === 'github')
      .shift()

    this.on('mount', () => {

      window.addEventListener('message', (e) => {
        const origin = event.origin || event.originalEvent.origin

        console.log('origin', origin)
        console.log('host', this.wallaby.config.host)

        if (origin !== this.wallaby.config.host) {
          return
        }

        const data = e.data

        console.log('data', data)

        if (data.token && data.provider) {
          opts.state.auth = data

          if (this.loginWindow) {
            this.loginWindow.close()
            this.loginWindow = null
          }

          opts.state.trigger('update')
        }
      }, false)
    })

    this.login = (e) => {
      e.preventDefault()
      const authUrl = `${this.wallaby.config.base_uri}${this.provider.endpoint}`
      this.loginWindow = window.open(authUrl, `login | ${this.wallaby.config.app_name}`)
      return false
    }

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
