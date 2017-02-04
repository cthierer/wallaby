<wallaby-filter>
  <form ref="filter" onsubmit={ updateFilter }>
    <div class="filter">
      <label for="filterCollection">
        <core-icon name="repo" width="18px" height="18px"></core-icon>
        collection
      </label>
      <select id="filterCollection" name="collection" onchange={ updateFilter }>
        <option value="" default>all</option>
        <option each={ opts.state.collections } value={ key } selected={ parent.opts.state.bookmarksFilter.collection === key }>
          { title }
        </option>
      </select>
    </div>
  </form>
  <script type="es6">
    const serialize = riot.mixin('serialize')

    this.loading = false

    this.loadCollections = () => {
      this.loading = true
      return this.wallaby.getCollections(opts.state.auth)
        .then((response) => {
          const collections = response.result
          opts.state.collections = collections
          opts.state.trigger('update')
          this.loading = false
        })
        .catch((err) => {
          this.notify('error', err.message || 'Unexpected error')
          this.loading = false
        })
    }

    this.on('mount', () => {
      this.loadCollections()
    })

    this.on('update', () => {
      if (!opts.state.collections && !this.loading) {
        this.loadCollections()
      }
    })

    this.updateFilter = (e) => {
      e.preventDefault()
      const filter = serialize(this.refs.filter, { hash: true })
      opts.state.bookmarksFilter = filter
      opts.state.bookmarks = null
      opts.state.trigger('update')
      return false
    }
  </script>
  <style scoped>
    form {
      display: inline-block;
    }

    .filter {
      background-color: transparent;
      border: none;
      border: 1px solid #333;
      border-radius: 2px;
      display: inline-block;
      font-size: .9rem;
      padding: 2px 8px;
    }

    .filter .core-icon {
      fill: #2b76cb;
      height: 18px;
      margin-right: 4px;
      vertical-align: bottom;
      width: 18px;
    }

    .filter select {
      border: none;
      font-weight: 700;
      padding: 0 8px;
    }
  </style>
</wallaby-filter>
