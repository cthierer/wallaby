<wallaby-toolbar>
  <div if={ opts.state.auth } class="row">
    <div class="col-12">
      <ul class="toolbar inline no-bullets">
        <li>
          <wallaby-export state={ opts.state }>
            <core-icon name="cloud-download" width="18px" height="18px"></core-icon>
            download
          </wallaby-export>
        </li>
        <li>
          <wallaby-import state={ opts.state }>
            <core-icon name="cloud-upload" width="18px" height="18px"></core-icon>
            import
          </wallaby-import>
        </li>
      </ul>
    </div>
  </div>
  <style scoped>
    .toolbar {
      margin: 0;
    }
  </style>
</wallaby-toolbar>
