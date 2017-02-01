<wallaby-bookmark>
  <div class="row bookmark">
    <div class="col-4 image">
      <img if={ opts.meta.image } src="{ opts.meta.image }" alt="{ opts.meta.title }" />
    </div>
    <div class="col-8 content">
      <h3 if={ opts.meta.title } class="title">
        <a class="name" href={ getHref() } target="_blank">{ opts.meta.title } [pg. { opts.page }]</a>
        <span if={ opts.meta.type && opts.meta.site_name } class="sub font-light">
          { opts.meta.type }
          ({ opts.meta.site_name })
        </span>
      </h3>
      <p if={ opts.meta.description } class="description">
        { opts.meta.description }
      </p>
      <p if={ opts.updatedAt } class="date sub">
        bookmarked { moment(opts.updatedAt).fromNow() }
      </p>
      <div class="toolbar">
        <a class="button" href="#" onclick={ remove }>
          <core-icon name="trashcan" width="24px" height="24px"></core-icon>
          Delete
        </a>
      </div>
    </div>
  </div>
  <script type="es6">
    this.moment = riot.mixin('moment')
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
  <style scoped>
    .image img {
      width: 100%;
    }

    .sub {
      font-size: 1rem;
    }

    h3.title {
      font-size: 1.5rem;
      margin-top: 0;
    }

    .title .sub {
      display: block;
    }

    .button svg.core-icon {
      vertical-align: text-bottom;
    }
  </style>
</wallaby-bookmark>
