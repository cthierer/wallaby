<wallaby-export>
  <button class="button" onclick={ export }>
    <yield>
  </button>
  <a if={ fileContents } ref="download" class="hidden" href={ fileContents } download={ filename() }>
    { filename() }
  </a>
  <script type="es6">
    this.fileContents = null

    this.filename = () => `bookmarks-${opts.state.auth.username}.json`

    this.export = () => {
      this.wallaby.exportBookmarks(opts.state.auth)
        .then((bookmarks) => {
          const data = new Blob([JSON.stringify(bookmarks)], { type: 'application/json' })
          const dataUrl = URL.createObjectURL(data)
          this.fileContents = dataUrl
          this.update()
        })
        .catch((err) => {
          this.notify('error', err.message || 'Unexpected error')
        })
    }

    this.on('updated', () => {
      if (this.refs.download) {
        this.refs.download.click()
      }

      if (this.fileContents) {
        URL.revokeObjectURL(this.fileContents)
        this.fileContents = null
        this.update()
      }
    })
  </script>
  <style scoped>
    .hidden {
      display: none;
    }
  </style>
</wallaby-export>
