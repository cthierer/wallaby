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
      this.app = window.rocket || {}
      this.models = this.app.models || {}
      this.controls = this.models.controlsModel || {}
      this.model = this.models.model || {}

      const refreshSession = (target, thisArg, args) => {
        this.wallaby.pingSession(opts.state.auth)
          .then(() => { opts.state.trigger('update') })
          .catch(() => { opts.state.trigger('destroy') })
        return target.apply(thisArg, args)
      }

      if (typeof this.controls.goToNext === 'function') {
        const nextPageProxy = new Proxy(this.controls.goToNext, {
          apply: refreshSession
        })
        this.controls.goToNext = nextPageProxy
      }

      if (typeof this.controls.goToPrevious === 'function') {
        const prevPageProxy = new Proxy(this.controls.goToPrevious, {
          apply: refreshSession
        })
        this.controls.goToPrevious = prevPageProxy
      }
    })

    this.saveBookmark = () => {
      const loc = this.model.loc || {}
      const controlsAttributes = this.controls.attributes || {}
      const smartPanel = controlsAttributes.smartPanel || false

      const id = this.model.id
      const page = loc.pageIdx
      const panel = loc.panelIdx

      const metaTags = document.getElementsByTagName('meta')
      const metaArr = metaTags ? Array.from(metaTags) : []
      const metadata = metaArr
        .filter((tag) => {
          const attributes = tag.attributes || {}
          const property = attributes.property || {}
          return property.value && property.value.startsWith('og:')
        })
        .reduce((data, tag) => {
          const property = tag.attributes.property.value.substr(3)
          const content = tag.attributes.content || {}
          const value = content.value || null
          if (value) {
            return Object.assign(data, { [property]: value })
          }
          return data
        }, {})

      this.wallaby.saveBookmark(id, {
        page,
        panel,
        smartPanel,
        meta: metadata
      }, opts.state.auth)
        .then(() => {
          const position = smartPanel
            ? `at page ${page}, panel ${panel}`
            : `at page ${page}`
          this.notify('info', `Created bookmark ${position}.`)
        })
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
