<wallaby-import>
  <button class="button" onclick={ selectFile }>
    <yield>
  </button>
  <input class="hidden" type="file" ref="upload" onchange={ import }>
  <script type="es6">
    this.selectFile = () => {
      this.refs.upload.click()
    }

    this.import = () => {
      const files = Array.from(this.refs.upload.files)
      const reader = new FileReader()

      reader.onload = (e) => {
        this.wallaby.importBookmarks(opts.state.auth, JSON.parse(e.target.result))
          .then((result) => {
            this.notify('info', `Imported ${result.total} bookmark(s).`)
            opts.state.bookmarks = null
            opts.state.bookmarksFilter = null
            opts.state.collections = null
            opts.state.trigger('update')
          })
          .catch((err) => {
            this.notify('error', err.message || 'Unexpected error')
          })
      }

      files.forEach(file => reader.readAsText(file))
    }
  </script>
  <style scoped>
    .hidden {
      display: none;
    }
  </style>
</wallaby-import>
