<wallaby-bookmark>
  <article class="bookmark">
    <div class="image">
      <img if={ opts.meta.image } src="{ opts.meta.image }" alt="{ opts.meta.title }" />
    </div>
    <div class="content">
      <h1 if={ opts.meta.title } class="title">
        <a class="name" href={ getHref() } target="_blank">{ opts.meta.title }</a>
        <span if={ opts.meta.type && opts.meta.site_name } class="sub">
          { opts.meta.type }
          ({ opts.meta.site_name })
        </span>
      </h1>
      <p if={ opts.meta.description } class="description">
        { opts.meta.description }
      </p>
      <div class="toolbar">
        <a class="button" href="#" onclick={ remove }>
          <core-icon name="trashcan" width="24px" height="24px"></core-icon>
          Delete
        </a>
      </div>
    </div>
  </article>
  <script type="es6">
    this.getHref = () => `${this.wallaby.config.rocket_uri}/${opts.docId}?page=${opts.page}&panel=${opts.panel}&smartpanel=${opts.smartpanel ? 1 : 0}`

    this.remove = () => {
      if(window.confirm(`Are you sure you want to delete the bookmark for "${opts.meta.title}?"`)) {
        this.wallaby.deleteBookmark(opts.docId, opts.state.auth)
          .then(() => {
            this.notify('info', `Successfully deleted "${opts.meta.title}"`)
            opts.state.bookmarks = null
            opts.state.trigger('update')
          })
          .catch((err) => {
            this.notify('error', err.message || 'Unexpected error')
          })
      }
    }
  </script>
</wallaby-bookmark>
