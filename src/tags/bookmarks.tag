<wallaby-bookmarks>
  <div class="list">
    <wallaby-bookmark each={ bookmark in opts.state.bookmarks || [] }
      doc-id={ bookmark.id }
      page={ bookmark.page }
      panel={ bookmark.panel }
      smartpanel={ bookmark.smartPanel }
      meta={ bookmark.meta }
      state={ parent.opts.state }>
    </wallaby-bookmark>
  </div>
  <script type="es6">
    this.loading = false

    this.loadBookmarks = () => {
      opts.state.bookmarks = null
      this.loading = true
      this.wallaby.getBookmarks(opts.state.auth)
        .then((bookmarks) => {
          opts.state.bookmarks = bookmarks.result
          this.update()
          this.loading = false
        })
        .catch((err) => {
          this.notify('error', err.message || 'Unexpected error')
          this.loading = false
        })
    }

    this.on('mount', () => {
      this.loadBookmarks()
    })

    this.on('update', () => {
      if (!opts.state.bookmarks && !this.loading) {
        this.loadBookmarks()
      }
    })
  </script>
</wallaby-bookmarks>
