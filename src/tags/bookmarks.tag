<wallaby-bookmarks>
  <div class="list">
    <div data-is="wallaby-bookmark" each={ bookmark in opts.state.bookmarks || [] }
      doc-id={ bookmark.id }
      page={ bookmark.page }
      panel={ bookmark.panel }
      smartpanel={ bookmark.smartPanel }
      meta={ bookmark.meta }
      updated-at={ bookmark.updatedAt }
      state={ parent.opts.state }>
    </div>
  </div>
  <div class="row">
    <div class="col-12">
      <p class="lead" hide={ opts.state.bookmarks && opts.state.bookmarks.length }>
        none.
      </p>
    </div>
  </div>
  <script type="es6">
    this.loading = false

    this.loadBookmarks = () => {
      opts.state.bookmarks = null

      // only load bookmarks if logged in
      if (!opts.state.auth) {
        return
      }

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
  <style scoped>
    .list > * {
      margin-bottom: 1.5rem;
    }

    .list > a:last-child {
      margin-bottom: 0;
    }
  </style>
</wallaby-bookmarks>
