<wallaby-bookmark-button>
  <span data-is="core-icon" class="toolbar-icon { disabled: opts.disabled }"
    show={ opts.state.auth }
    name="bookmark"
    alt="save position"
    width="24px"
    height="35px"
    onclick={ saveBookmark }>
  </span>
  <span data-is="wallaby-login"  hide={ opts.state.auth } state={ opts.state }>
    <span data-is="core-icon" class="toolbar-icon { disabled: opts.disabled }"
      name="key"
      alt="login to github"
      width="24px"
      height="35px"></span>
  </span>
  <script type="es6">
    this.app = null
    this.models = null
    this.controls = null
    this.model = null

    this.one('mount', () => {
      // set references to the comic reader application, if it is found in scope
      this.app = window.rocket || {}
      this.models = this.app.models || {}
      this.controls = this.models.controlsModel || {}
      this.model = this.models.model || {}

      // proxy object to handle refreshing the wallaby session when the user
      // takes action within the reader application
      // this serves to keep the session alive while the user is reading
      const refreshSession = (target, thisArg, args) => {
        this.wallaby.pingSession(opts.state.auth)
          // session still good
          .then(() => { opts.state.trigger('update') })
          // session expired - log the user out
          .catch(() => { opts.state.trigger('destroy') })
        return target.apply(thisArg, args)
      }

      // wrap the proxy around the `goToNext` control
      if (typeof this.controls.goToNext === 'function') {
        const nextPageProxy = new Proxy(this.controls.goToNext, {
          apply: refreshSession
        })
        this.controls.goToNext = nextPageProxy
      }

      // wrap the proxy around the `goToPrevious` control
      if (typeof this.controls.goToPrevious === 'function') {
        const prevPageProxy = new Proxy(this.controls.goToPrevious, {
          apply: refreshSession
        })
        this.controls.goToPrevious = prevPageProxy
      }
    })

    /**
     * Save a bookmark to the API.
     * @todo Refactor to break up function into testable parts.
     */
    this.saveBookmark = () => {
      const loc = this.model.loc || {}
      const controlsAttributes = this.controls.attributes || {}
      const smartPanel = controlsAttributes.smartPanel || false

      // pull id from the reader application
      const id = this.model.id
      const page = loc.pageIdx
      const panel = loc.panelIdx

      // generate metainformation from HTML tags
      const metaTags = document.getElementsByTagName('meta')
      const metaArr = metaTags ? Array.from(metaTags) : []
      const metadata = metaArr
        // only include open graph tags
        .filter((tag) => {
          const attributes = tag.attributes || {}
          const property = attributes.property || {}
          return property.value && property.value.startsWith('og:')
        })
        // strip out the "og:" prefix
        .reduce((data, tag) => {
          const property = tag.attributes.property.value.substr(3)
          const content = tag.attributes.content || {}
          const value = content.value || null
          if (value) {
            return Object.assign(data, { [property]: value })
          }
          return data
        }, {})

      // trigger the save operation
      this.wallaby.saveBookmark(id, {
        page,
        panel,
        smartPanel,
        meta: metadata
      }, opts.state.auth)
        // success
        .then(() => {
          const position = smartPanel
            ? `at page ${page}, panel ${panel}`
            : `at page ${page}`
          this.notify('info', `Created bookmark ${position}.`)
        })
        // failure
        .catch((err) => {
          const message = err.message
            ? err.message
            : 'Unexpected error.'
          this.notify('error', message)
        })
    }
  </script>
  <style scoped>
    .toolbar-icon {
      margin-top: 5px;
      padding-right: 10px;
      text-indent: 0;
    }

    .toolbar-icon.disabled {
      cursor: default;
    }

    .toolbar-icon .core-icon {
      fill: #808080;
    }

    .toolbar-icon:hover .core-icon {
      fill: #f7f7f7;
    }

    .toolbar-icon.disabled .core-icon {
      fill: #292929;
    }
  </style>
</wallaby-bookmark-button>
