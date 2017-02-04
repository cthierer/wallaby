<wallaby-export>
  <button class="button" onclick={ export }>
    <yield>
  </button>
  <a if={ fileContents } ref="download" class="hidden" href={ fileContents } download={ filename() }>
    { filename() }
  </a>
  <script type="es6">
    const download = () => {
      if (this.refs.download) {
        this.refs.download.click()
      }
    }

    this.fileContents = null
    this.filename = () => `bookmarks-${opts.state.auth.username}.json`
    this.export = () => {
      if (this.fileContents) {
        URL.revokeObjectURL(this.fileContents)
        this.fileContents = null
      }

      this.wallaby.exportBookmarks(opts.state.auth)
        .then((bookmarks) => {
          const data = new Blob([JSON.stringify(bookmarks)], { type: 'application/json' })
          const dataUrl = URL.createObjectURL(data)

          this.fileContents = dataUrl
          this.one('updated', download)
          this.update()
        })
        .catch((err) => {
          this.notify('error', err.message || 'Unexpected error')
        })
    }
  </script>
  <style scoped>
    .hidden {
      display: none;
    }
  </style>
</wallaby-export>
